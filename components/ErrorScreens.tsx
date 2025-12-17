
import React from 'react';
import { WifiOff, Download, Home, Library, User, Wand2, RefreshCw, Flag, Wifi, Signal, Battery, ChevronLeft, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

// Mock Status Bar to match provided design
const StatusBar = () => (
    <div className="h-12 w-full flex items-center justify-between px-6 pt-2 opacity-80">
        <span className="text-white text-xs font-medium">9:41</span>
        <div className="flex gap-1">
            <Signal className="w-4 h-4 text-white" />
            <Wifi className="w-4 h-4 text-white" />
            <Battery className="w-4 h-4 text-white" />
        </div>
    </div>
);

// --- OFFLINE SCREEN ---
interface OfflineScreenProps {
    onGoToLibrary: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ onGoToLibrary }) => {
    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative z-50">
            <StatusBar />
            
            <div className="flex items-center p-4">
                <button onClick={onGoToLibrary} className="text-white/80 hover:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 -mt-16">
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(60,45,230,0.4)]">
                        <WifiOff className="w-16 h-16 text-[#3c2de6]" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-white/40 text-xl font-bold animate-pulse">Zzz</span>
                </div>

                <div className="flex flex-col items-center gap-3 text-center mb-10">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Connexion perdue</h2>
                    <p className="text-white/60 text-base font-normal leading-relaxed max-w-[280px]">
                        Impossible de créer une nouvelle histoire. Accédez à votre bibliothèque hors-ligne.
                    </p>
                </div>

                <button 
                    onClick={onGoToLibrary}
                    className="w-full h-14 bg-[#3c2de6] hover:bg-[#3224bd] active:scale-[0.98] transition-all text-white text-base font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#3c2de6]/20"
                >
                    <Download className="w-5 h-5" />
                    <span>Ouvrir mes téléchargements</span>
                </button>
            </div>

            <div className="border-t border-white/5 bg-[#050505] px-6 pb-8 pt-4">
                <div className="flex justify-between items-center">
                    <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors" onClick={onGoToLibrary}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Accueil</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors" onClick={onGoToLibrary}>
                        <Library className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Biblio</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-[#3c2de6]">
                        <WifiOff className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Hors ligne</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Profil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ERROR SCREEN ---
interface ErrorScreenProps {
    onRetry: () => void;
    onCancel: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry, onCancel }) => {
    return (
        <div className="flex flex-col h-full bg-[#050505] animate-fade-in relative z-50">
            <StatusBar />
            
            <div className="flex items-center p-4">
                <button onClick={onCancel} className="text-white/80 hover:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 -mt-8">
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-[0_0_60px_-15px_rgba(60,45,230,0.4)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#3c2de6]/20 to-transparent opacity-50"></div>
                        <Wand2 className="w-16 h-16 text-[#3c2de6] relative z-10 rotate-12 opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-0.5 bg-white/20 rotate-45 absolute"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3 text-center mb-12">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-tight max-w-[300px]">Oups, le rêve s'est dissipé</h2>
                    <p className="text-white/60 text-base font-normal leading-relaxed max-w-[280px]">
                        Nos conteurs numériques ont eu un petit bug.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button 
                        onClick={onRetry}
                        className="w-full h-14 bg-[#3c2de6] hover:bg-[#3224bd] active:scale-[0.98] transition-all text-white text-base font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#3c2de6]/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Réessayer</span>
                    </button>
                    
                    <button 
                        onClick={() => alert("Signalement envoyé.")}
                        className="w-full h-14 bg-transparent border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2"
                    >
                        <Flag className="w-4 h-4" />
                        <span>Signaler</span>
                    </button>
                </div>
            </div>
            <div className="h-8"></div>
        </div>
    );
};
