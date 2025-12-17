
import React from 'react';
import { ArrowLeft, MoreVertical, Play, Moon, Wind, Cloud, Book, User, SkipBack, Pause, SkipForward } from 'lucide-react';
import { MEDITATIONS_MOCK } from '../constants';

interface MeditationsProps {
    onBack: () => void;
}

export const Meditations: React.FC<MeditationsProps> = ({ onBack }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'moon': return <Moon className="w-5 h-5 text-indigo-400" />;
            case 'wind': return <Wind className="w-5 h-5 text-emerald-400" />;
            case 'cloud': return <Cloud className="w-5 h-5 text-blue-400" />;
            case 'book': return <Book className="w-5 h-5 text-purple-400" />;
            default: return <User className="w-5 h-5 text-pink-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-night-900 animate-fade-in relative pb-24">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-night-800 flex items-center justify-center text-white hover:bg-night-700 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-white">Méditations</h2>
                <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20 px-6 opacity-60">
                    <Moon className="w-16 h-16 text-indigo-400 mb-6 opacity-50" />
                    <h2 className="text-lg font-bold text-slate-400 text-center">Espace Calme</h2>
                    <p className="text-xs text-slate-600 text-center mt-2 max-w-xs">
                        Les méditations guidées par tes voix préférées arriveront bientôt ici.
                    </p>
                </div>
            </div>

            {/* Mini Player Floating */}
            <div className="absolute bottom-6 left-6 right-6 bg-night-800/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 pl-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-900 to-blue-900 flex items-center justify-center animate-spin-slow">
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">La Forêt Endormie</h4>
                        <p className="text-blue-300 text-[10px] font-mono">04:12 / 12:00</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-white"><SkipBack className="w-5 h-5 fill-current" /></button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-night-900 hover:scale-105 transition-transform"><Pause className="w-4 h-4 fill-current" /></button>
                    <button className="p-2 text-slate-400 hover:text-white"><SkipForward className="w-5 h-5 fill-current" /></button>
                </div>
                <div className="h-0.5 absolute bottom-0 left-4 right-4 bg-night-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3c2de6] w-1/3"></div>
                </div>
            </div>
        </div>
    );
};
