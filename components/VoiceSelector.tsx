
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Play, Pause, Sparkles, Mic2 } from 'lucide-react';
import { Button } from './Button';
import { VOICES_LIST } from '../constants';

interface VoiceSelectorProps {
  onBack: () => void;
  onConfirm: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onBack, onConfirm }) => {
  const [selectedVoice, setSelectedVoice] = useState(VOICES_LIST[0].id);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const playPreview = (id: string) => {
    // Stop current audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (playingVoice === id) {
      setPlayingVoice(null);
      return;
    }

    // Play new audio from static file
    // We append a timestamp to avoid aggressive browser caching if files are regenerated
    const newAudio = new Audio(`/voices/${id}.wav`);
    setAudio(newAudio);
    setPlayingVoice(id);

    newAudio.play().catch(e => {
      console.error("Playback failed", e);
      setPlayingVoice(null);
    });

    newAudio.onended = () => {
      setPlayingVoice(null);
    };
    newAudio.onerror = () => {
      console.error("Audio/Network error");
      setPlayingVoice(null);
    };
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-dream-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <h2 className="text-xl font-display font-bold text-white">Le Conteur</h2>
          <p className="text-xs text-dream-300 font-medium uppercase tracking-widest">Qui va parler ?</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-4 z-10">
        {VOICES_LIST.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          const isPlaying = playingVoice === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => { setSelectedVoice(voice.id); if (!isPlaying) playPreview(voice.id); }}
              className={`group relative rounded-[2rem] p-[2px] transition-all duration-300 cursor-pointer ${isSelected
                  ? 'bg-gradient-to-r from-dream-500 via-cyan-500 to-dream-500 bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)] scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10'
                }`}
            >
              <div className="bg-[#0f172a] rounded-[1.9rem] p-5 h-full relative overflow-hidden">
                {/* Active Background pulse */}
                {isSelected && <div className="absolute inset-0 bg-dream-500/5 animate-pulse" />}

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${voice.bg}`}>
                        {voice.icon}
                      </div>
                      <div>
                        <h3 className={`font-display font-bold text-lg leading-none mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{voice.name}</h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Mic2 className="w-3 h-3" /> {voice.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-dream-500 border-dream-500 scale-110' : 'border-slate-700'}`}>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                  </div>

                  {/* Interactive Player Strip */}
                  <div className={`rounded-xl p-3 flex items-center gap-3 transition-all ${isSelected ? 'bg-white/5' : 'bg-transparent'}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); playPreview(voice.id); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${isPlaying
                          ? 'bg-white text-dream-600'
                          : 'bg-gradient-to-br from-dream-500 to-indigo-600 text-white hover:scale-105'
                        }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="flex-1 flex items-center gap-0.5 h-8">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-200 ${isPlaying
                              ? 'bg-dream-400 animate-[bounce_0.5s_infinite]'
                              : isSelected ? 'bg-slate-600' : 'bg-slate-800'
                            }`}
                          style={{
                            height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '4px',
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 pt-2 z-20">
        <Button onClick={() => onConfirm(selectedVoice)} className="w-full !py-5 text-lg shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]">
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          Confirmer ce Narrateur
        </Button>
      </div>
    </div>
  );
};
