
import React, { useState } from 'react';
import { ChildProfile } from '../types';
import {
    ArrowLeft, Edit2, BookOpen, Headphones, Flame,
    Moon, User, ChevronRight, Settings, Plus,
    MessageSquare, Check, X, Bell
} from 'lucide-react';

interface ProfileDetailProps {
    profile: ChildProfile;
    onBack: () => void;
    onEdit: () => void;
    onGenerate: () => void;
    onFeedback: () => void;
    onVoiceSettings: () => void; // New prop for Narrator navigation
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({
    profile, onBack, onEdit, onGenerate, onFeedback, onVoiceSettings
}) => {
    // Local State for interactivity
    const [bedtimeAlert, setBedtimeAlert] = useState(true);
    const [isEditingUniverses, setIsEditingUniverses] = useState(false);
    const [interests, setInterests] = useState(profile.interests);
    const [newInterest, setNewInterest] = useState('');
    const [showAddInterest, setShowAddInterest] = useState(false);

    // Toggle Bedtime Alert
    const toggleBedtime = () => setBedtimeAlert(!bedtimeAlert);

    // Add Interest Logic
    const handleAddInterest = () => {
        if (newInterest.trim()) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
            setShowAddInterest(false);
        }
    };

    // Remove Interest Logic
    const handleRemoveInterest = (index: number) => {
        const newInterests = [...interests];
        newInterests.splice(index, 1);
        setInterests(newInterests);
    };

    return (
        <div className="flex flex-col h-full bg-[#050510] animate-fade-in relative font-sans text-white">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#1e1b4b] to-transparent opacity-50 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-12 mb-4">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-lg font-bold text-white tracking-wide">Profil de {profile.name}</h2>
                <button onClick={onEdit} className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-indigo-400">
                    <Edit2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-32 relative z-10">

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group cursor-pointer" onClick={onEdit}>
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 p-[3px] shadow-[0_0_50px_rgba(79,70,229,0.4)]">
                            <div className="w-full h-full rounded-full bg-[#0f0e17] flex items-center justify-center text-5xl relative overflow-hidden">
                                {profile.avatar}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#3c2de6] rounded-full border-[3px] border-[#050510] flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-display font-bold text-white mt-5 mb-1">{profile.name}</h1>
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        {profile.age} ans <span className="w-1 h-1 bg-slate-500 rounded-full" /> Explorateur de rêves
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <StatCard
                        icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
                        value={profile.stats?.storiesCount || 12}
                        label="Histoires"
                    />
                    <StatCard
                        icon={<Headphones className="w-6 h-6 text-purple-400" />}
                        value={`${Math.floor((profile.stats?.minutesListened || 120) / 60)}h`}
                        label="Ecoute"
                    />
                    <StatCard
                        icon={<Flame className="w-6 h-6 text-orange-400" />}
                        value={profile.stats?.streak || 3}
                        label="Série"
                    />
                </div>

                {/* Favorite Universes */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Univers Favoris</h3>
                        <button
                            onClick={() => setIsEditingUniverses(!isEditingUniverses)}
                            className="text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors"
                        >
                            {isEditingUniverses ? 'Terminer' : 'Modifier'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {interests.map((tag, i) => (
                            <div key={i} className={`group relative px-5 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 ${isEditingUniverses ? 'bg-red-500/10 border-red-500/30 pr-8' : 'bg-[#1a1a24] border-white/5 hover:border-indigo-500/50'}`}>
                                <span className="text-lg">{getMoodEmoji(tag)}</span>
                                <span className="text-sm font-semibold text-slate-200">{tag}</span>
                                {isEditingUniverses && (
                                    <button
                                        onClick={() => handleRemoveInterest(i)}
                                        className="absolute right-2 p-1 text-red-400 hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {showAddInterest ? (
                            <div className="flex items-center gap-2 bg-[#1a1a24] border border-indigo-500 rounded-2xl px-2 py-1 animate-fade-in">
                                <input
                                    autoFocus
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                                    className="bg-transparent border-none text-sm text-white focus:ring-0 w-24 h-8 px-2"
                                    placeholder="Nouveau..."
                                />
                                <button onClick={handleAddInterest} className="p-1 bg-indigo-600 rounded-full text-white">
                                    <Check className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddInterest(true)}
                                className="px-5 py-3 rounded-2xl border-2 border-dashed border-white/10 text-sm font-bold text-slate-500 flex items-center gap-2 hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-white/5 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Ajouter
                            </button>
                        )}
                    </div>
                </div>

                {/* Settings List */}
                <div className="space-y-4">
                    {/* Toggle Item */}
                    <div className="group bg-[#1a1a24] rounded-3xl p-5 flex items-center justify-between border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#0f0e17] flex items-center justify-center text-blue-400 shadow-inner">
                                <Moon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-[15px]">Alerte Dodo</h4>
                                <p className="text-slate-500 text-xs font-medium mt-0.5">Tous les jours à 20:00</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleBedtime}
                            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${bedtimeAlert ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${bedtimeAlert ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <SettingNav
                        icon={<User className="w-6 h-6" />}
                        iconColor="text-pink-400"
                        title="Narrateur"
                        subtitle="Voix par défaut"
                        onClick={onVoiceSettings}
                    />

                    <SettingNav
                        icon={<MessageSquare className="w-6 h-6" />}
                        iconColor="text-emerald-400"
                        title="Feedback"
                        subtitle="Aidez-nous à améliorer"
                        onClick={onFeedback}
                    />
                </div>

                {/* Version */}
                <div className="text-center mt-12 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                    Version 1.0.4 • DreamCast Studio
                </div>
            </div>
        </div>
    );
};

// --- Sub Components ---

const StatCard = ({ icon, value, label }: any) => (
    <div className="bg-[#1a1a24] rounded-[1.5rem] p-5 flex flex-col items-center justify-center border border-white/5 shadow-lg group hover:-translate-y-1 transition-transform duration-300">
        <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-110 duration-300">{icon}</div>
        <div className="text-xl font-black text-white leading-none mb-1.5">{value}</div>
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
);

const SettingNav = ({ icon, iconColor, title, subtitle, onClick }: any) => (
    <button onClick={onClick} className="w-full bg-[#1a1a24] rounded-3xl p-5 flex items-center justify-between border border-white/5 hover:border-white/10 hover:bg-[#20202b] transition-all group active:scale-[0.99]">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-[#0f0e17] flex items-center justify-center ${iconColor} shadow-inner group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
            <div className="text-left">
                <h4 className="text-white font-bold text-[15px] group-hover:text-indigo-300 transition-colors">{title}</h4>
                <p className="text-slate-500 text-xs font-medium mt-0.5">{subtitle}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
    </button>
);

// Helpers
const getMoodEmoji = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('espace') || lower.includes('space')) return '🚀';
    if (lower.includes('princesse') || lower.includes('princess')) return '👑';
    if (lower.includes('dino')) return '🦕';
    if (lower.includes('magie') || lower.includes('magic')) return '✨';
    if (lower.includes('animal') || lower.includes('chat')) return '🐾';
    return '🌟';
};
