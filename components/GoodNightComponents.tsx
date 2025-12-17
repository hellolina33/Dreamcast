
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Settings, PlayCircle, Edit2, History, MessageSquare,
    Check, Play, Pause, X, Calendar, Clock, Moon, Cloud, Droplets, Trees,
    Heart, Repeat, Search, Smile, Frown, Meh, ThumbsUp, ChevronRight,
    Copy, Edit3, Plus, Star, Sparkles, Quote, Music, User, Sliders, BookOpen, Share2, SkipBack, SkipForward, Wind, Volume2, Flame
} from 'lucide-react';
import { sharedAudio } from '../services/audioEngine';
import { Button } from './Button';
import { useGoodNightSettings, useSchedules } from '../hooks/useGoodNightData';

// --- Shared Components ---

export const StarBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_30%,rgba(60,45,230,0.15)_0%,rgba(5,5,5,0)_60%)]" />
        <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white rounded-full opacity-30" />
        <div className="absolute top-[15%] left-[80%] w-0.5 h-0.5 bg-white rounded-full opacity-30" />
        <div className="absolute top-[25%] left-[10%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-[40%] left-[85%] w-0.5 h-0.5 bg-white rounded-full opacity-30" />
        <div className="absolute top-[60%] left-[15%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-[75%] left-[70%] w-0.5 h-0.5 bg-white rounded-full opacity-30" />
    </div>
);

// --- 1. Good Night Home ---

interface GoodNightHomeProps {
    name: string;
    onBack: () => void;
    onLaunch: () => void;
    onEdit: () => void;
    onSettings: () => void;
}

export const GoodNightHome: React.FC<GoodNightHomeProps> = ({ name, onBack, onLaunch, onEdit, onSettings }) => {
    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative overflow-hidden">
            <StarBackground />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-2 pt-8">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 opacity-80">
                    <Moon className="w-5 h-5 text-[#3c2de6] fill-current" />
                    <span className="text-sm font-bold tracking-widest uppercase text-slate-500">DreamCast</span>
                </div>
                <button onClick={onSettings} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 gap-6">
                {/* Hero Illustration */}
                <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-[#3c2de6]/20 blur-[80px] rounded-full animate-pulse-slow"></div>
                    <div className="relative z-10 transform hover:scale-110 transition-transform duration-700 text-[200px] leading-none select-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center grayscale-[0.2]">
                        🌕
                    </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-3 mb-2">
                    <h1 className="text-white text-[42px] font-display font-bold leading-tight tracking-tight drop-shadow-lg">
                        Bonne nuit, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{name}</span> !
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-[0.2em] uppercase opacity-70">Prêt pour l'aventure ?</p>
                </div>

                {/* Message Card */}
                <div className="w-full">
                    <div className="relative flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shrink-0 border border-[#3c2de6]/50 shadow-inner bg-[#3c2de6]/20 flex items-center justify-center">
                            <Moon className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                            <div className="flex items-center justify-between">
                                <span className="text-indigo-300 text-xs font-black tracking-widest uppercase">Message du soir</span>
                                <Quote className="w-4 h-4 text-white/20 fill-current" />
                            </div>
                            <p className="text-slate-200 text-[15px] font-normal leading-relaxed">
                                Prêt pour une nuit magique ? Lance l'histoire pour commencer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full pb-8 flex flex-col gap-5 mt-auto">
                    <button onClick={onLaunch} className="group relative w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-[#3c2de6] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] active:scale-[0.98] transition-all rounded-full shadow-[0_10px_40px_-10px_rgba(60,45,230,0.6)] overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <PlayCircle className="w-7 h-7 text-white fill-current/20" />
                        <span className="text-white text-lg font-bold tracking-wide">Lancer l'histoire</span>
                    </button>
                    <div className="flex justify-center">
                        <button onClick={onEdit} className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold uppercase tracking-wider flex items-center gap-2 py-2 px-4 rounded-full hover:bg-white/5">
                            <Edit2 className="w-3 h-3" /> Modifier le message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. Good Night Editor ---

interface GoodNightEditorProps {
    onBack: () => void;
    onHistory: () => void;
    onSave: () => void;
    onTheme: () => void;
}

export const GoodNightEditor: React.FC<GoodNightEditorProps> = ({ onBack, onHistory, onSave, onTheme }) => {
    const { settings, updateSettings, loading } = useGoodNightSettings();
    const [message, setMessage] = useState(settings.message);
    const [charCount, setCharCount] = useState(settings.message.length);
    const [isPlaying, setIsPlaying] = useState(false);

    // Sync local state when settings invoke/change
    useEffect(() => {
        if (!loading && settings.message) {
            setMessage(settings.message);
            setCharCount(settings.message.length);
        }
    }, [settings.message, loading]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= 150) {
            setMessage(text);
            setCharCount(text.length);
        }
    };

    const handleSave = () => {
        updateSettings({ message });
        onSave();
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="flex flex-col h-full bg-[#050510] animate-fade-in relative font-sans text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-12 pb-6 relative z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-[#1a1a24] border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base font-bold text-white tracking-wide">Modifier le message</h2>
                <button
                    onClick={onHistory}
                    className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-indigo-400 transition-colors"
                >
                    <History className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 relative z-10">

                {/* Message Section */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                    <span>Message pour Léo</span>
                    <span className="bg-[#2e2b5c] text-indigo-300 px-2 py-0.5 rounded-md text-[9px] border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">Actif</span>
                </div>

                <div className="relative group mb-2">
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-[#151520] border border-white/10 rounded-3xl p-5 focus-within:border-indigo-500/50 transition-colors">
                        <textarea
                            value={message}
                            onChange={handleTextChange}
                            placeholder="Écrivez un message doux..."
                            className="w-full bg-transparent text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none min-h-[120px] leading-relaxed"
                        />
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <button className="text-slate-500 hover:text-indigo-400 transition-colors">
                                <Smile className="w-5 h-5" />
                            </button>
                            <span className="text-[10px] font-bold text-slate-600">{charCount} / 150</span>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-slate-500 font-medium pl-2 mb-10">
                    Ce message sera lu avant le début de l'histoire.
                </p>

                {/* Voice & Preview Section */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Aperçu & Voix</span>
                    <button onClick={onTheme} className="text-[10px] font-bold tracking-wider text-indigo-400 hover:text-white transition-colors uppercase">Changer le thème</button>
                </div>

                {/* Voice Card */}
                <div className="bg-[#151520] border border-white/10 rounded-3xl p-4 flex items-center justify-between mb-4 hover:border-white/20 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Plus className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cloner ma voix (Premium)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="relative z-20 p-6 pt-2 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
                    <button onClick={handleSave} className="group relative w-full h-14 flex items-center justify-center gap-2 bg-[#3c2de6] hover:bg-indigo-600 active:scale-[0.98] transition-all rounded-full shadow-[0_0_30px_-5px_rgba(60,45,230,0.5)]">
                        <span className="text-white text-[15px] font-semibold tracking-wide">Enregistrer les changements</span>
                        <Check className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full mt-4 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
                        Rétablir le message par défaut
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 3. Good Night Theme ---

interface GoodNightThemeProps {
    onBack: () => void;
    onApply: () => void;
}

const THEMES = [
    { id: 'stars', title: "Ciel étoilé", sub: "Calme et scintillant", icon: <Moon className="w-7 h-7" />, color: 'indigo' },
    { id: 'clouds', title: "Doux nuages", sub: "Léger et vaporeux", icon: <Cloud className="w-7 h-7" />, color: 'sky' },
    { id: 'forest', title: "Forêt endormie", sub: "Nature et sérénité", icon: <Trees className="w-7 h-7" />, color: 'emerald' },
    { id: 'ocean', title: "Océan nocturne", sub: "Vagues apaisantes", icon: <Droplets className="w-7 h-7" />, color: 'blue' },
];

const ThemeOption = ({ icon, title, sub, active, onClick }: { icon: React.ReactNode, title: string, sub: string, active: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`relative flex items-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${active ? 'bg-[#3c2de6]/10 border-[#3c2de6] shadow-[0_0_15px_-3px_rgba(60,45,230,0.4)]' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
    >
        <div className={`size-14 rounded-xl flex items-center justify-center mr-4 shrink-0 border ${active ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/5'}`}>
            {icon}
        </div>
        <div className="flex-1">
            <h3 className={`font-semibold text-base mb-0.5 ${active ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
            <p className={`text-xs ${active ? 'text-indigo-200/60' : 'text-slate-500'}`}>{sub}</p>
        </div>
        <div className={`size-6 rounded-full flex items-center justify-center transition-all ${active ? 'bg-[#3c2de6] shadow-lg' : 'border-2 border-white/20'}`}>
            {active && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
        </div>
    </div>
);

export const GoodNightTheme: React.FC<GoodNightThemeProps> = ({ onBack, onApply }) => {
    const { settings, updateSettings, loading } = useGoodNightSettings();
    const [selectedTheme, setSelectedTheme] = useState(settings.themeId);
    const [isPlaying, setIsPlaying] = useState(false);

    // Sync from hook
    useEffect(() => {
        if (!loading) setSelectedTheme(settings.themeId);
    }, [settings.themeId, loading]);

    const handleApply = () => {
        updateSettings({ themeId: selectedTheme });
        onApply();
    };

    const togglePreview = () => {
        setIsPlaying(!isPlaying);
        // Simulate audio toggle
        if (!isPlaying) {
            setTimeout(() => setIsPlaying(false), 5000); // Auto stop after 5s for demo
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative overflow-hidden">
            <StarBackground />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 shrink-0">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base font-semibold tracking-wide text-white/90">Personnalisation</h2>
                <div className="size-10"></div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <div className="flex flex-col gap-6">
                    <div className="pt-2">
                        <h1 className="text-2xl font-bold text-white mb-2 leading-tight">Choisir l'ambiance</h1>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Sélectionnez un univers visuel et sonore qui accompagnera le message de bonne nuit.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {THEMES.map((theme) => (
                            <ThemeOption
                                key={theme.id}
                                icon={theme.icon}
                                title={theme.title}
                                sub={theme.sub}
                                active={selectedTheme === theme.id}
                                onClick={() => setSelectedTheme(theme.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full p-6 pt-2 pb-10 flex flex-col gap-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent shrink-0">
                <button
                    onClick={togglePreview}
                    className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl border transition-all ${isPlaying
                        ? 'text-white bg-[#3c2de6] border-[#3c2de6]'
                        : 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20'
                        }`}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span className="text-sm font-semibold tracking-wide">{isPlaying ? 'Arrêter l\'aperçu' : 'Écouter un aperçu'}</span>
                </button>
                <button onClick={handleApply} className="group relative w-full h-14 flex items-center justify-center gap-3 bg-[#3c2de6] hover:bg-indigo-600 active:scale-[0.98] transition-all rounded-full shadow-[0_0_40px_-10px_rgba(60,45,230,0.6)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="text-white text-base font-bold tracking-wide">Appliquer le thème</span>
                </button>
            </div>
        </div>
    );
};

// --- 4. Good Night History ---

export const GoodNightHistory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative overflow-hidden">
            <StarBackground />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-2 pt-8 shrink-0">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 opacity-80">
                    <Moon className="w-5 h-5 text-[#3c2de6] fill-current" />
                    <span className="text-sm font-bold tracking-widest uppercase text-slate-500">DreamCast</span>
                </div>
                <div className="size-10"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col px-6 pt-4 pb-0 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                    <h1 className="text-white text-[28px] font-bold leading-tight tracking-tight drop-shadow-sm mb-1">Historique</h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide opacity-80">Vos messages de bonne nuit</p>
                </div>

                {/* Search */}
                <div className="relative group mb-8 sticky top-0 z-20 backdrop-blur-md py-2 -mx-2 px-2">
                    <Search className="absolute left-5 top-5.5 w-5 h-5 text-slate-500 group-focus-within:text-[#3c2de6]" />
                    <input className="block w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#3c2de6] transition-all shadow-inner" placeholder="Rechercher..." type="text" />
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                    <button className="px-4 py-1.5 rounded-full bg-[#3c2de6]/20 text-[#3c2de6] text-xs font-bold border border-[#3c2de6]/30 whitespace-nowrap">Tous</button>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-xs font-medium border border-white/5 hover:bg-white/10 whitespace-nowrap transition-colors">Favoris</button>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-xs font-medium border border-white/5 hover:bg-white/10 whitespace-nowrap transition-colors">Cette semaine</button>
                </div>

                {/* List - Empty State */}
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <MessageSquare className="w-16 h-16 text-slate-600 mb-4" />
                    <p className="text-sm font-bold text-slate-500">Aucun message précédent</p>
                </div>
            </div>
        </div>
    );
};

// --- 5. Good Night Schedule ---

export const GoodNightSchedule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { schedules, saveSchedule, toggleActive, deleteSchedule } = useSchedules();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'routine' | 'event'>('routine');

    const handleSaveSchedule = (newSchedule: any) => {
        saveSchedule(newSchedule);
        setIsModalOpen(false);
    };

    // Generate next 5 days
    const dates = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const recurring = schedules.filter(s => s.type === 'routine');
    const special = schedules.filter(s => s.type === 'event');

    const formatDate = (date: Date) => {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return { day: days[date.getDay()], date: date.getDate() };
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative overflow-hidden">
            <StarBackground />
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pb-2 pt-8">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 opacity-90">
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Programmation</span>
                </div>
                <div className="size-10"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col px-6 pt-4 gap-6 overflow-y-auto custom-scrollbar">
                {/* Calendar Strip */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end px-1">
                        <h2 className="text-white text-lg font-bold capitalize">
                            {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-wide border border-indigo-500/30 px-2 py-1 rounded-full bg-indigo-500/10">Aujourd'hui</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        {dates.map((d, i) => {
                            const { day, date } = formatDate(d);
                            const isSelected = d.getDate() === selectedDate.getDate();
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(d)}
                                    className={`flex flex-col items-center justify-center flex-1 rounded-2xl border transition-all duration-300 ${isSelected
                                        ? 'h-20 bg-[#3c2de6] text-white shadow-lg border-indigo-400 scale-105 z-10'
                                        : 'h-16 bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                                        }`}
                                >
                                    <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? 'opacity-80' : ''}`}>{day}</span>
                                    <span className={`font-bold ${isSelected ? 'text-lg' : 'text-base'}`}>{date}</span>
                                    {isSelected && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Recurring Section */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1 pt-2">
                        <span className="text-white text-[15px] font-bold flex items-center gap-2">
                            <Repeat className="w-4 h-4 text-slate-400" /> Récurrents
                        </span>
                    </div>
                    {recurring.length === 0 ? (
                        <div className="p-6 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/[0.02]">
                            <p className="text-xs text-slate-500 mb-2">Aucune routine définie</p>
                            <button onClick={() => { setModalType('routine'); setIsModalOpen(true); }} className="text-xs font-bold text-indigo-400 uppercase tracking-wide hover:text-indigo-300 transition-colors">Créer une routine</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recurring.map(s => (
                                <ScheduleItem key={s.id} item={s} onDelete={() => deleteSchedule(s.id)} onToggle={() => toggleActive(s.id, !s.active)} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Events Section */}
                <div className="flex flex-col gap-3 pb-24">
                    <div className="flex items-center justify-between px-1 pt-2">
                        <span className="text-white text-[15px] font-bold flex items-center gap-2">
                            <Star className="w-4 h-4 text-slate-400" /> Événements Spéciaux
                        </span>
                    </div>
                    {special.length === 0 ? (
                        <div className="p-6 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/[0.02]">
                            <p className="text-xs text-slate-500">Aucun événement à venir</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {special.map(s => (
                                <ScheduleItem key={s.id} item={s} onDelete={() => deleteSchedule(s.id)} onToggle={() => toggleActive(s.id, !s.active)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Add Button */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
                <button
                    onClick={() => { setModalType('event'); setIsModalOpen(true); }}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-200 active:scale-[0.98] transition-all rounded-full shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                    <Plus className="w-6 h-6" />
                    <span className="text-[15px] font-bold tracking-wide">Ajouter une programmation</span>
                </button>
            </div>

            {/* Simple Modal Implementation */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
                    <div className="w-full h-[85%] sm:h-auto sm:max-w-sm bg-[#121118] rounded-t-[2rem] sm:rounded-3xl border-t sm:border border-white/10 p-6 flex flex-col gap-6 animate-slide-up">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {modalType === 'routine' ? 'Nouvelle Routine' : 'Nouvel Événement'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <ScheduleForm type={modalType} onSave={saveSchedule} onCancel={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

const ScheduleItem = ({ item, onDelete, onToggle }: any) => (
    <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm active:bg-white/10 transition-all">
        <div className={`flex items-center justify-center size-12 rounded-full border shrink-0 ${item.type === 'routine' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'}`}>
            {item.type === 'routine' ? <Clock className="w-6 h-6" /> : <Star className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-[15px] truncate">{item.time} - {item.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 text-xs">{item.days || 'Aujourd\'hui'}</span>
            </div>
        </div>
        <div onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${item.active ? 'bg-[#3c2de6]' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.active ? 'left-5.5' : 'left-0.5'}`} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <X className="w-3 h-3" />
        </button>
    </div>
);

const ScheduleForm = ({ type, onSave, onCancel }: any) => {
    const [title, setTitle] = useState(type === 'routine' ? 'Routine du soir' : 'Soirée spéciale');
    const [time, setTime] = useState('20:00');
    const [days, setDays] = useState(['Lun']);

    const toggleDay = (d: string) => {
        setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    };

    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre</label>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heure</label>
                <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none appearance-none"
                />
            </div>

            {type === 'routine' && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jours</label>
                    <div className="flex justify-between">
                        {weekDays.map(d => (
                            <button
                                key={d}
                                onClick={() => toggleDay(d)}
                                className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${days.includes(d) ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                            >
                                {d.charAt(0)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-4 flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium">
                    Annuler
                </button>
                <button
                    onClick={() => onSave({ title, time, days: type === 'routine' ? days.join(', ') : 'Une fois', type })}
                    className="flex-1 py-3 bg-[#3c2de6] hover:bg-indigo-600 rounded-xl text-white font-bold shadow-lg"
                >
                    Créer
                </button>
            </div>
        </div>
    );
};

// --- 6. Good Night Tips ---

export const GoodNightTips: React.FC<{ onBack: () => void, onWrite: () => void }> = ({ onBack, onWrite }) => {
    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative overflow-hidden">
            <StarBackground />
            <div className="relative z-10 flex items-center justify-between p-6 pb-4 pt-8 shrink-0">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 transition-colors border border-white/5">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-base font-semibold tracking-wide text-white">Conseils & Astuces</h1>
                <div className="size-10"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col px-6 pb-6 overflow-y-auto custom-scrollbar gap-6">
                <div className="space-y-2 mt-2">
                    <h2 className="text-2xl font-bold text-white leading-tight">Créer un message apaisant</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">Quelques astuces pour rédiger le mot parfait avant l'histoire du soir.</p>
                </div>

                <div className="grid gap-4">
                    <TipCard icon={<Heart className="w-5 h-5" />} color="indigo" title="Utilisez des mots doux" desc="Privilégiez un ton rassurant et calme. Des mots comme 'sécurité', 'calme', 'amour' aident à détendre." />
                    <TipCard icon={<Moon className="w-5 h-5" />} color="amber" title="Mentionnez la journée" desc="Rappelez un petit succès ou un moment joyeux de la journée pour finir sur une note positive." />
                    <TipCard icon={<Clock className="w-5 h-5" />} color="emerald" title="Restez concis" desc="Un message court est plus facile à assimiler juste avant de dormir. 2 ou 3 phrases suffisent." />
                </div>

                <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider opacity-80 pl-1">Exemples inspirants</h3>
                    <div className="flex flex-col gap-3">
                        <QuoteCard text="Je suis si fier de toi aujourd'hui. Dors bien mon petit astronaute, les étoiles te protègent." />
                        <QuoteCard text="Repose-toi bien pour être en pleine forme pour l'école demain. Je t'aime fort." />
                    </div>
                </div>

                <div className="relative z-20 pt-2 pb-10">
                    <button onClick={onWrite} className="w-full py-4 bg-[#3c2de6] hover:bg-indigo-600 active:scale-[0.98] transition-all rounded-full text-white font-bold text-base shadow-[0_0_20px_-5px_rgba(60,45,230,0.5)] flex items-center justify-center gap-2">
                        <Edit2 className="w-5 h-5" />
                        Rédiger mon message
                    </button>
                </div>
            </div>
        </div>
    );
};

const TipCard = ({ icon, color, title, desc }: any) => {
    const colors: any = { indigo: 'text-indigo-400 bg-indigo-500/10', amber: 'text-amber-400 bg-amber-500/10', emerald: 'text-emerald-400 bg-emerald-500/10' };
    return (
        <div className="bg-[#121118]/50 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-start gap-4">
                <div className={`shrink-0 flex items-center justify-center size-10 rounded-full ${colors[color]}`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm">{title}</h3>
                    <p className="text-slate-400 text-xs leading-5">{desc}</p>
                </div>
            </div>
        </div>
    );
};

const QuoteCard = ({ text }: any) => (
    <div className="relative group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
        <div className="absolute top-4 right-4 text-slate-600">
            <Copy className="w-4 h-4" />
        </div>
        <p className="text-indigo-200 text-sm font-medium italic pr-8">"{text}"</p>
    </div>
);

// --- 7. Good Night Player ---

export const GoodNightPlayer: React.FC<{ onBack: () => void, storyTitle?: string }> = ({ onBack, storyTitle = "L'Aventure Spatiale de Léo" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0-100
    const [elapsed, setElapsed] = useState(0); // Seconds
    const duration = 555; // 9:15 in seconds
    const [showMixer, setShowMixer] = useState(false);
    const [activeAmbience, setActiveAmbience] = useState<string | null>('rain');
    const [ambienceVol, setAmbienceVol] = useState(30);

    // Format time mm:ss
    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' + sec : sec}`;
    };

    // Simulate playback
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            sharedAudio.resume();
            interval = setInterval(() => {
                setElapsed(e => {
                    const next = e + 1;
                    if (next >= duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Update progress bar visual
    useEffect(() => {
        setProgress((elapsed / duration) * 100);
    }, [elapsed]);

    return (
        <div className="flex flex-col h-full bg-[#050510] animate-fade-in relative overflow-hidden">
            {/* Darker background for player */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29] via-[#050505] to-[#050505]" />
            <StarBackground />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-10">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase mb-1">En lecture</span>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            {/* Album Art / Visual */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 transition-all duration-500">
                {!showMixer ? (
                    <div className="relative w-64 h-64 rounded-full flex items-center justify-center mb-8 animate-float-slow group">
                        {/* Glow */}
                        <div className={`absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full transition-all duration-1000 ${isPlaying ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}`} />

                        {/* Circle Art */}
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1e1b4b] to-black border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                            <Moon className="w-24 h-24 text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.5)]" />

                            {/* Ripple */}
                            {isPlaying && (
                                <div className="absolute inset-0 border border-white/10 rounded-full animate-ping-slow" />
                            )}
                        </div>
                    </div>
                ) : (
                    // Mixer Visual Replacement when active
                    <SoundscapeMixer
                        active={activeAmbience}
                        vol={ambienceVol}
                        onChange={(id, v) => {
                            // Logic to switch sounds in sharedAudio
                            if (id !== activeAmbience) {
                                sharedAudio.stopAll();
                                setActiveAmbience(id);
                                sharedAudio.setVolume(id, v / 100);
                            } else {
                                sharedAudio.setVolume(id, v / 100);
                            }
                            setAmbienceVol(v);
                        }}
                    />
                )}

                <div className="text-center space-y-2 max-w-xs mx-auto">
                    <h2 className="text-2xl font-bold text-white leading-tight">{storyTitle}</h2>
                    <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Chapitre 1 • Le Départ</p>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-20 w-full bg-[#0a0a12]/80 backdrop-blur-xl border-t border-white/5 rounded-t-[3rem] pb-8 pt-2 transition-all duration-500 translate-y-0">

                {/* Progress Bar & Time */}
                <div className="px-8 pt-8 pb-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400 tabular-nums tracking-wider">
                        <span>{fmt(elapsed)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                    {/* Interactive Slider Area */}
                    <div className="group relative h-6 flex items-center cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const p = (e.clientX - rect.left) / rect.width;
                            setElapsed(Math.floor(p * duration));
                        }}>
                        <div className="absolute h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#3c2de6] rounded-full relative" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(60,45,230,0.8)] scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Buttons */}
                <div className="flex items-center justify-between px-8 mb-8">
                    {/* Sleep Timer */}
                    <button className="p-3 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <Moon className="w-5 h-5" />
                    </button>

                    {/* Rewind */}
                    <button className="p-3 text-white hover:text-indigo-400 transition-colors" onClick={() => setElapsed(Math.max(0, elapsed - 15))}>
                        <SkipBack className="w-8 h-8 fill-current" />
                    </button>

                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                    </button>

                    {/* Forward */}
                    <button className="p-3 text-white hover:text-indigo-400 transition-colors" onClick={() => setElapsed(Math.min(duration, elapsed + 15))}>
                        <SkipForward className="w-8 h-8 fill-current" />
                    </button>

                    {/* Mixer Toggle */}
                    <button
                        onClick={() => setShowMixer(!showMixer)}
                        className={`p-3 transition-colors rounded-full ${showMixer ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Sliders className="w-5 h-5" />
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-center gap-12 border-t border-white/5 pt-6">
                    <button className="flex flex-col items-center gap-2 group">
                        <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Livre</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 group">
                        <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Partage</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const SoundscapeMixer: React.FC<{ active: string | null, vol: number, onChange: (id: string, vol: number) => void }> = ({ active, vol, onChange }) => {
    const ambiences = [
        { id: 'rain', name: 'Rain', icon: <Cloud className="w-6 h-6" /> },
        { id: 'fire', name: 'Fire', icon: <Flame className="w-6 h-6" /> },
        { id: 'waves', name: 'Waves', icon: <Droplets className="w-6 h-6" /> },
        { id: 'forest', name: 'Forest', icon: <Wind className="w-6 h-6" /> },
    ];

    return (
        <div className="w-full max-w-sm mx-auto bg-[#151520] border border-white/10 rounded-3xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-slate-400">
                    <Volume2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Intensité</span>
                </div>
                <span className="text-sm font-bold text-white tabular-nums">{vol}%</span>
            </div>

            {/* Slider */}
            <div className="relative h-12 w-full flex items-center mb-8">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={vol}
                    onChange={(e) => onChange(active || 'rain', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3c2de6] [&::-webkit-slider-thumb]:shadow-[0_0_10px_#3c2de6]"
                />
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Soundscape</div>

            <div className="flex justify-between items-center gap-2">
                {ambiences.map((a) => {
                    const isActive = active === a.id;
                    return (
                        <button
                            key={a.id}
                            onClick={() => onChange(a.id, vol)}
                            className={`flex flex-col items-center gap-2 group flex-1`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive
                                ? 'bg-[#3c2de6] border-[#3c2de6] text-white shadow-[0_0_15px_rgba(60,45,230,0.5)] scale-110'
                                : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'
                                }`}>
                                {a.icon}
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                {a.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
