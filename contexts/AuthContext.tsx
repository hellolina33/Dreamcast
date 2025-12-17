
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { migrateLocalData } from '../services/migrationService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isRecoveryMode: boolean;
    clearRecoveryMode: () => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isRecoveryMode: false,
    clearRecoveryMode: () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            console.log("Supabase not configured. AuthProvider running in offline mode.");
            setLoading(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Detect Password Recovery flow
            if (_event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            }

            if (_event === 'SIGNED_IN' && session?.user) {
                // Ensure a profile row exists for this user
                const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert({ id: session.user.id, parent_email: session.user.email }, { onConflict: 'id' });

                if (upsertError) {
                    console.error('Failed to ensure profile exists:', upsertError);
                }

                migrateLocalData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const clearRecoveryMode = () => setIsRecoveryMode(false);

    const signOut = async () => {
        if (isSupabaseConfigured()) {
            await supabase.auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, isRecoveryMode, clearRecoveryMode, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
