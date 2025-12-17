
import React from 'react';
import { Search, Bell, Play, Plus, Compass } from 'lucide-react';
import { DISCOVERY_TAGS, EXPLORE_CARDS } from '../constants';

export const Discovery: React.FC = () => {
    const showNotif = () => alert("Bientôt disponible !");

    return (
        <div className="flex flex-col h-full bg-night-900 animate-fade-in pb-24">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
                <h1 className="text-2xl font-bold text-white">Découverte</h1>
                <button className="p-2 bg-white/5 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors" onClick={showNotif}>
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Search */}
            <div className="px-6 mb-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-dream-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher un thème..."
                        className="w-full bg-night-800 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-dream-500 placeholder-slate-600 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Tags */}
                <div className="flex gap-2 overflow-x-auto px-6 pb-6 custom-scrollbar">
                    {DISCOVERY_TAGS.map((tag, i) => (
                        <button
                            key={i}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-dream-600 text-white shadow-lg shadow-dream-500/30' : 'bg-night-800 text-slate-400 border border-white/5 hover:bg-night-700 hover:text-white'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Empty Discovery State */}
                <div className="flex flex-col items-center justify-center py-20 px-6 opacity-60">
                    <Compass className="w-20 h-20 text-slate-700 mb-6" />
                    <h2 className="text-xl font-bold text-slate-400 text-center">Explorez l'Univers</h2>
                    <p className="text-sm text-slate-600 text-center mt-2 max-w-xs">
                        Recherchez des thèmes magiques pour générer de nouvelles histoires.
                    </p>
                </div>
            </div>
        </div>

    );
};
