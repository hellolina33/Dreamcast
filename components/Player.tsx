
import React, { useRef, useState, useEffect } from 'react';
import { Story } from '../types';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Sliders, Wind, Moon, Share2, BookOpen, Repeat, PlusCircle, X, CloudRain, Flame, Waves, Leaf, VolumeX, Mic2, MicOff, Lock } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface PlayerProps {
  story: Story;
  onBack: () => void;
  onSequel: (story: Story) => void;
  isNewStory?: boolean;
  isPremium?: boolean;
  onShowPaywall?: () => void;
}

const PREVIEW_LIMIT = 30; // seconds

export const Player: React.FC<PlayerProps> = ({ story, onBack, onSequel, isNewStory, isPremium, onShowPaywall }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [ambienceVolume, setAmbienceVolume] = useState(0.5);
  const [activeAmbience, setActiveAmbience] = useState<string>(story.ambience || 'quiet');

  // Mute states
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isAmbienceMuted, setIsAmbienceMuted] = useState(false);

  const [showMixer, setShowMixer] = useState(false);
  const [isScreenSaver, setIsScreenSaver] = useState(false);
  const [isReadMode, setIsReadMode] = useState(false);

  const [sleepTimer, setSleepTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const voiceGainRef = useRef<GainNode | null>(null);
  const ambienceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const ambienceGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const wakeLockRef = useRef<any>(null);

  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Time formatting for Screen Saver
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play logic & Audio Hydration
  useEffect(() => {
    const hydrateAudio = async () => {
      if (!story.audioBuffer && story.audioUrl) {
        try {
          // Show loading indicator here if possible, for now just fetch
          const resp = await fetch(story.audioUrl);
          const arrayBuffer = await resp.arrayBuffer();
          const ctx = initAudioContext();
          const decoded = await ctx.decodeAudioData(arrayBuffer);
          // Mutate story object strictly for this session content (or use local state)
          // Better to use a local ref for the active buffer
          activeBufferRef.current = decoded;
          setDuration(decoded.duration);
          if (isNewStory) playAudio();
        } catch (e) { console.error("Failed to load remote audio", e); }
      } else if (story.audioBuffer) {
        activeBufferRef.current = story.audioBuffer;
        setDuration(story.audioBuffer.duration);
        if (isNewStory) setTimeout(() => playAudio(), 800);
      }
    };
    hydrateAudio();
  }, [isNewStory, story.id]);

  const activeBufferRef = useRef<AudioBuffer | null>(story.audioBuffer || null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) { console.log(err); }
    };
    if (isPlaying) requestWakeLock();

    return () => {
      stopAudio();
      stopAmbience();
      if (wakeLockRef.current) wakeLockRef.current.release();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [story.id]);

  // Volume Updates
  useEffect(() => {
    if (voiceGainRef.current) {
      voiceGainRef.current.gain.value = isVoiceMuted ? 0 : voiceVolume;
    }
    if (ambienceGainRef.current) {
      const targetVol = isAmbienceMuted ? 0 : (ambienceVolume * 0.3);
      if (audioContextRef.current) {
        ambienceGainRef.current.gain.setTargetAtTime(targetVol, audioContextRef.current.currentTime, 0.1);
      } else {
        ambienceGainRef.current.gain.value = targetVol;
      }
    }
  }, [voiceVolume, ambienceVolume, isVoiceMuted, isAmbienceMuted]);

  useEffect(() => {
    stopAmbience();
    if (isPlaying && activeAmbience !== 'quiet') {
      startAmbience(activeAmbience);
    }
  }, [activeAmbience]);

  // Sleep Timer Logic
  useEffect(() => {
    if (sleepTimer > 0) {
      setTimeRemaining(sleepTimer * 60);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev > 1) return prev - 1;
          fadeOutAndStop();
          clearInterval(timerIntervalRef.current!);
          setSleepTimer(0);
          return null;
        });
      }, 1000);
    } else {
      setTimeRemaining(null);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [sleepTimer]);

  const fadeOutAndStop = () => {
    if (voiceGainRef.current && audioContextRef.current) {
      voiceGainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2);
    }
    setTimeout(() => {
      pauseAudio();
      if (voiceGainRef.current && audioContextRef.current) voiceGainRef.current.gain.value = voiceVolume;
    }, 2000);
  };

  const initAudioContext = () => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
    return audioContextRef.current;
  };

  // ---------------------------------------------------------------------------
  // Ambience Engine
  // ---------------------------------------------------------------------------
  const createPinkNoise = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  };

  const startAmbience = (type: string) => {
    const ctx = initAudioContext();
    if (ambienceNodeRef.current) return;
    if (type === 'off' || type === 'quiet') return;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(ctx.destination);
    ambienceGainRef.current = gainNode;

    const buffer = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();

    if (type === 'rain') { filter.type = 'lowpass'; filter.frequency.value = 800; }
    else if (type === 'fire') { filter.type = 'highpass'; filter.frequency.value = 100; }
    else if (type === 'waves') { filter.type = 'lowpass'; filter.frequency.value = 300; }
    else if (type === 'wind') { filter.type = 'bandpass'; filter.frequency.value = 400; }
    else { filter.type = 'lowpass'; filter.frequency.value = 1000; }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(gainNode);
    source.start();
    ambienceNodeRef.current = source;

    const targetVol = isAmbienceMuted ? 0 : (ambienceVolume * 0.3);
    gainNode.gain.setTargetAtTime(targetVol, ctx.currentTime, 1);
  };

  const stopAmbience = () => {
    if (ambienceGainRef.current && audioContextRef.current) {
      ambienceGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.1);
      const nodeToStop = ambienceNodeRef.current;
      ambienceNodeRef.current = null;
      setTimeout(() => { if (nodeToStop) try { nodeToStop.stop(); } catch (e) { } }, 200);
    } else if (ambienceNodeRef.current) {
      try { ambienceNodeRef.current.stop(); } catch (e) { }
      ambienceNodeRef.current = null;
    }
  };

  const playAudio = (offsetOverride?: number) => {
    setHasEnded(false);
    const ctx = initAudioContext();
    const buffer = activeBufferRef.current;
    if (!buffer) return;

    if (activeAmbience !== 'quiet') startAmbience(activeAmbience);

    const voiceGain = ctx.createGain();
    voiceGain.gain.value = isVoiceMuted ? 0 : voiceVolume;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64; // Small for simplified look
    analyserRef.current = analyser;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    source.connect(voiceGain);
    voiceGain.connect(analyser);
    analyser.connect(ctx.destination);
    voiceGainRef.current = voiceGain;

    const offset = offsetOverride !== undefined ? offsetOverride : pauseTimeRef.current;

    // Safety check for offset
    if (offset >= buffer.duration) {
      setProgress(100);
      return;
    }

    source.start(0, offset);

    startTimeRef.current = ctx.currentTime - offset;
    sourceNodeRef.current = source;

    setDuration(buffer.duration);
    setIsPlaying(true);

    source.onended = () => {
      // Logic to detect natural end vs manual stop
      if (ctx && sourceNodeRef.current === source && (ctx.currentTime - startTimeRef.current) >= buffer.duration - 0.5) {
        setIsPlaying(false);
        pauseTimeRef.current = 0;
        setProgress(100);
        stopAmbience();
        setHasEnded(true);
        setIsScreenSaver(false);
      }
    };
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  const updateProgress = () => {
    if (!audioContextRef.current || !isPlaying) return;
    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;

    // Free Tier: 30s Limit
    if (isPremium === false && elapsed >= PREVIEW_LIMIT) {
      pauseAudio();
      onShowPaywall?.();
      return;
    }

    const newProgress = (elapsed / duration) * 100;
    setProgress(Math.min(newProgress, 100));
    if (isPlaying) rafRef.current = requestAnimationFrame(updateProgress);
  };

  const pauseAudio = () => {
    if (sourceNodeRef.current && audioContextRef.current) {
      sourceNodeRef.current.stop();
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setIsPlaying(false);
      stopAmbience();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    const wasPlaying = isPlaying;
    if (isPlaying) {
      pauseAudio();
    }

    const newTime = (newProgress / 100) * (activeBufferRef.current?.duration || 0);
    pauseTimeRef.current = newTime;

    if (wasPlaying) {
      playAudio(newTime);
    }
  };

  const togglePlay = async () => {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    isPlaying ? pauseAudio() : playAudio();
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) { try { sourceNodeRef.current.stop(); } catch (e) { } }
    setIsPlaying(false);
    pauseTimeRef.current = 0;
    setProgress(0);
    stopAmbience();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const toggleScreenSaver = () => setIsScreenSaver(!isScreenSaver);

  if (isScreenSaver) {
    return (
      <div onClick={toggleScreenSaver} className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center animate-fade-in cursor-pointer">
        <div className="text-night-700 text-[10rem] font-thin opacity-20 select-none">{currentTimeStr}</div>
        <div className="absolute bottom-20">
          <AudioVisualizer analyser={analyserRef.current} isPlaying={isPlaying} color="#8b5cf6" />
        </div>
        <div className="absolute bottom-10 text-night-800 text-xs font-bold tracking-widest">TAP TO WAKE</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full space-y-6 animate-float transition-all relative ${isReadMode ? 'pt-8' : ''}`}>
      {/* End Screen Overlay */}
      {hasEnded && !isReadMode && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-night-900/95 backdrop-blur-xl rounded-3xl animate-fade-in p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Fin de l'histoire</h2>
          <p className="text-slate-400 mb-8">Fais de beaux rêves, {story.params.childName}.</p>
          <div className="w-full space-y-3">
            <button onClick={() => onSequel(story)} className="w-full py-4 bg-gradient-to-r from-dream-500 to-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-dream-500/20"><PlusCircle className="w-5 h-5" /> Imaginer la suite</button>
            <button onClick={() => { setHasEnded(false); playAudio(0); }} className="w-full py-3 bg-night-800 border border-night-700 rounded-2xl font-medium text-slate-300 flex items-center justify-center gap-2"><Repeat className="w-5 h-5" /> Réécouter</button>
            <button onClick={onBack} className="w-full py-3 text-slate-500 text-sm">Retour à la bibliothèque</button>
          </div>
        </div>
      )}

      {/* Header */}
      {!isReadMode && (
        <div className="flex items-center justify-between z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Lecture en cours</div>
            <AudioVisualizer analyser={analyserRef.current} isPlaying={isPlaying} />
          </div>
          <div className="w-8"></div>
        </div>
      )}

      {/* Cover Art */}
      <div className={`relative aspect-square w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] group transition-all duration-500 ${isReadMode ? 'h-32 w-32 rounded-full mx-auto opacity-50' : ''}`}>
        <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent opacity-90" />
        {!isReadMode && (
          <div className="absolute bottom-8 left-6 right-6">
            <h1 className="text-3xl font-bold leading-tight text-white mb-2">{story.title}</h1>
            <p className="text-dream-300 text-sm font-medium flex items-center gap-2">
              <span className="opacity-70">Chapter 1 • {activeAmbience !== 'quiet' ? 'Ambience On' : 'Voice Only'}</span>
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`space-y-8 px-4 transition-all duration-500 ${isReadMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="space-y-2 relative">
          {/* Interactive Range Slider (UX Fix #12) */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={seek}
            className="w-full h-1 bg-night-700 rounded-full appearance-none cursor-pointer accent-dream-500 absolute inset-0 z-20 opacity-0"
          />
          <div className="h-1 bg-night-700 rounded-full overflow-hidden relative z-10 pointer-events-none">
            <div className="h-full bg-dream-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            {/* Free Tier Limit Marker */}
            {!isPremium && duration > PREVIEW_LIMIT && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-300 to-amber-500 z-30 shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                style={{ left: `${(PREVIEW_LIMIT / duration) * 100}%` }}
              >
                <div className="absolute -top-1 -translate-x-1/2 left-1/2">
                  <Lock className="w-3 h-3 text-amber-400" />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono tracking-widest mt-3">
            <span>{formatTime(pauseTimeRef.current || (isPlaying ? (audioContextRef.current?.currentTime || 0) - startTimeRef.current : 0))}</span>
            <span>{formatTime(activeBufferRef.current?.duration || 0)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <button onClick={toggleScreenSaver} className="text-slate-500 hover:text-white p-2" title="Screen Saver Mode"><Moon className="w-6 h-6" /></button>
          <div className="flex items-center gap-6">
            <button onClick={() => { }} className="text-slate-400 hover:text-white"><SkipBack className="w-8 h-8" /></button>
            <button onClick={togglePlay} className="w-20 h-20 bg-white text-night-900 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button onClick={() => { }} className="text-slate-400 hover:text-white"><SkipForward className="w-8 h-8" /></button>
          </div>
          <button onClick={() => setShowMixer(true)} className={`text-slate-500 hover:text-white p-2 ${activeAmbience !== 'quiet' ? 'text-dream-400' : ''}`} title="Audio Mixer">
            <Sliders className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-8 text-slate-500">
          <button onClick={() => setIsReadMode(true)} className="flex flex-col items-center gap-1 hover:text-white"><BookOpen className="w-5 h-5" /><span className="text-[10px]">LIVRE</span></button>
          <button onClick={() => { }} className="flex flex-col items-center gap-1 hover:text-white"><Share2 className="w-5 h-5" /><span className="text-[10px]">PARTAGE</span></button>
        </div>
      </div>

      {isReadMode && (
        <div className="flex-1 overflow-y-auto px-4 pb-20 text-center relative z-20">
          <button onClick={() => setIsReadMode(false)} className="absolute top-0 right-0 p-2 text-white bg-white/10 rounded-full"><X className="w-4 h-4" /></button>
          <h3 className="text-dream-400 font-bold mb-6 text-sm tracking-widest uppercase">{story.title}</h3>
          <p className="text-white text-xl leading-relaxed font-serif">{story.script}</p>
        </div>
      )}

      {showMixer && (
        <div className="absolute inset-x-0 bottom-0 bg-night-800/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 pb-10 border-t border-white/5 animate-slide-up z-50 shadow-2xl">
          <div className="w-12 h-1 bg-night-600 rounded-full mx-auto mb-8" onClick={() => setShowMixer(false)} />
          <h3 className="text-center text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-8">Mixage Audio</h3>

          <div className="space-y-8 mb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsVoiceMuted(!isVoiceMuted)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                {isVoiceMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic2 className="w-5 h-5 text-slate-400" />}
              </button>
              <input type="range" min="0" max="1.5" step="0.1" value={voiceVolume} onChange={(e) => setVoiceVolume(parseFloat(e.target.value))} className="w-full accent-white h-1 bg-night-600 rounded-lg appearance-none cursor-pointer" />
              <span className="text-xs text-slate-400 font-mono w-8 text-right">{isVoiceMuted ? 'OFF' : Math.round(voiceVolume * 100) + '%'}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAmbienceMuted(!isAmbienceMuted)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                {isAmbienceMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Wind className="w-5 h-5 text-dream-400" />}
              </button>
              <input type="range" min="0" max="1" step="0.1" value={ambienceVolume} onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))} className="w-full accent-dream-500 h-1 bg-night-600 rounded-lg appearance-none cursor-pointer" />
              <span className="text-xs text-slate-400 font-mono w-8 text-right">{isAmbienceMuted ? 'OFF' : Math.round(ambienceVolume * 100) + '%'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Soundscape</p>
            <div className="flex justify-between">
              {[
                { id: 'rain', icon: CloudRain, label: 'Rain' },
                { id: 'fire', icon: Flame, label: 'Fire' },
                { id: 'waves', icon: Waves, label: 'Waves' },
                { id: 'wind', icon: Leaf, label: 'Forest' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (isAmbienceMuted) setIsAmbienceMuted(false);
                    setActiveAmbience(s.id);
                  }}
                  className={`flex flex-col items-center gap-2 group ${activeAmbience === s.id && !isAmbienceMuted ? 'text-white' : 'text-slate-600'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeAmbience === s.id && !isAmbienceMuted ? 'bg-dream-500 shadow-lg shadow-dream-500/30' : 'bg-night-900 border border-night-700'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMixer && <div className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowMixer(false)} />}
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
