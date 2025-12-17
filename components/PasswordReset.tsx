import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Lock, KeyRound, AlertCircle, Check } from 'lucide-react';
import { Button } from './Button';

interface PasswordResetProps {
    onComplete: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 bg-night-950 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-dream-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-dream-500 to-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-dream-500/30 mb-4 transform rotate-6">
                        <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Nouveau Mot de Passe</h1>
                    <p className="text-dream-200">Choisis un mot de passe sécurisé.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">C'est fait !</h3>
                            <p className="text-slate-400">Ton mot de passe a été changé. Redirection...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-200 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleReset} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">Nouveau mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-dream-400 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-night-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-dream-500/50 focus:bg-night-900 transition-all placeholder:text-slate-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">Confirmer le mot de passe</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-dream-400 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-night-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-dream-500/50 focus:bg-night-900 transition-all placeholder:text-slate-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full mt-6"
                                >
                                    Changer le Mot de Passe
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
