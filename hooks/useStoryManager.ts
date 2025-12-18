import React, { useState, useEffect } from 'react';
import { Story, StoryParams, ChildProfile, AppState } from '../types';
import { INITIAL_STORY_PARAMS } from '../constants';
import { generateStoryScript, generateSpeech, generateCoverImage } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { triggerConfetti } from '../utils/confetti';

interface UseStoryManagerProps {
    user: User | null;
    childProfile: ChildProfile;
    setAppState: (state: AppState) => void;
    checkAccess: () => boolean;
    incrementDailyCount: () => void;
    setErrorState: (state: 'OFFLINE' | 'GENERIC' | null) => void;
}

export const useStoryManager = ({
    user,
    childProfile,
    setAppState,
    checkAccess,
    incrementDailyCount,
    setErrorState
}: UseStoryManagerProps) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoadingStories, setIsLoadingStories] = useState(true);
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState(1);
    const [isNewStory, setIsNewStory] = useState(false);
    // Safety fallback if import fails
    const defaultParams = INITIAL_STORY_PARAMS || {
        childName: '', avatar: '🧑‍🚀', age: 5, theme: '', moral: '',
        useRealFacts: false, location: '', imageStyle: 'cartoon',
        duration: 10, languageLevel: '5-7', narrativeStyle: 'cooperative', voiceId: 'Leda'
    };
    const [storyParams, setStoryParams] = useState<StoryParams>(defaultParams);

    // Initial Load from Supabase
    useEffect(() => {
        const fetchStories = async () => {
            if (!user) {
                setIsLoadingStories(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map DB structure to Story type
                const validStories: Story[] = (data || []).map(row => ({
                    id: row.id,
                    user_id: row.user_id,
                    title: row.title,
                    script: row.script_content,
                    coverImageUrl: row.cover_url,
                    audioUrl: row.audio_url,
                    createdAt: new Date(row.created_at).getTime(),
                    duration: row.duration_seconds || 0,
                    isFavorite: row.is_favorite || false,
                    params: {
                        theme: row.theme,
                        // Defaulting other params since DB might not have all legacy fields or we just need theme/visuals for now
                        childName: childProfile.name,
                        age: childProfile.age,
                        language: 'fr',
                        moral: '',
                        imageStyle: '3D Disney Pixar',
                        voiceId: 'fr-FR-Neural2-B'
                    },
                    // Audio buffer will be loaded on demand or handled by audioUrl
                    audioBuffer: null
                }));
                setStories(validStories);
            } catch (err) {
                console.error("Failed to load stories from Supabase:", err);
                // Fallback to localStorage if offline?
                const savedStories = localStorage.getItem('dreamcast_stories_v2');
                if (savedStories) {
                    try { setStories(JSON.parse(savedStories)); } catch (e) { }
                }
            } finally {
                setIsLoadingStories(false);
            }
        };

        fetchStories();
    }, [user, childProfile]);

    const activeStory = stories.find(s => s.id === activeStoryId) || null;

    const updateParams = (updates: Partial<StoryParams>) => {
        setStoryParams(prev => ({ ...prev, ...updates }));
    };

    const handleCreate = async () => {
        // Free tier limit enforcement
        if (!checkAccess()) {
            setAppState(AppState.PAYWALL);
            return;
        }
        if (!navigator.onLine) { setErrorState('OFFLINE'); return; }

        setAppState(AppState.GENERATING);
        setLoadingStep(1);

        try {
            // 1. Generate Text
            const scriptData = await generateStoryScript(storyParams, childProfile);

            setLoadingStep(2);
            // 2. Generate Cover (Base64 or URL)
            let coverUrl = await generateCoverImage(scriptData.title + " " + storyParams.theme, storyParams.imageStyle);

            setLoadingStep(3);
            // 3. Generate Audio
            const { audioBuffer, audioBlob } = await generateSpeech(scriptData.script, storyParams.voiceId);

            setLoadingStep(4);
            // 4. Upload Assets to Supabase Storage
            const storyId = crypto.randomUUID();
            const userId = user?.id || 'guest';

            // Upload Audio
            const remoteAudioUrl = await storageService.uploadStoryAudio(userId, storyId, audioBlob);

            // Upload Cover (if Base64)
            if (coverUrl.startsWith('data:')) {
                const fetchRes = await fetch(coverUrl);
                const blob = await fetchRes.blob();
                const remoteCoverUrl = await storageService.uploadStoryCover(userId, storyId, blob);
                if (remoteCoverUrl) coverUrl = remoteCoverUrl;
            }

            const newStory: Story = {
                id: storyId,
                user_id: userId,
                title: scriptData.title,
                script: scriptData.script,
                ambience: scriptData.ambience,
                audioBuffer: audioBuffer,
                audioUrl: remoteAudioUrl || undefined,
                coverImageUrl: coverUrl,
                createdAt: Date.now(),
                duration: audioBuffer.duration,
                isFavorite: false,
                params: { ...storyParams }
            };

            // 5. Save to Supabase DB
            if (user) {
                const { error } = await supabase.from('stories').insert({
                    id: storyId,
                    user_id: userId,
                    title: newStory.title,
                    script_content: newStory.script,
                    audio_url: remoteAudioUrl,
                    cover_url: coverUrl,
                    duration_seconds: Math.round(newStory.duration),
                    theme: newStory.params.theme,
                    is_favorite: false
                });
                if (error) console.error("DB Save Error", error);
            }

            setStories(prev => [newStory, ...prev]);
            setActiveStoryId(newStory.id);
            setIsNewStory(true);
            setAppState(AppState.PLAYER);
            incrementDailyCount();
            triggerConfetti();
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

            if (errorMessage.includes("429") || errorMessage.includes("quota")) {
                alert("Oups ! Les lutins sont fatigués (Quota dépassé). Réessaie dans une minute ! ⏳");
                setAppState(AppState.WIZARD);
                return;
            }

            if (errorMessage.includes("connexion") || !navigator.onLine) {
                setErrorState('OFFLINE');
            } else {
                setErrorState('GENERIC');
            }
            setAppState(AppState.WIZARD);
        }
    };

    const handleSequel = (story: Story) => {
        setStoryParams({
            ...story.params,
            previousContext: `HISTOIRE PRÉCÉDENTE ("${story.title}"):\n${story.script}`,
            theme: `La suite des aventures de ${story.params.childName}`,
            moral: ""
        });
        setAppState(AppState.WIZARD);
    };

    const handleOpenStory = (story: Story) => {
        setActiveStoryId(story.id);
        setIsNewStory(false);
        setAppState(AppState.PLAYER);
    };

    const toggleFavorite = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        // Optimistic update
        setStories(prev => prev.map(s => {
            if (s.id === id) {
                const newStatus = !s.isFavorite;
                // Sync to DB
                if (user) {
                    supabase.from('stories').update({ is_favorite: newStatus }).eq('id', id).then(({ error }) => {
                        if (error) console.error('Failed to toggle favorite', error);
                    });
                }
                return { ...s, isFavorite: newStatus };
            }
            return s;
        }));
    };

    const deleteStory = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Supprimer ?")) {
            // Optimistic update
            setStories(prev => prev.filter(s => s.id !== id));
            if (user) {
                const { error } = await supabase.from('stories').delete().eq('id', id);
                if (error) console.error("Failed to delete story", error);
            }
        }
    };

    const startWizard = () => {
        if (!navigator.onLine) { setErrorState('OFFLINE'); return; }
        // Reset params but keep child info
        setStoryParams(prev => ({
            ...INITIAL_STORY_PARAMS,
            childName: childProfile.name,
            avatar: childProfile.avatar,
            age: childProfile.age,
            voiceId: prev.voiceId // Keep last used voice
        }));
        setAppState(AppState.WIZARD);
    };

    return {
        stories,
        isLoadingStories,
        setStories,
        activeStory,
        isNewStory,
        loadingStep,
        storyParams,
        setStoryParams,
        updateParams,
        handleCreate,
        handleSequel,
        handleOpenStory,
        toggleFavorite,
        deleteStory,
        startWizard
    };
};
