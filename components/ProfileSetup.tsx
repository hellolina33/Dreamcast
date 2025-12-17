
import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { Button } from './Button';
import { AVATARS, INTERESTS_LIST, VALUES_LIST, AGE_GROUPS, INITIAL_PROFILE } from '../constants';
import { User, Heart, Shield, Book, Sparkles, Check, ChevronRight, Edit3, Feather, Dices } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: ChildProfile) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ChildProfile>(INITIAL_PROFILE);

  const updateProfile = (updates: Partial<ChildProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleSelection = (list: string[], item: string, field: keyof ChildProfile) => {
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    updateProfile({ [field]: newList });
  };

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else onComplete(profile);
  };

  const handleRandomAvatar = () => {
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    updateProfile({ avatar: randomAvatar });
  };

  // --- STEP 1: IDENTITY ---
  const renderStep1_Identity = () => (
    <div className="flex flex-col h-full animate-fade-in px-2">
      <div className="relative flex flex-col items-center justify-center pt-8 pb-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dream-500/20 rounded-full blur-[80px] animate-pulse-slow pointer-events-none" />
        
        {/* Avatar Circle with Interactive Pencil */}
        <div className="relative group cursor-pointer transition-transform active:scale-95 duration-300" onClick={handleRandomAvatar}>
           <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 animate-float overflow-hidden">
              <span className="text-[7rem] drop-shadow-2xl filter saturate-150 select-none transform group-hover:scale-110 transition-transform">{profile.avatar}</span>
           </div>
           {/* Pencil Button */}
           <div className="absolute -bottom-2 -right-2 z-20 bg-dream-500 hover:bg-dream-400 text-white p-3 rounded-2xl shadow-lg shadow-dream-500/40 border-[4px] border-night-950 transition-colors">
              <Dices className="w-5 h-5 animate-pulse" />
           </div>
        </div>

        <div className="mt-8 text-center space-y-2 relative z-10">
            <h2 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-lg">C'est qui ?</h2>
            <p className="text-dream-200 font-medium text-lg">Commençons par les présentations.</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        
        {/* MAGIC INPUT FIX: No outline, Custom Ring */}
        <div className="space-y-3 px-2">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Son Prénom</label>
           
           <div className="relative group">
              {/* Animated Glow Background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-dream-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
              
              {/* Input Capsule */}
              <div className="relative bg-[#0f172a] border border-white/10 rounded-full flex items-center p-2 shadow-inner transition-all group-focus-within:border-transparent group-focus-within:bg-[#0f172a]">
                  
                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 group-focus-within:bg-dream-500 group-focus-within:text-white group-focus-within:shadow-[0_0_15px_rgba(139,92,246,0.5)] shrink-0">
                      <User className="w-6 h-6" />
                  </div>
                  
                  {/* The actual Input with outline-none */}
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 text-white text-xl font-display font-bold px-4 placeholder-slate-600 caret-dream-400 h-full w-full"
                    placeholder="Ex: Léo"
                    autoComplete="off"
                    autoCorrect="off"
                  />
              </div>
           </div>
        </div>

        <div className="space-y-3 px-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Son Âge</label>
          <div className="grid grid-cols-2 gap-3">
            {AGE_GROUPS.map((group) => {
               const isSelected = profile.age === group.value;
               return (
                <button
                  key={group.value}
                  onClick={() => updateProfile({ age: group.value })}
                  className={`relative h-16 rounded-2xl text-sm font-bold border-2 transition-all duration-300 transform active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-dream-500 to-dream-700 border-dream-400 text-white shadow-[0_10px_20px_-5px_rgba(139,92,246,0.5)] translate-y-[-2px]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="relative z-10">{group.label}</span>
                  {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />}
                </button>
               );
            })}
          </div>
        </div>

        <div className="space-y-3 pb-4 px-2">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Choisir un avatar</label>
           <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 custom-scrollbar snap-x">
             {AVATARS.map(avatar => {
               const isSelected = profile.avatar === avatar;
               return (
                 <button
                   key={avatar}
                   onClick={() => updateProfile({ avatar })}
                   className={`flex-shrink-0 w-16 h-16 rounded-[1.2rem] text-3xl flex items-center justify-center transition-all duration-300 snap-center ${
                     isSelected 
                       ? 'bg-gradient-to-b from-white to-slate-200 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-4 ring-night-950 transform -translate-y-1' 
                       : 'bg-white/5 grayscale hover:grayscale-0 hover:bg-white/10 scale-95'
                   }`}
                 >
                   {avatar}
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );

  // --- STEP 2: PERSONALITY ---
  const renderStep2_Personality = () => (
    <div className="space-y-8 animate-fade-in px-2 pt-6">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-pink-500 blur-[40px] opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transform rotate-3">
                <Heart className="w-10 h-10 text-white fill-white/20" />
            </div>
        </div>
        <div>
            <h2 className="text-3xl font-display font-black text-white">Ses Passions</h2>
            <p className="text-pink-200 font-medium">Qu'est-ce qui fait briller ses yeux ?</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
         {INTERESTS_LIST.map(item => {
           const isSelected = profile.interests.includes(item.label);
           return (
             <button
               key={item.id}
               onClick={() => toggleSelection(profile.interests, item.label, 'interests')}
               className={`group relative p-4 rounded-3xl text-left border-2 transition-all duration-300 active:scale-95 ${
                 isSelected
                   ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500 shadow-[0_8px_16px_-4px_rgba(236,72,153,0.3)]'
                   : 'bg-night-800/50 border-white/5 hover:border-white/20'
               }`}
             >
               <div className="flex justify-between items-start mb-2">
                   <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">{item.emoji}</span>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-pink-500 text-white' : 'bg-night-950 border border-white/10'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                   </div>
               </div>
               <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
             </button>
           );
         })}
       </div>
    </div>
  );

  // --- STEP 3: VALUES (REDESIGNED) ---
  const renderStep3_Values = () => (
    <div className="space-y-8 animate-fade-in px-2 pt-6">
      {/* Header with Emerald Glow */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500 blur-[50px] opacity-40 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)] transform -rotate-3 border border-white/10">
                <Book className="w-10 h-10 text-white fill-white/20" />
            </div>
            {/* Decorative sparkles */}
            <div className="absolute -top-2 -right-4 text-emerald-300 animate-bounce-sm delay-100"><Sparkles className="w-6 h-6" /></div>
            <div className="absolute bottom-0 -left-4 text-teal-300 animate-bounce-sm delay-300"><Sparkles className="w-4 h-4" /></div>
        </div>
        <div>
            <h2 className="text-3xl font-display font-black text-white">Son Univers</h2>
            <p className="text-emerald-200/80 font-medium">Pour des histoires qui ont du sens.</p>
        </div>
      </div>

      <div className="space-y-6 pb-4">
        {/* Values Grid */}
        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
             <Shield className="w-4 h-4 text-emerald-400" /> Valeurs à transmettre
           </label>
           
           <div className="grid grid-cols-2 gap-3">
             {VALUES_LIST.map(item => {
               const isSelected = profile.values.includes(item.label);
               return (
                 <button
                   key={item.id}
                   onClick={() => toggleSelection(profile.values, item.label, 'values')}
                   className={`group relative p-3 rounded-2xl flex items-center gap-3 border-2 transition-all duration-200 active:scale-95 ${
                     isSelected
                       ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 shadow-lg shadow-emerald-500/30 translate-y-[-2px]'
                       : 'bg-night-800/50 border-white/5 hover:bg-night-800 hover:border-white/10'
                   }`}
                 >
                   <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{item.emoji}</span>
                   <span className={`font-bold text-sm text-left leading-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {item.label}
                   </span>
                   {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />}
                 </button>
               );
             })}
           </div>
        </div>

        {/* Family Context - Glass Card */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
              <Feather className="w-4 h-4 text-teal-400" /> Contexte Secret (Optionnel)
          </label>
          <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-[2.2rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <div className="relative bg-night-800/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1 shadow-xl">
                  <textarea 
                    value={profile.familyContext}
                    onChange={(e) => updateProfile({ familyContext: e.target.value })}
                    className="w-full bg-transparent border-none text-white px-5 py-4 h-32 outline-none focus:ring-0 placeholder-slate-600 resize-none leading-relaxed text-base"
                    placeholder="Ex: Famille biculturelle, élévé par sa grand-mère, adore son chien Max..."
                  />
                  <div className="px-5 pb-3 flex justify-between items-center border-t border-white/5 pt-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Privé & Sécurisé</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                          <Edit3 className="w-3 h-3 text-emerald-400" />
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pt-2">
        {step === 1 && renderStep1_Identity()}
        {step === 2 && renderStep2_Personality()}
        {step === 3 && renderStep3_Values()}
      </div>

      <div className="pt-4 mt-auto px-4 pb-4 bg-gradient-to-t from-night-950 via-night-950 to-transparent">
        <div className="flex gap-2 mb-6 justify-center">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/10'}`} />
            ))}
        </div>
        <Button onClick={handleNext} disabled={!profile.name && step === 1} className="w-full text-lg !py-5 shadow-2xl shadow-dream-500/30 group">
            <span className="relative z-10 flex items-center justify-center gap-2">
                {step === 3 ? "Terminer le Profil" : "Continuer"} 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
        </Button>
      </div>
    </div>
  );
};
