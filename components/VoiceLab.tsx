
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Play, RotateCcw, Check, Fingerprint, Lock } from 'lucide-react';
import { Button } from './Button';

interface VoiceLabProps {
  onBack: () => void;
  onComplete: () => void;
}

export const VoiceLab: React.FC<VoiceLabProps> = ({ onBack, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopVisualizer();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startVisualizer = (stream: MediaStream) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const draw = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(1, '#ef4444');
        
        ctx.fillStyle = gradient;
        
        // Mirror effect for waveform look
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);
        
        x += barWidth + 2;
      }
    };

    draw();
  };

  const stopVisualizer = () => {
     if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
     // CRITICAL FIX: Check if context is valid and not closed
     if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing AudioContext:", e));
     }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startVisualizer(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stopVisualizer();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      setTimer(0);
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing mic", err);
      alert("Microphone requis pour cloner votre voix.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
      setProcessing(true);
      // Simulate API processing
      setTimeout(() => {
          setProcessing(false);
          onComplete();
      }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-black animate-fade-in relative">
       {/* Header */}
       <div className="flex items-center p-6 border-b border-white/10">
          <button onClick={onBack} className="p-2 -ml-2 text-white hover:text-dream-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="ml-4 text-sm font-bold tracking-widest uppercase text-white">Voice Lab</h2>
       </div>

       {/* Content */}
       <div className="flex-1 flex flex-col p-6 space-y-8">
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Donnez votre voix à l'IA</h3>
            <p className="text-slate-400 text-sm">Lisez le texte ci-dessous avec une voix calme et posée.</p>
          </div>

          {/* Script Card */}
          <div className="bg-night-800 p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-dream-500" />
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Le Petit Prince</div>
             <p className="text-xl text-white font-serif leading-relaxed">
               "C'est alors qu'apparut le renard.<br/><br/>
               — Bonjour, dit le renard.<br/><br/>
               — Bonjour, répondit poliment le petit prince..."
             </p>
             <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" /> Private & Encrypted
             </div>
          </div>

          {/* Visualizer & Timer */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
             <canvas ref={canvasRef} width="300" height="60" className="w-full h-16 opacity-80" />
             <div className={`mt-4 font-mono text-sm ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                {isRecording ? '● Enregistrement...' : ''} {formatTime(timer)} / 01:00
             </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6 pb-6">
             {!audioBlob ? (
                 <>
                    <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                            isRecording 
                            ? 'bg-transparent border-4 border-red-500 scale-110' 
                            : 'bg-gradient-to-br from-red-500 to-red-600 hover:scale-105'
                        }`}
                    >
                        {isRecording ? <Square className="w-8 h-8 fill-red-500 text-red-500 rounded-sm" /> : <Mic className="w-8 h-8 text-white" />}
                    </button>
                    <p className="text-xs text-slate-500">Appuyez pour commencer l'enregistrement</p>
                 </>
             ) : (
                 <div className="flex w-full gap-4">
                     <Button variant="secondary" onClick={() => setAudioBlob(null)}>
                        <RotateCcw className="w-4 h-4" /> Recommencer
                     </Button>
                     <Button onClick={handleSave} isLoading={processing}>
                        <Check className="w-4 h-4" /> Utiliser ma voix
                     </Button>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};
