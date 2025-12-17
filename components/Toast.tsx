
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const styles = {
        success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', icon: CheckCircle, text: 'text-emerald-100' },
        error: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', icon: AlertOctagon, text: 'text-rose-100' },
        warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', icon: AlertTriangle, text: 'text-amber-100' },
        info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', icon: Info, text: 'text-blue-100' }
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md backdrop-blur-xl ${style.bg} border ${style.border} p-4 rounded-2xl shadow-2xl shadow-black/20 flex items-center gap-4`}
                >
                    <div className={`p-2 rounded-full ${style.bg.replace('/20', '/40')}`}>
                        <Icon className={`w-5 h-5 ${style.text}`} />
                    </div>
                    <p className="flex-1 text-sm font-medium text-white/90">{message}</p>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-4 h-4 text-white/50" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
