
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
        if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');

        const { prompt, history, type, voiceName } = await req.json();

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Or pro if available

        let resultData;

        if (type === 'story') {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            resultData = { text };
        } else if (type === 'tts') {
            // Note: Edge Functions might not support Audio Blob streams perfectly yet via this lib, 
            // but let's try standard fetch for TTS if library fails, or use the library's experimental endpoints.
            // For now, let's assume valid JSON return or base64.
            // Google GenAI node lib usually works.
            // If 'gemini-2.5-flash-preview-tts' is not in the type definitions yet, we might use raw fetch.

            // Simulating raw fetch for TTS flexibility
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`;
            const ttsResp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' } }
                        }
                    }
                })
            });
            const ttsJson = await ttsResp.json();
            resultData = ttsJson;
        }

        return new Response(JSON.stringify(resultData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
