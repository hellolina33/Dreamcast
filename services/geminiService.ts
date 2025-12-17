/// <reference types="vite/client" />

import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { StoryParams, ChildProfile } from "../types";

// Configuration for Environment
const IS_PROD = false;
const API_URL = '/api/generate';

import { supabase } from './supabase';

// Use VITE_GEMINI_API_KEY preferred, fallback to others if configured via define
// SECURITY WARNING: In production, use Edge Functions to hide this key.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

const USE_EDGE_PROXY = import.meta.env.VITE_USE_EDGE_PROXY === 'true';

async function callGeminiProxy(prompt: string, type: 'story' | 'tts', extra: any = {}) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.functions.invoke('gemini-proxy', {
    body: { prompt, type, ...extra }
  });
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------
// Retry Logic Helper (Enhanced for 503 Overloaded)
// ---------------------------------------------------------
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000, timeoutMs = 45000): Promise<T> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    );
    return await Promise.race([fn(), timeout]);
  } catch (error: any) {
    const status = error?.status || error?.code || error?.response?.status || error?.error?.code;
    const message = (error?.message || error?.error?.message || '').toLowerCase();

    const isTransient =
      status === 503 ||
      status === 500 ||
      status === 429 ||
      message.includes('overloaded') ||
      message.includes('fetch failed') ||
      message.includes('unavailable') ||
      message.includes('timeout') ||
      message.includes('timed out');

    if (retries > 0 && isTransient) {
      console.warn(`[Gemini API] Transient Error (${status || 'Timeout'}). Retrying in ${delay / 1000}s...`, message);
      await new Promise(resolve => setTimeout(resolve, delay));
      const nextDelay = delay * 1.5; // Linear backoff is often enough for timeout
      return withRetry(fn, retries - 1, nextDelay, timeoutMs);
    }
    throw error;
  }
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

async function getLocationContext(location: string): Promise<string> {
  if (!location) return "";
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a vivid, kid-friendly description of ${location} in FRENCH. Focus on sensory details.`,
      config: { tools: [{ googleMaps: {} }] }
    }));
    return response.text || "";
  } catch (error) { return ""; }
}

async function getFactualContext(topic: string): Promise<string> {
  if (!topic) return "";
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Trouve 3 faits intéressants, vrais et adaptés aux enfants sur : ${topic}. Réponds en FRANÇAIS.`,
      config: { tools: [{ googleSearch: {} }] }
    }));
    return response.text || "";
  } catch (error) { return ""; }
}

// ---------------------------------------------------------
// Main Story Generation
// ---------------------------------------------------------

export const generateStoryScript = async (params: StoryParams, profile?: ChildProfile): Promise<{ title: string; script: string; ambience: string }> => {
  if (!navigator.onLine) {
    throw new Error("Pas de connexion internet.");
  }

  const researchTasks: Promise<string>[] = [];

  if (params.location && params.location.length > 2) {
    researchTasks.push(getLocationContext(params.location).then(res => res ? `Détails du lieu (${params.location}):\n${res}` : ''));
  }
  if (params.useRealFacts) {
    researchTasks.push(getFactualContext(params.theme).then(res => res ? `Faits amusants sur ${params.theme}:\n${res}` : ''));
  }

  const researchResults = await Promise.all(researchTasks);
  const externalContext = researchResults.filter(Boolean).join("\n\n");

  const targetWords = Math.max(500, (params.duration || 5) * 150);

  let lengthInstruction = "";
  if (params.duration > 15) {
    lengthInstruction = `CRITIQUE: Cette histoire DOIT durer au moins ${params.duration} minutes. Tu DOIS écrire environ ${targetWords} mots. 
      Développe l'intrigue avec plusieurs péripéties, des dialogues riches, des descriptions sensorielles détaillées et des moments de calme. 
      Ne résume pas. Raconte chaque étape en détail.`;
  } else {
    lengthInstruction = `L'histoire doit durer environ ${params.duration} minutes (environ ${targetWords} mots).`;
  }

  let personalContext = "";
  if (profile) {
    personalContext = `
      PROFIL DE L'ENFANT (CIBLE):
      - Nom: ${profile.name}
      - Âge: ${profile.age} ans
      - Passions à inclure subtilement si possible: ${profile.interests.join(", ")}
      - Valeurs éducatives importantes pour la famille: ${profile.values.join(", ")}
      - Contexte Familial/Culturel (A RESPECTER IMPÉRATIVEMENT): ${profile.familyContext}
      `;
  }

  const prompt = `
    Tu es le meilleur conteur d'histoires pour enfants du monde, spécialisé dans les récits thérapeutiques et éducatifs.
    
    ${personalContext}

    PARAMÈTRES DE L'HISTOIRE:
    - Thème principal: ${params.theme}
    - Morale spécifique: ${params.moral || "Une leçon positive adaptée au profil (courage, amitié, honnêteté)"}
    - Style: ${profile?.languageStyle || "Douce et apaisante"}
    - Âge de l'enfant: ${params.age} ans
    
    ${externalContext ? `CONTEXTE RÉEL À INTÉGRER :\n${externalContext}` : ''}
    ${params.previousContext ? `⚠️ IMPORTANT - CECI EST UNE SUITE : Voici le résumé/contexte de l'épisode précédent. Tu dois continuer l'aventure en gardant la cohérence (personnages, ton).\n${params.previousContext}` : ''}

    INSTRUCTIONS CRITIQUES:
    1. **Langue**: FRANÇAIS (France).
    2. **Adaptation Vocabulaire**:
       - Si < 5 ans: Phrases courtes, mots simples, répétitions rassurantes, ton maternel.
       - Si 5-8 ans: Aventure, action, vocabulaire varié mais clair, humour.
       - Si > 8 ans: Intrigue plus complexe, vocabulaire riche, métaphores.
    3. **Structure Narratives Obligatoire**:
       - **Introduction**: Présentation du héros et de son quotidien (Calme).
       - **Incident**: L'élément perturbateur lié au thème.
       - **Péripéties**: 2 ou 3 épreuves à surmonter (Progression).
       - **Climax**: Le moment fort où la leçon est apprise.
       - **Résolution**: Retour au calme, victoire, et affirmation de la morale.
    4. **Respect Culturel/Religieux**: ${profile?.familyContext ? 'IMPERATIF: ' + profile.familyContext : 'Universel et laïque'}.
    5. **Style Direct**: Écris uniquement le texte à lire. PAS de didascalies [bruit de pas].
    6. ${lengthInstruction}

    Structure la réponse en JSON:
    {
      "title": "Titre Magique et Accrocheur",
      "script": "Texte complet de l'histoire...",
      "ambience": "rain" | "wind" | "ocean" | "forest" | "space" | "fire" | "night" | "quiet"
    }
  `;

  const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          script: { type: Type.STRING },
          ambience: { type: Type.STRING }
        },
        required: ["title", "script", "ambience"]
      }
    }
  }));

  const text = response.text || "{}";
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return { title: `Les Aventures de ${params.childName}`, script: text, ambience: 'quiet' };
  }
};

// Helper to map UI voice IDs to valid Gemini API voice names
const normalizeVoiceName = (id: string): string => {
  const map: Record<string, string> = {
    'Gemini': 'Puck', // Fallback for "Auto"
    'Zephyr': 'Fenrir', // Map to closest
    'Leda': 'Aoede',   // Map to closest
    // Direct matches
    'Puck': 'Puck',
    'Charon': 'Charon',
    'Kore': 'Kore',
    'Fenrir': 'Fenrir',
    'Aoede': 'Aoede'
  };
  return map[id] || 'Puck';
};

export const generateSpeech = async (text: string, voiceId: string = 'Puck'): Promise<{ audioBuffer: AudioBuffer, audioBlob: Blob }> => {
  const voiceName = normalizeVoiceName(voiceId);
  const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceName },
        },
      },
    },
  }));

  // Create a temporary AudioContext solely for decoding
  // We use 24000Hz to match Gemini's output if possible, but browsers might enforce hardware sample rate.
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

  try {
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio generated");

    const byteArray = decode(base64Audio);
    const audioBuffer = await decodeAudioData(byteArray, outputAudioContext, 24000, 1);

    // Create Blob for storage (PCM data, though usually we want WAV/MP3 container. 
    // Gemini returns raw PCM or WAV? It says "audio/wav" usually? 
    // Let's assume it's raw PCM/WAV bytes in the response)
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });

    return { audioBuffer, audioBlob };
  } finally {
    // CRITICAL: Close the context to prevent memory leaks and limit errors
    await outputAudioContext.close();
  }
};

export const generateCoverImage = async (prompt: string, style: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{
          text: `A magical, high-quality children's book cover illustration for a story about: ${prompt}. Style: ${style}. Vibrant colors, cute, welcoming. Text-free.`,
        }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: size }
      },
    }));

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "https://picsum.photos/1024/1024";
  } catch (error) {
    return "https://picsum.photos/1024/1024?blur=2";
  }
};
