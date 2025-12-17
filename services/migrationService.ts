
import { supabase } from './supabase';

export const migrateLocalData = async (userId: string) => {
    if (!supabase) return;

    try {
        console.log('🔄 Starting data migration for user:', userId);

        // 1. Migrate Profile
        const localProfileParam = localStorage.getItem('dreamcast_profile');
        if (localProfileParam) {
            const localProfile = JSON.parse(localProfileParam);

            // Check if profile exists
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (!existingProfile) {
                const { error } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        child_name: localProfile.name || 'Enfant',
                        child_age: localProfile.age || 5,
                        avatar_emoji: localProfile.avatar || '🦊',
                        interests: localProfile.interests || [],
                        values: localProfile.values || []
                    });
                if (error) console.error('Error migrating profile:', error);
                else console.log('✅ Profile migrated');
            }
        }

        // 2. Migrate GoodNight Settings
        const theme = localStorage.getItem('dreamcast_goodnight_theme');
        // We assume message is static default if not in LS, but let's check if we saved it?
        // In the editor we have local state, but usually we should sync it. 
        // The recent GoodNightEditor didn't explicitly save message to LS in the main flow, 
        // but let's check if we did in previous versions. 
        // The new code I wrote uses 'dreamcast_goodnight_theme'. 

        if (theme) {
            const { data: existingSettings } = await supabase
                .from('goodnight_settings')
                .select('user_id')
                .eq('user_id', userId)
                .single();

            if (!existingSettings) {
                const { error } = await supabase
                    .from('goodnight_settings')
                    .insert({
                        user_id: userId,
                        theme_id: theme
                    });
                if (error) console.error('Error migrating settings:', error);
                else console.log('✅ GoodNight settings migrated');
            }
        }

        // 3. Migrate Schedules
        const localSchedules = localStorage.getItem('dreamcast_schedules');
        if (localSchedules) {
            const schedules = JSON.parse(localSchedules);
            if (Array.isArray(schedules) && schedules.length > 0) {
                // Check if schedules already exist to avoid duplicates
                const { count } = await supabase
                    .from('schedules')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId);

                if (count === 0) {
                    const rows = schedules.map((s: any) => ({
                        user_id: userId,
                        title: s.title,
                        time: s.time,
                        days: Array.isArray(s.days) ? s.days : [s.days], // Handle legacy format
                        type: s.type || 'routine',
                        active: s.active ?? true
                    }));

                    const { error } = await supabase
                        .from('schedules')
                        .insert(rows);

                    if (error) console.error('Error migrating schedules:', error);
                    else console.log('✅ Schedules migrated');
                }
            }
        }


        // 4. Migrate Stories
        const localStories = localStorage.getItem('dreamcast_stories');
        if (localStories) {
            try {
                const stories = JSON.parse(localStories);
                if (Array.isArray(stories) && stories.length > 0) {
                    // Check existing stories count
                    const { count } = await supabase
                        .from('stories')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId);

                    if (count === 0) {
                        const rows = stories.map((s: any) => ({
                            user_id: userId,
                            title: s.title || 'Histoire sans titre',
                            theme: s.theme || 'Aventure',
                            duration: s.duration || 300,
                            audio_url: s.audioUrl || null,
                            is_favorite: s.isFavorite || false,
                            created_at: s.createdAt || new Date().toISOString()
                        }));

                        const { error } = await supabase.from('stories').insert(rows);
                        if (error) console.error('Error migrating stories:', error);
                        else console.log('✅ Stories migrated');
                    }
                }
            } catch (e) {
                console.error('Error parsing local stories:', e);
            }
        }

        console.log('✨ Migration complete');

        // Optional: Mark migration as done in LS to avoid re-running logic every time?
        // Or we rely on the DB checks (idempotency). Idempotency is safer.

    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
};
