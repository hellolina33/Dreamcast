/// <reference types="vite/client" />

import { StoryParams, ChildProfile } from "../types";
import { supabase } from './supabase';

// ---------------------------------------------------------
// Proxy Wrapper
// ---------------------------------------------------------

async function callGeminiProxy(prompt: string, type: 'story' | 'tts' | 'image', extra: any = {}) {
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase.functions.invoke('gemini-proxy', {
    body: { prompt, type, ...extra }
  });

  if (error) {
    console.error("Proxy Call Error:", error);
    throw error;
  }
  return data;
}

// ---------------------------------------------------------
// Retry Logic Helper
// ---------------------------------------------------------

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const message = (error?.message || '').toLowerCase();
    const isTransient = message.includes('429') || message.includes('503') || message.includes('overloaded') || message.includes('fetch failed');

    if (retries > 0 && isTransient) {
      console.warn(`[Gemini Proxy] Retry attempt... ${retries} left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 1.5);
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
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// ---------------------------------------------------------
// Main Story Generation
// ---------------------------------------------------------

export const generateStoryScript = async (params: StoryParams, profile?: ChildProfile): Promise<{ title: string; script: string; ambience: string }> => {
  if (!navigator.onLine) throw new Error("Pas de connexion internet.");

  const targetWords = Math.max(500, (params.duration || 5) * 150);

  let personalContext = "";
  if (profile) {
    personalContext = `
      PROFIL DE L'ENFANT (CIBLE):
      - Nom: ${profile.name}
      - Âge: ${profile.age} ans
      - Passions: ${profile.interests.join(", ")}
      - Valeurs: ${profile.values.join(", ")}
      - Contexte: ${profile.familyContext}
      `;
  }

  const prompt = `
    Tu es le meilleur conteur d'histoires pour enfants.
    ${personalContext}
    PARAMÈTRES:
    - Thème: ${params.theme}
    - Morale: ${params.moral}
    - Style: ${profile?.languageStyle}
    - Cible: ${params.age} ans
    - Durée: env ${params.duration} min (env ${targetWords} mots)
    
    Structure JSON: { "title": string, "script": string, "ambience": string }
  `;

  const response = await withRetry(() => callGeminiProxy(prompt, 'story', {
    config: { responseMimeType: "application/json" }
  }));

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { title: `Aventure de ${params.childName}`, script: response.text, ambience: 'quiet' };
  }
};

export const generateSpeech = async (text: string, voiceId: string = 'Puck'): Promise<{ audioBuffer: AudioBuffer, audioBlob: Blob }> => {
  const response = await withRetry(() => callGeminiProxy(text, 'tts', { voiceName: voiceId }));

  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

  try {
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio generated");

    const byteArray = decode(base64Audio);
    const audioBuffer = await decodeAudioData(byteArray, outputAudioContext, 24000, 1);
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });

    return { audioBuffer, audioBlob };
  } finally {
    await outputAudioContext.close();
  }
};

export const generateCoverImage = async (prompt: string, style: string): Promise<string> => {
  try {
    const fullPrompt = `Children's book cover. Theme: ${prompt}. Style: ${style}. No text.`;
    const response = await withRetry(() => callGeminiProxy(fullPrompt, 'image'));

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "https://picsum.photos/1024/1024";
  } catch (error) {
    return "https://picsum.photos/1024/1024?blur=2";
  }
};

