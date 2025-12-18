import React from 'react';
import { StoryParams, ChildProfile } from "./types";

export const INITIAL_PROFILE: ChildProfile = {
  id: '',
  name: '',
  avatar: '🧑‍🚀',
  age: 5,
  interests: [],
  values: [],
  fears: [],
  familyContext: '',
  languageStyle: 'douce'
};

export const INITIAL_STORY_PARAMS: StoryParams = {
  childName: '',
  avatar: '🧑‍🚀',
  age: 5,
  theme: '',
  moral: '',
  useRealFacts: false,
  location: '',
  imageStyle: 'cartoon',
  duration: 10,
  languageLevel: '5-7',
  narrativeStyle: 'magic',
  voiceId: 'Gemini'
};

export const AGE_GROUPS = [
  { label: 'Tout-petit (2-3)', value: 3 },
  { label: 'Maternelle (4-5)', value: 5 },
  { label: 'Écolier (6-8)', value: 8 },
  { label: 'Grand (9+)', value: 10 },
];

export const AVATARS = [
  '🧑‍🚀', '👸', '🦸', '🧚‍♀️', '🦕', '🦁', '🦄', '🤖', '🦊', '🐻', '🐰', '🐯'
];

export const INTERESTS_LIST = [
  { id: 'space', label: 'Espace', emoji: '🚀' },
  { id: 'dinos', label: 'Dinosaures', emoji: '🦕' },
  { id: 'animals', label: 'Animaux', emoji: '🦁' },
  { id: 'princess', label: 'Princesse/Chevalier', emoji: '👑' },
  { id: 'cars', label: 'Voitures/Trains', emoji: '🚂' },
  { id: 'magic', label: 'Magie', emoji: '✨' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'science', label: 'Sciences', emoji: '🔬' },
  { id: 'sports', label: 'Sport', emoji: '⚽' },
  { id: 'music', label: 'Musique', emoji: '🎵' },
];

export const VALUES_LIST = [
  { id: 'kindness', label: 'Gentillesse', emoji: '❤️' },
  { id: 'courage', label: 'Courage', emoji: '🦁' },
  { id: 'sharing', label: 'Partage', emoji: '🤝' },
  { id: 'honesty', label: 'Honnêteté', emoji: '⚖️' },
  { id: 'curiosity', label: 'Curiosité', emoji: '🔍' },
  { id: 'patience', label: 'Patience', emoji: '⏳' },
  { id: 'ecology', label: 'Écologie', emoji: '🌍' },
  { id: 'faith', label: 'Foi/Spiritualité', emoji: '🙏' },
];

export const THEME_CHIPS = [
  "Voyage dans l'espace",
  "La Forêt Enchantée",
  "L'École des Sorciers",
  "Sous l'Océan",
  "Les Dinosaures",
  "Super-Héros",
  "Le Château Magique",
  "Mission Secrète"
];

export const ART_STYLES = [
  { id: 'cartoon', label: 'Dessin Animé', emoji: '🎨' },
  { id: 'watercolor', label: 'Aquarelle', emoji: '🖌️' },
  { id: 'realistic', label: 'Réaliste', emoji: '📸' },
  { id: 'paper-craft', label: 'Papier Découpé', emoji: '✂️' },
];

export const INSPIRATION_PRESETS = [
  {
    theme: "Un boulanger magique qui fait des croissants volants",
    moral: "Le partage rend heureux",
    location: "Paris, France"
  },
  {
    theme: "Une petite grenouille qui veut chanter à l'opéra",
    moral: "Il faut croire en ses rêves",
    location: "L'Opéra Garnier"
  },
  {
    theme: "Un robot jardinier sur la planète Mars",
    moral: "La nature est précieuse",
    location: "Mars"
  },
  {
    theme: "Un chat détective qui cherche la souris perdue",
    moral: "L'amitié est plus forte que tout",
    location: "Lyon, Vieux Lyon"
  },
  {
    theme: "Un nuage timide qui change de couleur",
    moral: "C'est bien d'être différent",
    location: "Le Mont Blanc"
  }
];

export const SLEEP_TIMERS = [
  { label: 'Off', value: 0 },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

// --- REAL GEMINI VOICES MAPPING ---

// --- REAL GEMINI VOICES MAPPING (Gemini 2.5 Flash/Pro TTS) ---
export const VOICES_LIST = [
  { id: 'Kore', name: 'La Gardienne', desc: 'Ferme & Apaisante (Kore)', icon: '🛡️', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'Puck', name: 'Le Lutin', desc: 'Enjoué & Dynamique (Puck)', icon: '🧚', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { id: 'Charon', name: 'Le Sage', desc: 'Calme & Profond (Charon)', icon: '🦉', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  { id: 'Fenrir', name: 'L\'Aventurier', desc: 'Rapide & Excité (Fenrir)', icon: '⚡', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'Leda', name: 'Douceur Lunaire', desc: 'Jeune & Douce (Leda)', icon: '🌙', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  { id: 'Zephyr', name: 'Rayon de Soleil', desc: 'Brillant & Chaleureux (Zephyr)', icon: '☀️', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'Aoede', name: 'Brise Légère', desc: 'Aérien & Serein (Aoede)', icon: '🌬️', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'Gemini', name: 'Conteur Universel', desc: 'Équilibré (Auto)', icon: '✨', color: 'text-dream-400', bg: 'bg-dream-500/20' },
];

export const DISCOVERY_TAGS = ['Tout', 'Nouveau', 'Magie', 'Nature', 'Espace', 'Animaux'];

export const EXPLORE_CARDS: [] = [];

export const SERIES_MOCK: null = null;

export const MEDITATIONS_MOCK: [] = [];

export const DREAM_JOURNAL_RECENT: [] = [];
