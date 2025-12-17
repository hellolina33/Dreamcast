
import React, { useState } from 'react';
import { Sparkles, Crown, Headphones, ArrowRight, Star, BookOpen, Moon, X } from 'lucide-react';
import { Button } from './Button';

interface OnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: "Bienvenue sur DreamCast",
    desc: "Transformez le rituel du coucher en une expérience audio magique, générée par l'IA.",
    icon: Sparkles,
    color: "text-dream-400",
    bg: "bg-dream-500/20",
    gradient: "from-dream-500/10"
  },
  {
    id: 2,
    title: "Votre Enfant, Le Héros",
    desc: "Il choisit son avatar, son thème, et devient le personnage principal d'une aventure unique.",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    gradient: "from-amber-500/10"
  },
  {
    id: 3,
    title: "Cinéma pour les Oreilles",
    desc: "Des voix ultra-réalistes et des ambiances sonores (pluie, forêt) pour apaiser l'esprit.",
    icon: Headphones,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
    gradient: "from-cyan-500/10"
  },
  {
    id: 4,
    title: "Apprendre en Rêvant",
    desc: "Intégrez des faits réels ou des morales positives pour des histoires intelligentes.",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    gradient: "from-emerald-500/10"
  },
  {
    id: 5,
    title: "Sommeil Préservé",
    desc: "Une expérience 100% audio et une interface sombre pour protéger les yeux de la lumière bleue.",
    icon: Moon,
    color: "text-indigo-300",
    bg: "bg-indigo-500/20",
    gradient: "from-indigo-500/10"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleNext = () => {
    vibrate();
    
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    vibrate();
    setIsExiting(true);
    setTimeout(onComplete, 500); // Wait for exit animation
  };

  const SlideIcon = SLIDES[currentSlide].icon;

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-opacity duration-500 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      
      {/* Skip Button */}
      <button 
        onClick={finishOnboarding}
        className="absolute top-6 right-6 z-50 text-slate-500 hover:text-white transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out">
        <div className={`absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-b ${SLIDES[currentSlide].gradient} via-transparent to-night-900 transition-colors duration-1000`} />
        
        {/* Animated Stars */}
        <div className="absolute top-20 right-10 animate-float opacity-50">
           <Star className={`w-6 h-6 fill-current transition-colors duration-1000 ${SLIDES[currentSlide].color}`} />
        </div>
        <div className="absolute bottom-40 left-10 animate-pulse-slow opacity-30">
           <Star className={`w-4 h-4 fill-current transition-colors duration-1000 ${SLIDES[currentSlide].color}`} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        {/* Animated Icon Card */}
        <div key={currentSlide} className="animate-slide-up mb-10 relative group">
           <div className={`absolute inset-0 blur-3xl transition-colors duration-500 ${SLIDES[currentSlide].bg} opacity-60`} />
           <div className="w-48 h-48 bg-night-800/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 transform transition-transform group-hover:scale-105 duration-500 ring-1 ring-white/5">
              <SlideIcon className={`w-24 h-24 ${SLIDES[currentSlide].color} drop-shadow-2xl transition-all duration-500`} strokeWidth={1.5} />
           </div>
        </div>

        {/* Text Content */}
        <div key={`text-${currentSlide}`} className="text-center space-y-4 max-w-xs animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
            {SLIDES[currentSlide].title}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            {SLIDES[currentSlide].desc}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-8 space-y-8 z-20">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-3">
          {SLIDES.map((slide, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                idx === currentSlide 
                  ? `w-8 ${slide.color.replace('text-', 'bg-')}` 
                  : 'w-2 bg-night-700 hover:bg-night-600'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleNext}
          className="shadow-xl shadow-black/20 group overflow-hidden relative !py-5 text-lg"
        >
          <span className="relative z-10 flex items-center gap-3">
            {currentSlide === SLIDES.length - 1 ? "Commencer l'Aventure" : "Continuer"}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
        </Button>
      </div>
    </div>
  );
};
