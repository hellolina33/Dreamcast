
import React from 'react';
import { X, MoreHorizontal, Play, Mic, PenLine, Calendar } from 'lucide-react';
import { DREAM_JOURNAL_RECENT } from '../constants';

interface DreamJournalProps {
    onClose: () => void;
    name: string;
}

export const DreamJournal: React.FC<DreamJournalProps> = ({ onClose, name }) => {
    return (
        <div className="flex flex-col h-full bg-black animate-slide-up relative z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-night-800 flex items-center justify-center text-white hover:bg-night-700 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-night-800 rounded-full flex items-center gap-2 text-white text-xs font-bold">
                    <Calendar className="w-3 h-3 text-dream-400" />
                    <span>14 Oct</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-night-800 flex items-center justify-center text-white hover:bg-night-700 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
                <div className="text-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-white mb-2">Bonjour, {name}</h1>
                    <p className="text-slate-400 text-sm">Prêt à raconter ton aventure ?</p>
                </div>

                {/* Voice Input Section Only */}
                <div className="flex flex-col items-center justify-center mb-10 mt-10">
                    <p className="text-lg font-bold text-white mb-8 text-center max-w-[200px]">Quel était le meilleur moment de ton rêve ?</p>

                    <button className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
                        <Mic className="w-10 h-10 text-white fill-current group-hover:animate-pulse" />
                    </button>
                    <p className="text-dream-400 text-sm font-medium mt-4">Appuie pour parler</p>

                    <div className="flex items-center gap-4 w-full mt-6 mb-6">
                        <div className="h-[1px] bg-night-700 flex-1"></div>
                        <span className="text-night-600 text-xs font-bold uppercase">OU</span>
                        <div className="h-[1px] bg-night-700 flex-1"></div>
                    </div>

                    <button className="w-full py-4 border border-dashed border-white/10 hover:border-white/30 rounded-3xl text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-all">
                        <PenLine className="w-4 h-4" />
                        <span>Écrire le souvenir</span>
                    </button>
                </div>

                {/* Recent Dreams - Empty for now */}
                <div className="mb-6 opacity-30 text-center text-xs text-slate-500">
                    <p>Ton journal de rêves est vide pour l'instant.</p>
                </div>
            </div>
        </div>
    );
};
