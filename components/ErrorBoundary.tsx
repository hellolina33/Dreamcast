import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Oups ! Un petit souci...</h2>
                    <p className="text-slate-300 mb-8 max-w-xs text-sm">
                        Une erreur inattendue s'est produite. Nos lutins sont sur le coup !
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                if (this.props.onReset) this.props.onReset();
                                window.location.reload();
                            }}
                            className="px-6 py-3 bg-white text-night-950 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Recharger
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
