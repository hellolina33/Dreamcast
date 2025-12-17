
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIG ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("❌ ERREUR: GEMINI_API_KEY est manquante. Lancez avec: GEMINI_API_KEY=... node scripts/generate-previews.js");
    process.exit(1);
}

const VOICES_LIST = [
    { id: 'Kore', name: 'La Gardienne' },
    { id: 'Puck', name: 'Le Lutin' },
    { id: 'Charon', name: 'Le Sage' },
    { id: 'Fenrir', name: 'L\'Aventurier' },
    { id: 'Leda', name: 'Douceur Lunaire' },
    { id: 'Zephyr', name: 'Rayon de Soleil' },
    { id: 'Aoede', name: 'Brise Légère' },
    { id: 'Gemini', name: 'Conteur Universel' }, // Will use a default fallback in the loop if ID invalid? No, better to map it.
];

const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/voices');

// --- WAV HEADER HELPER ---
function writeWavHeader(samples, sampleRate, numChannels, bitDepth) {
    const byteRate = (sampleRate * numChannels * bitDepth) / 8;
    const blockAlign = (numChannels * bitDepth) / 8;
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + samples.length, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (1 is PCM)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate
    view.setUint32(28, byteRate, true);
    // block align
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, samples.length, true);

    return Buffer.concat([Buffer.from(buffer), samples]);
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// --- GENERATOR ---
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function generate() {
    console.log(`🚀 Démarrage de la génération pour ${VOICES_LIST.length} voix...`);

    for (const voice of VOICES_LIST) {
        process.stdout.write(`🎙️  Génération pour ${voice.name} (${voice.id})... `);

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: `Bonjour, je suis ${voice.name}. Choisis-moi pour raconter tes histoires !` }] }],
                config: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voice.id === 'Gemini' ? 'Puck' : voice.id },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) throw new Error("Pas de données audio.");

            // Convert Base64 to Buffer (PCM 16-bit LE, 24kHz presumably from docs, but let's assume raw PCM)
            // Note: Gemini API returns raw PCM usually. We need to wrap it in WAV container.
            // Documentation example implies we receive raw PCM.
            const pcmBuffer = Buffer.from(base64Audio, 'base64');
            const wavBuffer = writeWavHeader(pcmBuffer, 24000, 1, 16); // 24kHz Mono 16-bit is standard for Gemini

            fs.writeFileSync(path.join(OUTPUT_DIR, `${voice.id}.wav`), wavBuffer);
            console.log("✅ OK");
        } catch (e) {
            console.log("❌ ERREUR");
            console.error(e.message);
        }
    }
    console.log("✨ Terminé !");
}

generate();
