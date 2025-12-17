import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { AppState, Story, StoryParams, ChildProfile } from '../types';
import { PageTransition } from './PageTransition';

// Screens (Lazy Loaded)
const Wizard = React.lazy(() => import('./Wizard').then(m => ({ default: m.Wizard })));
const Player = React.lazy(() => import('./Player').then(m => ({ default: m.Player })));
const Onboarding = React.lazy(() => import('./Onboarding').then(m => ({ default: m.Onboarding })));
const ProfileSetup = React.lazy(() => import('./ProfileSetup').then(m => ({ default: m.ProfileSetup })));
const VoiceLab = React.lazy(() => import('./VoiceLab').then(m => ({ default: m.VoiceLab })));
const Paywall = React.lazy(() => import('./Paywall').then(m => ({ default: m.Paywall })));
const ProfileDetail = React.lazy(() => import('./ProfileDetail').then(m => ({ default: m.ProfileDetail })));
const VoiceSelector = React.lazy(() => import('./VoiceSelector').then(m => ({ default: m.VoiceSelector })));
const Discovery = React.lazy(() => import('./Discovery').then(m => ({ default: m.Discovery })));
const SeriesList = React.lazy(() => import('./SeriesList').then(m => ({ default: m.SeriesList })));
const Feedback = React.lazy(() => import('./Feedback').then(m => ({ default: m.Feedback })));
const DreamJournal = React.lazy(() => import('./DreamJournal').then(m => ({ default: m.DreamJournal })));
const Meditations = React.lazy(() => import('./Meditations').then(m => ({ default: m.Meditations })));
const GamifiedLoader = React.lazy(() => import('./GamifiedLoader').then(m => ({ default: m.GamifiedLoader })));
const Home = React.lazy(() => import('./Home').then(m => ({ default: m.Home })));
const LoginScreen = React.lazy(() => import('./LoginScreen').then(m => ({ default: m.LoginScreen })));

// Good Night (Lazy Loaded Group)
const GoodNightHome = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightHome })));
const GoodNightEditor = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightEditor })));
const GoodNightTheme = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightTheme })));
const GoodNightHistory = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightHistory })));
const GoodNightSchedule = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightSchedule })));
const GoodNightTips = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightTips })));
const GoodNightPlayer = React.lazy(() => import('./GoodNightComponents').then(m => ({ default: m.GoodNightPlayer })));

interface AppRouterProps {
    appState: AppState;
    setAppState: (state: AppState) => void;
    user: any;
    childProfile: ChildProfile;
    stories: Story[];
    activeStory: Story | null;
    isNewStory: boolean;
    loadingStep: number;
    storyParams: StoryParams;
    updateParams: (updates: Partial<StoryParams>) => void;
    handleProfileComplete: (profile: ChildProfile) => void;
    startWizard: () => void;
    handleCreate: () => void;
    handleSequel: (story: Story) => void;
    handleOpenStory: (story: Story) => void;
    handleLoginSuccess: () => void;
    toggleFavorite: (e: any, id: string) => void;
    deleteStory?: (id: string) => void;
    filteredStories: Story[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    streak: number;
    greeting: string;
    isLoading?: boolean;
    isPremium?: boolean;
    onShowPaywall?: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
    appState, setAppState, user, childProfile, stories, activeStory, isNewStory,
    loadingStep, storyParams, updateParams, handleProfileComplete, startWizard,
    handleCreate, handleSequel, handleOpenStory, handleLoginSuccess, toggleFavorite,
    filteredStories, searchTerm, setSearchTerm, streak, greeting, isLoading,
    isPremium, onShowPaywall
}) => {

    return (
        <ErrorBoundary onReset={() => setAppState(AppState.HOME)}>
            <React.Suspense fallback={
                <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-dream-500 border-t-white rounded-full animate-spin"></div>
                </div>
            }>
                <AnimatePresence mode="wait">
                    {!user && <LoginScreen key="login" onSuccess={handleLoginSuccess} />}

                    {user && appState === AppState.ONBOARDING && (
                        <PageTransition key="onboarding"><Onboarding onComplete={() => setAppState(AppState.SETUP)} /></PageTransition>
                    )}

                    {user && appState === AppState.SETUP && (
                        <PageTransition key="setup"><ProfileSetup onComplete={handleProfileComplete} initialData={childProfile} /></PageTransition>
                    )}

                    {user && appState === AppState.PROFILE && (
                        <PageTransition key="profile">
                            <ProfileDetail profile={childProfile} onSave={(p) => { handleProfileComplete(p); setAppState(AppState.HOME); }} onBack={() => setAppState(AppState.HOME)} />
                        </PageTransition>
                    )}

                    {user && appState === AppState.WIZARD && (
                        <PageTransition key="wizard">
                            <Wizard
                                params={storyParams}
                                onUpdate={updateParams}
                                onBack={() => setAppState(AppState.HOME)}
                                onCreate={handleCreate}
                            />
                        </PageTransition>
                    )}

                    {user && appState === AppState.PAYWALL && (
                        <PageTransition key="paywall"><Paywall onClose={() => setAppState(AppState.HOME)} /></PageTransition>
                    )}

                    {/* --- GOOD NIGHT MODE ROUTES --- */}
                    {user && appState === AppState.GOODNIGHT_HOME && (
                        <PageTransition key="gn-home"><GoodNightHome onBack={() => setAppState(AppState.HOME)} onNavigate={setAppState} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_EDITOR && (
                        <PageTransition key="gn-editor"><GoodNightEditor onBack={() => setAppState(AppState.GOODNIGHT_HOME)} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_THEME && (
                        <PageTransition key="gn-theme"><GoodNightTheme onBack={() => setAppState(AppState.GOODNIGHT_HOME)} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_HISTORY && (
                        <PageTransition key="gn-history"><GoodNightHistory onBack={() => setAppState(AppState.GOODNIGHT_HOME)} stories={stories} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_SCHEDULE && (
                        <PageTransition key="gn-schedule"><GoodNightSchedule onBack={() => setAppState(AppState.GOODNIGHT_HOME)} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_TIPS && (
                        <PageTransition key="gn-tips"><GoodNightTips onBack={() => setAppState(AppState.GOODNIGHT_HOME)} /></PageTransition>
                    )}
                    {user && appState === AppState.GOODNIGHT_PLAYER && (
                        <PageTransition key="gn-player"><GoodNightPlayer onBack={() => setAppState(AppState.GOODNIGHT_HOME)} /></PageTransition>
                    )}


                    {user && appState === AppState.VOICE_SELECTION && (
                        <PageTransition key="voice-sel"><VoiceSelector onBack={() => setAppState(AppState.HOME)} /></PageTransition>
                    )}

                    {user && appState === AppState.DISCOVERY && (
                        <PageTransition key="discovery"><Discovery onBack={() => setAppState(AppState.HOME)} /></PageTransition>
                    )}

                    {user && appState === AppState.SERIES && (
                        <PageTransition key="series"><SeriesList onBack={() => setAppState(AppState.HOME)} /></PageTransition>
                    )}

                    {user && appState === AppState.VOICE_LAB && (
                        <PageTransition key="voicelab">
                            <VoiceLab onBack={() => setAppState(AppState.HOME)} />
                        </PageTransition>
                    )}

                    {user && appState === AppState.GENERATING && (
                        <PageTransition key="generating">
                            <GamifiedLoader currentStep={loadingStep} steps={['Imagination...', 'Illustration...', 'Narration...', 'Finalisation']} />
                        </PageTransition>
                    )}

                    {user && appState === AppState.PLAYER && activeStory && (
                        <PageTransition key="player">
                            <div className="h-full bg-night-950 px-6 pt-6">
                                <Player
                                    story={activeStory}
                                    onBack={() => setAppState(AppState.HOME)}
                                    onSequel={handleSequel}
                                    isNewStory={isNewStory}
                                    isPremium={isPremium}
                                    onShowPaywall={onShowPaywall}
                                />
                            </div>
                        </PageTransition>
                    )}

                    {user && appState === AppState.HOME && (
                        <PageTransition key="home">
                            <Home
                                childProfile={childProfile}
                                greeting={greeting}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filteredStories={filteredStories}
                                setAppState={setAppState}
                                startWizard={startWizard}
                                handleOpenStory={handleOpenStory}
                                toggleFavorite={toggleFavorite}
                                isLoading={isLoading}
                            />
                        </PageTransition>
                    )}
                </AnimatePresence>
            </React.Suspense>
        </ErrorBoundary>
    );
};
