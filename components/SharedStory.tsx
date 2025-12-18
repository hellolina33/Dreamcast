import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Story } from '../types';
import { Play, ArrowLeft, Share2, Heart, Music, Mic2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const SharedStory: React.FC<{ storyId: string, onBack: () => void }> = ({ storyId, onBack }) => {
    const [story, setStory] = useState<Story | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('id', storyId)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Story not found");

                setStory({
                    id: data.id,
                    title: data.title,
                    script: data.script_content,
                    coverImageUrl: data.cover_url,
                    audioUrl: data.audio_url,
                    createdAt: new Date(data.created_at).getTime(),
                    duration: data.duration_seconds || 0,
                    isFavorite: false,
                    params: { theme: data.theme } as any
                });
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStory();
    }, [storyId]);

    const togglePlay = () => {
        if (!story?.audioUrl) return;

        if (!audio) {
            const newAudio = new Audio(story.audioUrl);
            newAudio.onended = () => setIsPlaying(false);
            setAudio(newAudio);
            newAudio.play();
            setIsPlaying(true);
        } else {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    if (isLoading) return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-night-950">
            <div className="w-16 h-16 border-4 border-dream-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-indigo-300 font-bold">Chargement de l'histoire...</p>
        </div>
    );

    if (error || !story) return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-night-950 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Music className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Oups !</h2>
            <p className="text-slate-400 mb-8">Nous n'avons pas pu trouver cette histoire. Elle a peut-être été supprimée.</p>
            <button onClick={onBack} className="px-8 py-3 bg-dream-500 rounded-full font-bold text-white jelly-btn">Retour</button>
        </div>
    );

    return (
        <div className="h-full bg-night-950 flex flex-col pt-12 pb-8 px-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white jelly-btn">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest border border-white/5">
                    Héritage DreamCast
                </div>
                <div className="w-8"></div>
            </div>

            {/* Poster Card */}
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl mb-8 group">
                <img
                    src={story.coverImageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80'}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-3 drop-shadow-lg leading-tight uppercase tracking-tight">
                        {story.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/70 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Mic2 className="w-4 h-4" /> DreamCast AI</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>{Math.floor(story.duration / 60)} min</span>
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <div className="clay-card p-6 mb-8 flex flex-col items-center">
                <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
                    Écoutez cette histoire générée avec amour par DreamCast. Rejoignez l'aventure pour créer les vôtres !
                </p>
                <button
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-dream-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] jelly-btn-heavy"
                >
                    {isPlaying ? (
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                        </div>
                    ) : <Play className="w-10 h-10 fill-white ml-1.5" />}
                </button>
            </div>

            {/* CTA */}
            <div className="mt-auto flex flex-col gap-4">
                <button
                    onClick={() => window.open('https://dreamcast-kids.vercel.app', '_blank')}
                    className="w-full py-4 bg-gradient-to-r from-neon-pink to-dream-500 rounded-3xl font-black text-white text-center shadow-xl jelly-btn uppercase tracking-widest"
                >
                    Créer mon histoire gratuite
                </button>
                <div className="flex justify-center gap-6 text-slate-500">
                    <button className="flex items-center gap-2 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"><Share2 className="w-4 h-4" /> Partager</button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"><Heart className="w-4 h-4" /> Liker</button>
                </div>
            </div>
        </div>
    );
};
