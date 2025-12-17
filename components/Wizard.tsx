
import React from 'react';
import { StoryParams, ChildProfile } from '../types';
import { Button } from './Button';
import { INSPIRATION_PRESETS, THEME_CHIPS, ART_STYLES } from '../constants';
import { Sparkles, MapPin, Search, Mic, Palette, Dices, Sliders, Moon, HandHeart, Wand2, Check, ArrowRight } from 'lucide-react';

interface WizardProps {
  data: StoryParams;
  updateData: (updates: Partial<StoryParams>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  profile: ChildProfile;
}

export const Wizard: React.FC<WizardProps> = ({ data, updateData, onSubmit, onCancel, profile }) => {
  const [step, setStep] = React.useState(2);

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleNext = () => {
    vibrate();
    setStep(s => s + 1);
  };

  const handleBack = () => {
    vibrate();
    setStep(s => s - 1);
  };

  const handleInspireMe = () => {
    vibrate();

    // Personalized Inspiration Logic
    if (profile && (profile.interests?.length > 0 || profile.values?.length > 0)) {
      const randomInterest = profile.interests?.length > 0
        ? profile.interests[Math.floor(Math.random() * profile.interests.length)]
        : "l'aventure";

      const randomValue = profile.values?.length > 0
        ? profile.values[Math.floor(Math.random() * profile.values.length)]
        : "le courage";

      // Create a personalized prompt
      const themes = [
        `Une aventure avec ${profile.name} sur le thème de : ${randomInterest}`,
        `${profile.name} découvre le secret de : ${randomInterest}`,
        `Le jour où ${profile.name} a appris l'importance de : ${randomValue}`,
        `${profile.name} et le mystère de ${randomInterest}`
      ];

      const randomTheme = themes[Math.floor(Math.random() * themes.length)];

      updateData({
        theme: randomTheme,
        moral: `Une histoire pour apprendre ${randomValue}`,
        location: "Un lieu imaginaire",
        useRealFacts: true
      });

    } else {
      // Fallback to presets if no profile data
      const random = INSPIRATION_PRESETS[Math.floor(Math.random() * INSPIRATION_PRESETS.length)];
      updateData({
        theme: random.theme,
        moral: random.moral,
        location: random.location,
        useRealFacts: true
      });
    }
  };

  // --- Step 2: Content (Updated UI) ---
  if (step === 2) {
    return (
      <div className="flex flex-col h-full animate-fade-in px-4">
        {/* Fun Header */}
        <div className="text-center space-y-2 mb-6 pt-4">
          <div className="w-24 h-24 mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center border-[4px] border-night-900 shadow-xl transform group-hover:rotate-12 transition-transform duration-300">
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white leading-none">L'Aventure ?</h2>
          <p className="text-indigo-200 text-sm font-medium">De quoi va-t-on parler ?</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-6">

          {/* Dice Button */}
          <button
            onClick={handleInspireMe}
            className="w-full py-4 bg-white/5 border-2 border-dashed border-white/20 rounded-[2rem] text-dream-300 font-bold flex items-center justify-center gap-3 hover:bg-white/10 hover:border-dream-400 hover:text-white transition-all active:scale-[0.98] group"
          >
            <div className="w-8 h-8 bg-dream-500 rounded-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
              <Dices className="w-5 h-5 text-white" />
            </div>
            <span>Surprends-moi (Aléatoire)</span>
          </button>

          {/* Chips */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Idées Rapides</label>
            <div className="flex flex-wrap gap-3">
              {THEME_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => { vibrate(); updateData({ theme: chip }); }}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold border-b-4 transition-all transform active:scale-95 active:border-b-0 active:translate-y-1 ${data.theme === chip
                      ? 'bg-dream-500 border-dream-700 text-white shadow-lg'
                      : 'bg-night-800 border-night-950 text-slate-400 hover:bg-night-700'
                    }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Ou ton idée...</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2.2rem] opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
              <textarea
                value={data.theme}
                onChange={(e) => updateData({ theme: e.target.value })}
                className="relative w-full bg-night-800 border-2 border-transparent rounded-[2rem] px-6 py-5 h-36 focus:outline-none text-white resize-none text-xl font-display font-bold placeholder-slate-600 transition-all shadow-inner"
                placeholder="ex: Un chat astronaute..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 mt-auto pb-6">
          <Button variant="ghost" onClick={onCancel} className="col-span-1">
            Retour
          </Button>
          <Button onClick={handleNext} className="col-span-2" disabled={!data.theme}>
            Suivant <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // --- Step 3: Style (Updated UI) ---
  if (step === 3) {
    return (
      <div className="flex flex-col h-full animate-fade-in px-4">
        <div className="text-center space-y-2 mb-6 pt-4">
          <div className="w-24 h-24 mx-auto relative group">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center border-[4px] border-night-900 shadow-xl transform hover:scale-105 transition-transform">
              <Palette className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Le Style ?</h2>
          <p className="text-indigo-200 text-sm font-medium">À quoi ça ressemble ?</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-6">

          {/* Toggle Card */}
          <div className="bg-night-800/50 rounded-[2rem] p-2 border border-white/5">
            <label className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Vrais Savoirs</div>
                  <div className="text-xs text-slate-400">Faits éducatifs réels</div>
                </div>
              </div>
              <div className={`w-16 h-9 rounded-full transition-colors relative shadow-inner ${data.useRealFacts ? 'bg-emerald-500' : 'bg-night-950'}`}>
                <input
                  type="checkbox"
                  checked={data.useRealFacts}
                  onChange={(e) => { vibrate(); updateData({ useRealFacts: e.target.checked }); }}
                  className="opacity-0 w-full h-full absolute inset-0 cursor-pointer z-10"
                />
                <div className={`absolute top-1 left-1 bg-white w-7 h-7 rounded-full shadow-lg transition-transform duration-300 ${data.useRealFacts ? 'translate-x-7' : ''}`} />
              </div>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Style Visuel</label>
            <div className="grid grid-cols-2 gap-3">
              {ART_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => { vibrate(); updateData({ imageStyle: style.id as any }); }}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-[2rem] transition-all duration-300 border-2 ${data.imageStyle === style.id
                      ? 'bg-dream-500 border-dream-400 shadow-[0_10px_20px_-5px_rgba(139,92,246,0.4)] scale-[1.02]'
                      : 'bg-night-800 border-transparent hover:bg-night-700'
                    }`}
                >
                  <span className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{style.emoji}</span>
                  <span className={`text-xs font-black uppercase tracking-wide ${data.imageStyle === style.id ? 'text-white' : 'text-slate-400'}`}>{style.label}</span>
                  {data.imageStyle === style.id && <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-dream-500 stroke-[4]" /></div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 mt-auto pb-6">
          <Button variant="ghost" onClick={handleBack} className="col-span-1">Retour</Button>
          <Button onClick={handleNext} className="col-span-2">Suivant <ArrowRight className="w-5 h-5" /></Button>
        </div>
      </div>
    );
  }

  // --- Step 4: AI Settings (Updated UI) ---
  if (step === 4) {
    return (
      <div className="flex flex-col h-full animate-fade-in px-4 relative">
        <div className="flex items-center justify-between py-6">
          <button onClick={handleBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><ArrowRight className="w-6 h-6 transform rotate-180" /></button>
          <h2 className="text-2xl font-display font-bold text-white">Réglages Magiques</h2>
          <div className="w-12"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pb-8">

          {/* Chunky Duration Slider */}
          <div className="bg-night-800/50 border border-white/5 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-400" /> Durée</h3>
              <div className="bg-dream-500 text-white text-sm font-black px-4 py-2 rounded-xl shadow-lg transform rotate-2">
                {data.duration} min
              </div>
            </div>
            <div className="relative h-12 flex items-center">
              <input
                type="range"
                min="5"
                max="30"
                value={data.duration}
                onChange={(e) => updateData({ duration: parseInt(e.target.value) })}
                className="w-full h-6 bg-night-950 rounded-full appearance-none cursor-pointer accent-dream-500 border border-white/10"
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Rapide (5m)</span>
              <span>Longue Nuit (30m)</span>
            </div>
          </div>

          {/* Narrative Style Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Type d'aventure</h3>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'cooperative', label: 'Coopératif', desc: 'Le héros se fait des amis', icon: HandHeart, color: 'text-pink-400', bg: 'bg-pink-500/20' },
                { id: 'magic', label: 'Magique', desc: 'Sortilèges et merveilles', icon: Wand2, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                { id: 'adventurous', label: 'Aventure', desc: 'Action et découvertes', icon: MapPin, color: 'text-orange-400', bg: 'bg-orange-500/20' }
              ].map((mode: any) => (
                <button
                  key={mode.id}
                  onClick={() => { vibrate(); updateData({ narrativeStyle: mode.id }); }}
                  className={`relative p-4 rounded-[2rem] flex items-center gap-4 transition-all border-2 text-left active:scale-[0.98] ${data.narrativeStyle === mode.id
                      ? 'bg-night-800 border-dream-500 shadow-lg'
                      : 'bg-night-900 border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${mode.bg} flex items-center justify-center shrink-0`}>
                    <mode.icon className={`w-7 h-7 ${mode.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${data.narrativeStyle === mode.id ? 'text-white' : 'text-slate-300'}`}>{mode.label}</h4>
                    <p className="text-xs text-slate-500 font-medium">{mode.desc}</p>
                  </div>
                  {data.narrativeStyle === mode.id && <div className="w-8 h-8 bg-dream-500 rounded-full flex items-center justify-center shadow-lg"><Check className="w-4 h-4 text-white stroke-[3]" /></div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 pb-8">
          <Button onClick={() => { vibrate(); onSubmit(); }} className="w-full !py-5 text-xl shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)]">
            <Sparkles className="w-6 h-6 mr-1 animate-pulse" />
            Créer l'histoire !
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
