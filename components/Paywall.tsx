
import React from 'react';
import { X, Check, Lock, Sparkles, Mic, WifiOff, BookOpen } from 'lucide-react';
import { Button } from './Button';
import { stripeService, STRIPE_PRICES } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';

interface PaywallProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onUpgrade }) => {
  const { user } = useAuth();
  const [plan, setPlan] = React.useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = React.useState(false);

  const handleRestore = () => alert("Aucun achat trouvé pour ce compte.");

  const handleUpgradeClick = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour continuer");
      return;
    }

    setLoading(true);
    try {
      const priceId = plan === 'monthly' ? STRIPE_PRICES.monthly : STRIPE_PRICES.yearly;
      await stripeService.redirectToCheckout(priceId, user.id);
    } catch (error) {
      console.error('Checkout error:', error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative animate-fade-in bg-night-900">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
      >
        <X className="w-5 h-5" />
      </button>

      <button onClick={handleRestore} className="absolute top-6 right-6 z-50 text-sm font-medium text-slate-400 hover:text-white">
        Restaurer
      </button>

      {/* Hero Image */}
      <div className="relative h-1/3 w-full">
        <img
          src="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=2070&auto=format&fit=crop"
          alt="Sleeping child"
          className="w-full h-full object-cover mask-image-b"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-900/50 to-night-900" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-dream-500 to-indigo-500 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-dream-500/30">
            <Sparkles className="w-3 h-3" /> Dream Pass
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Débloquez la<br />magie infinie</h2>
          <p className="text-slate-400 text-sm">Rejoignez 10,000+ parents et enfants reposés.</p>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 space-y-6 pt-4">
        <div className="space-y-4">
          <FeatureRow
            icon={<BookOpen className="w-5 h-5 text-amber-400" />}
            title="Histoires illimitées"
            desc="Accès complet à toute la bibliothèque magique."
          />
          <FeatureRow
            icon={<Mic className="w-5 h-5 text-dream-400" />}
            title="Clonage de Voix IA"
            desc="L'IA raconte l'histoire avec VOTRE voix."
          />
          <FeatureRow
            icon={<WifiOff className="w-5 h-5 text-emerald-400" />}
            title="Mode Hors-ligne"
            desc="Téléchargez pour écouter sans ondes."
          />
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-6 bg-night-800/50 backdrop-blur-xl rounded-t-3xl border-t border-white/5 pb-8">
        <div className="flex bg-night-900 p-1 rounded-2xl mb-6 relative">
          <div className={`absolute inset-y-1 w-1/2 bg-night-800 rounded-xl transition-all duration-300 shadow-sm ${plan === 'yearly' ? 'translate-x-full' : 'translate-x-0'}`} />

          <button
            onClick={() => setPlan('monthly')}
            className={`relative z-10 flex-1 py-3 text-center text-sm font-medium transition-colors ${plan === 'monthly' ? 'text-white' : 'text-slate-500'}`}
          >
            Mensuel<br /><span className="text-xs opacity-80">9.99€/mois</span>
          </button>

          <button
            onClick={() => setPlan('yearly')}
            className={`relative z-10 flex-1 py-3 text-center text-sm font-medium transition-colors ${plan === 'yearly' ? 'text-white' : 'text-slate-500'}`}
          >
            <div className="absolute -top-3 right-2 bg-dream-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
              -30% ÉCONOMIE
            </div>
            Annuel<br /><span className="text-xs opacity-80">79.99€/an</span>
          </button>
        </div>

        <Button
          onClick={handleUpgradeClick}
          disabled={loading}
          className="w-full !py-4 text-lg shadow-xl shadow-dream-500/20"
        >
          {loading ? 'Redirection...' : 'Essayer Gratuitement (7 jours)'}
        </Button>
        <p className="text-center text-[10px] text-slate-500 mt-4 underline cursor-pointer">Annulable à tout moment • Conditions • Confidentialité</p>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon, title, desc }: any) => (
  <div className="flex gap-4 items-start bg-white/5 p-3 rounded-2xl border border-white/5">
    <div className="p-2 bg-night-800 rounded-xl shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white text-sm">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);
