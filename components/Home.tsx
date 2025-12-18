import React from 'react';
import { AppState, ChildProfile, Story } from '../types';
import { Mic, Moon, Sparkles, Plus, PenTool, Wind, BookOpen, Search, Heart, Share2 } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';
import { motion, AnimatePresence } from 'framer-motion';
import { ListSkeleton, StoryCardSkeleton, Skeleton } from './Skeletons';

interface HomeProps {
    childProfile: ChildProfile;
    greeting: string;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredStories: Story[];
    setAppState: (state: AppState) => void;
    startWizard: () => void;
    handleOpenStory: (story: Story) => void;
    toggleFavorite: (e: React.MouseEvent, id: string) => void;
    isLoading?: boolean;
}


export const Home: React.FC<HomeProps> = ({
    childProfile, greeting, searchTerm, setSearchTerm, filteredStories,
    setAppState, startWizard, handleOpenStory, toggleFavorite, isLoading
}) => {
    const { light, medium, heavy, success } = useHaptic();

    return (
        <div className="flex flex-col h-full animate-fade-in px-6 pb-32 pt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-dream-500 to-neon-cyan p-[3px] shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                        <div className="w-full h-full rounded-full bg-night-900 flex items-center justify-center text-3xl animate-bounce-sm">
                            {childProfile.avatar}
                        </div>
                    </div>
                    <div>
                        <p className="text-dream-300 text-xs font-black uppercase tracking-widest">{greeting}</p>
                        <h1 className="text-3xl font-display font-bold text-white leading-none drop-shadow-md">{childProfile.name}</h1>
                    </div>
                </div>
                <button onClick={() => { light(); setAppState(AppState.VOICE_SELECTION); }} className="w-12 h-12 clay-card rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all">
                    <Mic className="w-6 h-6" />
                </button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Good Night Card (Large) */}
                <button
                    onClick={() => { medium(); setAppState(AppState.GOODNIGHT_HOME); }}
                    className="col-span-2 relative h-40 rounded-[2.5rem] bg-gradient-to-br from-[#312e81] to-[#4c1d95] p-6 text-left overflow-hidden group shadow-[0_10px_30px_-10px_rgba(49,46,129,0.5)] transition-all premium-card-hover"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                                <Moon className="w-6 h-6 text-white fill-white/20" />
                            </div>
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">Rituel</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-white mb-1">Bonne Nuit</h3>
                            <p className="text-indigo-200 text-sm font-medium">Lancer la routine du soir</p>
                        </div>
                    </div>
                </button>

                {/* Create Story */}
                <button
                    onClick={() => { heavy(); startWizard(); }}
                    className="col-span-1 h-48 rounded-[2.5rem] bg-gradient-to-b from-neon-pink to-[#be185d] p-5 text-left relative overflow-hidden group shadow-[0_10px_30px_-10px_rgba(190,24,93,0.5)] transition-all premium-card-hover"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform shadow-inner">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-white leading-tight mb-2">Créer une<br />Histoire</h3>
                            <div className="w-10 h-10 rounded-full bg-white text-neon-pink flex items-center justify-center mt-2 shadow-lg group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 stroke-[3]" />
                            </div>
                        </div>
                    </div>
                </button>

                {/* Stacked Small Cards */}
                <div className="col-span-1 flex flex-col gap-4 h-48">
                    <button
                        onClick={() => { light(); setAppState(AppState.DREAM_JOURNAL); }}
                        className="flex-1 rounded-[2rem] clay-card p-4 flex items-center gap-3 hover:bg-white/5 jelly-btn"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <PenTool className="w-5 h-5 text-blue-300" />
                        </div>
                        <span className="font-bold text-sm text-white">Journal</span>
                    </button>

                    <button
                        onClick={() => { light(); setAppState(AppState.MEDITATIONS); }}
                        className="flex-1 rounded-[2rem] clay-card p-4 flex items-center gap-3 hover:bg-white/5 jelly-btn"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Wind className="w-5 h-5 text-emerald-300" />
                        </div>
                        <span className="font-bold text-sm text-white">Calme</span>
                    </button>
                </div>
            </div>

            {/* Library Section */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-dream-400" /> Bibliothèque
                    </h2>
                    <div className="relative w-36 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-dream-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Chercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-9 pr-3 text-xs font-bold text-white focus:outline-none focus:bg-white/10 focus:border-dream-500/50 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 pb-28">
                    {isLoading ? (
                        <div className="space-y-3">
                            <div className="flex gap-4 items-center">
                                <Skeleton className="w-16 h-16 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Skeleton className="w-16 h-16 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        filteredStories.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5">
                                <Moon className="w-10 h-10 mb-3 opacity-30" />
                                <p className="text-sm font-bold opacity-60">C'est vide ici !</p>
                                <p className="text-xs opacity-40">Crée ta première histoire.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } },
                                    hidden: {}
                                }}
                                className="space-y-3"
                            >
                                {filteredStories.map(story => (
                                    <motion.div
                                        key={story.id}
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        onClick={() => { light(); handleOpenStory(story); }}
                                        className="clay-card p-3 rounded-[1.5rem] flex gap-4 items-center group cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.99] premium-card-hover"
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-lg shrink-0 border border-white/10">
                                            {story.coverImageUrl ? <img src={story.coverImageUrl} className="w-full h-full object-cover" alt="cover" /> : <div className="w-full h-full bg-dream-500/20" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-base truncate mb-1">{story.title}</h4>
                                            <p className="text-[11px] font-bold text-slate-400 truncate uppercase tracking-wide bg-white/5 inline-block px-2 py-0.5 rounded-full">{story.params.theme}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const shareUrl = `${window.location.origin}?share=${story.id}`;
                                                    navigator.clipboard.writeText(shareUrl);
                                                    medium();
                                                    alert("Lien copié dans le presse-papier ! ✨");
                                                }}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-dream-400 transition-colors"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => { success(); toggleFavorite(e, story.id); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-500 transition-colors">
                                                <Heart className={`w-5 h-5 ${story.isFavorite ? 'fill-neon-pink text-neon-pink' : ''}`} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
