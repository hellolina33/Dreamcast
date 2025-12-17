
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { migrateLocalData } from '../services/migrationService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

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

            if (_event === 'SIGNED_IN' && session?.user) {
                // Trigger migration only on explicit sign-in to avoid spamming on every refresh?
                // Actually 'INITIAL_SESSION' is also fine if strict checks are in place.
                // But migration likely only needed once in life.
                // Let's rely on the service's internal checks for safety.
                migrateLocalData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        if (isSupabaseConfigured()) {
            await supabase.auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
