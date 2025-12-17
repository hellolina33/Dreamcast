
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import { INITIAL_STORY_PARAMS, INITIAL_PROFILE } from './constants';
import { AppState, Story, StoryParams, ChildProfile } from './types';
import { Wizard } from './components/Wizard';
import { Player } from './components/Player';
import { Onboarding } from './components/Onboarding';
import { ProfileSetup } from './components/ProfileSetup';
import { VoiceLab } from './components/VoiceLab';
import { Paywall } from './components/Paywall';
import { OfflineScreen, ErrorScreen } from './components/ErrorScreens';
import { ProfileDetail } from './components/ProfileDetail';
import { VoiceSelector } from './components/VoiceSelector';
import { Discovery } from './components/Discovery';
import { SeriesList } from './components/SeriesList';
import { Feedback } from './components/Feedback';
import { DreamJournal } from './components/DreamJournal';
import { Meditations } from './components/Meditations';
import { GamifiedLoader } from './components/GamifiedLoader';
// Import Good Night Components
import {
  GoodNightHome, GoodNightEditor, GoodNightTheme, GoodNightHistory,
  GoodNightSchedule, GoodNightTips, GoodNightPlayer
} from './components/GoodNightComponents';

import { generateStoryScript, generateSpeech, generateCoverImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { supabase } from './services/supabase';
import { Plus, Compass, Grid, User, Home as HomeIcon } from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { triggerConfetti } from './utils/confetti';
import { useHaptic } from './hooks/useHaptic';
import { useSubscription } from './hooks/useSubscription';
import { AppRouter } from './components/AppRouter';

import { useStoryManager } from './hooks/useStoryManager';
import { PasswordReset } from './components/PasswordReset';

export default function App() {
  const { user, loading: authLoading, isRecoveryMode, clearRecoveryMode } = useAuth();
  const { light, medium, impact } = useHaptic();
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [childProfile, setChildProfile] = useState<ChildProfile>(INITIAL_PROFILE);
  const [searchTerm, setSearchTerm] = useState('');
  // const [showToast, setShowToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null); // Replaced by global hook
  const [streak, setStreak] = useState(0);
  const [greeting, setGreeting] = useState("Bonjour");
  const [isInitialized, setIsInitialized] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { isPremium, checkAccess, incrementDailyCount, upgradeToPremium } = useSubscription();
  const [errorState, setErrorState] = useState<'OFFLINE' | 'GENERIC' | null>(null);

  // Hook for Story Management
  const {
    stories,
    setStories,
    activeStory,
    isNewStory,
    loadingStep,
    storyParams,
    setStoryParams,
    updateParams,
    handleCreate,
    handleSequel,
    handleOpenStory,
    toggleFavorite,
    deleteStory,
    startWizard,
    isLoadingStories
  } = useStoryManager({
    user,
    childProfile,
    setAppState,
    checkAccess,
    incrementDailyCount,
    setErrorState
  });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setDeferredPrompt(e); });

    // Note: Story loading is now inside the hook

    const savedProfile = localStorage.getItem('dreamcast_profile');
    const introSeen = localStorage.getItem('dreamcast_intro_seen');

    if (!introSeen) setAppState(AppState.ONBOARDING);
    else if (!savedProfile) setAppState(AppState.SETUP);
    else setChildProfile(JSON.parse(savedProfile));

    // Premium is now managed by useSubscription hook

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Bonjour" : hour < 18 ? "Bonne après-midi" : "Bonsoir");
    setStreak(parseInt(localStorage.getItem('dreamcast_streak') || '1'));

    setIsInitialized(true);

    const handleOnline = () => setErrorState(null);
    const handleOffline = () => {
      if (appState !== AppState.PLAYER) setErrorState('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (!navigator.onLine) setErrorState('OFFLINE');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Note: Removed dependencies that are now handled in separate effects or hooks

  // Global Toast Hook
  const { showToast } = useToast();

  const handleProfileComplete = (profile: ChildProfile) => {
    setChildProfile(profile);
    localStorage.setItem('dreamcast_profile', JSON.stringify(profile));
    setStoryParams(prev => ({ ...prev, childName: profile.name, avatar: profile.avatar, age: profile.age }));
    setAppState(AppState.HOME);
    showToast("Profil magique créé !", 'success');
  };

  // Deprecated: Internal helper replaced by direct showToast call if needed, 
  // but keeping 'showNotification' wrapper for minimizing refactor if widely used.
  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    showToast(msg, type);
  };



  const handleUpgrade = () => {
    upgradeToPremium();
    localStorage.setItem('dreamcast_premium', 'true');
    setAppState(AppState.VOICE_LAB);
    showNotification("Bienvenue dans le Club Dream ! 🌟", "success");
  };


  const filteredStories = stories.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.params.theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isInitialized) return null;

  if (errorState === 'OFFLINE') return <OfflineScreen onGoToLibrary={() => { setErrorState(null); setAppState(AppState.HOME); }} />;
  if (errorState === 'GENERIC') return <ErrorScreen onRetry={() => { setErrorState(null); handleCreate(); }} onCancel={() => setErrorState(null)} />;

  const isMainTab = [AppState.HOME, AppState.DISCOVERY, AppState.SERIES, AppState.PROFILE].includes(appState);

  // NEW: Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-dream-500 rounded-full blur-[20px]"></div>
          <p className="mt-4 text-dream-200 font-bold">Chargement du Rêve...</p>
        </div>
      </div>
    );
  }

  // NEW: Password Recovery Guard
  if (isRecoveryMode) {
    return <PasswordReset onComplete={() => { clearRecoveryMode(); setAppState(AppState.HOME); }} />;
  }

  // NEW: Login Guard
  if (!user) {
    return <LoginScreen onSuccess={() => { }} />;
  }



  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 font-sans text-white">
      <div className="w-full max-w-md bg-night-950/40 md:bg-night-900/60 backdrop-blur-3xl h-[100dvh] md:h-[850px] md:rounded-[3rem] md:border md:border-white/10 shadow-2xl overflow-hidden relative">

        <div className="h-full relative z-10 flex flex-col">
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <AppRouter
              appState={appState}
              setAppState={setAppState}
              user={user}
              childProfile={childProfile}
              stories={stories}
              activeStory={activeStory || null}
              isNewStory={isNewStory}
              loadingStep={loadingStep}
              storyParams={storyParams}
              updateParams={updateParams}
              handleProfileComplete={handleProfileComplete}
              startWizard={startWizard}
              handleCreate={handleCreate}
              handleSequel={handleSequel}
              handleOpenStory={handleOpenStory}
              handleLoginSuccess={() => { }}
              toggleFavorite={toggleFavorite}
              deleteStory={deleteStory}
              filteredStories={filteredStories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              streak={streak}
              greeting={greeting}
              isLoading={isLoadingStories}
              isPremium={isPremium}
              onShowPaywall={() => setAppState(AppState.PAYWALL)}
            />
          </div>

          {/* CENTERED FLOATING DOCK NAV */}
          {isMainTab && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90%] md:max-w-sm">
              <div className="bg-[#1e1e2e]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] relative">

                <NavButton active={appState === AppState.HOME} onClick={() => setAppState(AppState.HOME)} icon={<HomeIcon className="w-6 h-6" />} />
                <NavButton active={appState === AppState.DISCOVERY} onClick={() => setAppState(AppState.DISCOVERY)} icon={<Compass className="w-6 h-6" />} />

                {/* Center Button (Inline) */}
                <button
                  onClick={() => { impact(); startWizard(); }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-dream-600 to-dream-400 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Plus className="w-6 h-6 text-white stroke-[3]" />
                </button>

                <NavButton active={appState === AppState.SERIES} onClick={() => setAppState(AppState.SERIES)} icon={<Grid className="w-6 h-6" />} />
                <NavButton active={appState === AppState.PROFILE} onClick={() => setAppState(AppState.PROFILE)} icon={<User className="w-6 h-6" />} />
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon }: any) => {
  const { light } = useHaptic();
  return (
    <button
      onClick={() => { light(); onClick(); }}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active
        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-110'
        : 'text-slate-500 hover:text-white hover:bg-white/5'
        }`}
    >
      {icon}
    </button>
  );
};
