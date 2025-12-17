
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface GoodNightSettings {
    themeId: string;
    message: string;
    voiceId: string;
}

export interface Schedule {
    id: string;
    title: string;
    time: string;
    days: string[];
    type: 'routine' | 'event';
    active: boolean;
}

export const useGoodNightSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<GoodNightSettings>({
        themeId: 'stars',
        message: "Dors bien mon petit chéri, fais de beaux rêves remplis d'aventures magiques...",
        voiceId: 'default'
    });
    const [loading, setLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        setLoading(true);
        // 1. Try Local Storage first (fastest)
        const localTheme = localStorage.getItem('dreamcast_goodnight_theme');
        /* 
           Note: We haven't strictly saved 'message' to LS in the previous code 
           except implied state in Editor. We should start saving it.
        */
        const localMessage = localStorage.getItem('dreamcast_goodnight_message');

        if (localTheme || localMessage) {
            setSettings(prev => ({
                ...prev,
                themeId: localTheme || prev.themeId,
                message: localMessage || prev.message
            }));
        }

        // 2. Try Supabase if user
        if (user) {
            try {
                const { data, error } = await supabase
                    .from('goodnight_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setSettings({
                        themeId: data.theme_id || 'stars',
                        message: data.message || "Dors bien mon petit chéri, fais de beaux rêves remplis d'aventures magiques...",
                        voiceId: data.voice_id || 'default'
                    });
                    // Sync back to local storage for offline
                    localStorage.setItem('dreamcast_goodnight_theme', data.theme_id || 'stars');
                    if (data.message) localStorage.setItem('dreamcast_goodnight_message', data.message);
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSettings = async (newSettings: Partial<GoodNightSettings>) => {
        // Optimistic update
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            // Save to Local Storage
            if (newSettings.themeId) localStorage.setItem('dreamcast_goodnight_theme', newSettings.themeId);
            if (newSettings.message) localStorage.setItem('dreamcast_goodnight_message', newSettings.message);
            return updated;
        });

        // Save to Supabase
        if (user) {
            const { error } = await supabase
                .from('goodnight_settings')
                .upsert({
                    user_id: user.id,
                    theme_id: newSettings.themeId,
                    message: newSettings.message,
                    voice_id: newSettings.voiceId,
                    updated_at: new Date().toISOString()
                });
            if (error) console.error('Error saving settings:', error);
        }
    };

    return { settings, updateSettings, loading };
};

export const useSchedules = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSchedules = useCallback(async () => {
        setLoading(true);
        // Local first
        const local = localStorage.getItem('dreamcast_schedules');
        if (local) {
            try { setSchedules(JSON.parse(local)); } catch (e) { }
        }

        // Cloud sync
        if (user) {
            const { data, error } = await supabase
                .from('schedules')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (data) {
                // Determine source of truth: Cloud usually wins or we merge?
                // For simplicity, Cloud wins if available.
                const cloudSchedules: Schedule[] = data.map((d: any) => ({
                    id: d.id, // Supabase UUID
                    title: d.title,
                    time: d.time,
                    days: d.days,
                    type: d.type,
                    active: d.active
                }));
                setSchedules(cloudSchedules);
                localStorage.setItem('dreamcast_schedules', JSON.stringify(cloudSchedules));
            }
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadSchedules();
    }, [loadSchedules]);

    const saveSchedule = async (schedule: Omit<Schedule, 'id'>) => {
        const tempId = Date.now().toString();
        const newSchedule = { ...schedule, id: tempId };

        // Optimistic
        const updated = [...schedules, newSchedule];
        setSchedules(updated);
        localStorage.setItem('dreamcast_schedules', JSON.stringify(updated));

        if (user) {
            const { data, error } = await supabase
                .from('schedules')
                .insert([{
                    user_id: user.id,
                    title: schedule.title,
                    time: schedule.time,
                    days: schedule.days,
                    type: schedule.type,
                    active: schedule.active
                }])
                .select();

            if (data) {
                // Replace temp ID with real ID
                const realId = data[0].id;
                const fixed = updated.map(s => s.id === tempId ? { ...s, id: realId } : s);
                setSchedules(fixed);
                localStorage.setItem('dreamcast_schedules', JSON.stringify(fixed));
            }
        }
    };

    const toggleActive = async (id: string, active: boolean) => {
        const updated = schedules.map(s => s.id === id ? { ...s, active } : s);
        setSchedules(updated);
        localStorage.setItem('dreamcast_schedules', JSON.stringify(updated));

        if (user) {
            await supabase.from('schedules').update({ active }).eq('id', id);
        }
    };

    const deleteSchedule = async (id: string) => {
        const updated = schedules.filter(s => s.id !== id);
        setSchedules(updated);
        localStorage.setItem('dreamcast_schedules', JSON.stringify(updated));

        if (user) {
            await supabase.from('schedules').delete().eq('id', id);
        }
    };

    return { schedules, saveSchedule, toggleActive, deleteSchedule, loading };
};
