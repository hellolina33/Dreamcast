
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Mail, Lock, LogIn, UserPlus, Sparkles, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from './Button';

interface LoginScreenProps {
    onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isForgotPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                setSuccess("Email de réinitialisation envoyé ! Vérifie ta boîte de réception.");
                setEmail('');
            } else if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("Compte créé ! Vérifie tes emails ou connecte-toi.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 bg-night-950 overflow-hidden">
                {/* Background Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-dream-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-dream-500 to-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-dream-500/30 mb-4 transform rotate-6">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Club Dream</h1>
                    <p className="text-dream-200">Rejoins l'aventure magique.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    {!isForgotPassword && (
                        <div className="flex bg-black/20 rounded-xl p-1 mb-8">
                            <button
                                onClick={() => setIsSignUp(false)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => setIsSignUp(true)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white/10 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Inscription
                            </button>
                        </div>
                    )}

                    {isForgotPassword && (
                        <div className="mb-6 text-center">
                            <KeyRound className="w-12 h-12 text-dream-400 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-white mb-2">Mot de passe oublié ?</h3>
                            <p className="text-sm text-slate-400">Entre ton email pour recevoir un lien de réinitialisation.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-200 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3 text-emerald-200 text-sm">
                            <Mail className="w-4 h-4 shrink-0" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-dream-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-night-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-dream-500/50 focus:bg-night-900 transition-all placeholder:text-slate-600"
                                    placeholder="parents@exemple.com"
                                />
                            </div>
                        </div>

                        {!isForgotPassword && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-3">Mot de passe</label>
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
                        )}

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full mt-6"
                        >
                            {isForgotPassword ? (
                                <>Envoyer le lien <Mail className="w-4 h-4 ml-2" /></>
                            ) : isSignUp ? (
                                <>Créer mon compte <UserPlus className="w-4 h-4 ml-2" /></>
                            ) : (
                                <>Se connecter <LogIn className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>

                        {!isForgotPassword && !isSignUp && (
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                className="w-full text-center text-sm text-dream-300 hover:text-dream-200 transition-colors mt-4"
                            >
                                Mot de passe oublié ?
                            </button>
                        )}

                        {isForgotPassword && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors mt-4"
                            >
                                ← Retour à la connexion
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
