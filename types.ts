
export enum AppState {
  ONBOARDING = 'ONBOARDING',
  SETUP = 'SETUP',
  HOME = 'HOME',
  DISCOVERY = 'DISCOVERY',
  SERIES = 'SERIES',
  PROFILE = 'PROFILE',
  VOICE_SELECTION = 'VOICE_SELECTION',
  WIZARD = 'WIZARD',
  GENERATING = 'GENERATING',
  PLAYER = 'PLAYER',
  VOICE_LAB = 'VOICE_LAB',
  PAYWALL = 'PAYWALL',
  DREAM_JOURNAL = 'DREAM_JOURNAL',
  MEDITATIONS = 'MEDITATIONS',
  FEEDBACK = 'FEEDBACK',
  // Good Night Feature
  GOODNIGHT_HOME = 'GOODNIGHT_HOME',
  GOODNIGHT_EDITOR = 'GOODNIGHT_EDITOR',
  GOODNIGHT_THEME = 'GOODNIGHT_THEME',
  GOODNIGHT_HISTORY = 'GOODNIGHT_HISTORY',
  GOODNIGHT_SCHEDULE = 'GOODNIGHT_SCHEDULE',
  GOODNIGHT_TIPS = 'GOODNIGHT_TIPS',
  GOODNIGHT_REACTION = 'GOODNIGHT_REACTION',
  GOODNIGHT_PLAYER = 'GOODNIGHT_PLAYER',
}

export interface ChildProfile {
  name: string;
  age: number;
  avatar: string;
  interests: string[];
  values: string[];
  fears: string[];
  familyContext: string;
  languageStyle: 'douce' | 'dynamique' | 'éducative';
  stats?: {
    storiesCount: number;
    minutesListened: number;
    streak: number;
  }
}

export interface StoryParams {
  childName: string;
  avatar: string;
  age: number;
  theme: string;
  moral: string;
  useRealFacts: boolean;
  location?: string;
  imageStyle: 'cartoon' | 'watercolor' | 'realistic' | 'paper-craft';
  previousContext?: string;
  voiceId?: string;
  // New AI Settings
  duration: number; // in minutes
  languageLevel: '3-5' | '5-7' | '7-9';
  narrativeStyle: 'cooperative' | 'magic' | 'adventurous';
}

export interface Story {
  id: string; // UUID
  user_id?: string; // Owner
  title: string;
  script: string;
  ambience?: string;
  audioBuffer?: AudioBuffer;
  audioUrl?: string; // Remote URL
  coverImageUrl?: string;
  cover_url?: string; // Legacy/DB mapping alias?
  createdAt: number;
  duration: number;
  isFavorite: boolean;
  params: StoryParams;
  seriesId?: string;
  chapterNumber?: number;
}

export interface WizardStepProps {
  data: StoryParams;
  updateData: (updates: Partial<StoryParams>) => void;
  onNext: () => void;
  onBack: () => void;
}
