
import React from 'react';
import { ArrowLeft, Play, Lock, RefreshCw, Grid } from 'lucide-react';
import { SERIES_MOCK } from '../constants';
import { Story } from '../types';

interface SeriesListProps {
    stories: Story[];
    onOpenStory: (story: Story) => void;
}

export const SeriesList: React.FC<SeriesListProps> = ({ stories, onOpenStory }) => {
    return (
        <div className="flex flex-col h-full bg-night-900 animate-fade-in pb-24">
            {/* Header */}
            <div className="flex items-center p-6 pb-2">
                <button className="p-2 -ml-2 text-white hover:text-dream-400">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center pr-4">
                    <h2 className="text-lg font-bold text-white">Séries à Suivre</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-8">

                {/* Series content based on Real Stories */}
                {stories.length > 0 ? (
                    <div className="space-y-4">
                        {stories.map(story => (
                            <div key={story.id} onClick={() => onOpenStory(story)} className="bg-night-800 rounded-3xl p-3 flex gap-4 items-center group cursor-pointer border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0">
                                    <img src={story.coverImageUrl || "https://images.unsplash.com/photo-1570051008600-b34baa49e751?q=80&w=2085&auto=format&fit=crop"} className="w-full h-full object-cover" alt={story.title} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white truncate text-lg">{story.title}</h4>
                                    <p className="text-slate-500 text-sm">{story.params.theme}</p>
                                    <div className="w-24 h-1 bg-night-700 rounded-full mt-3 overflow-hidden">
                                        <div className="h-full bg-dream-500 w-full" />
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-night-900 transition-all">
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Grid className="w-16 h-16 text-slate-600 mb-4" />
                        <p className="text-slate-400 font-bold">Aucune série en cours</p>
                        <p className="text-xs text-slate-600">Créez une histoire pour commencer une série</p>
                    </div>
                )}
            </div>
        </div>
    );
};
