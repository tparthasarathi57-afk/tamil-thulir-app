import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "./audioUtils";

const API_KEY = process.env.API_KEY || '';

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000,
    });
  }
  return audioContext;
}

/**
 * Generates speech for a given text.
 * Improved for single character accuracy and deployment reliability.
 */
export const generateSpeech = async (text: string): Promise<boolean> => {
  if (!API_KEY) {
    console.error("API Key is missing. Deployment check: Ensure VITE_API_KEY is set in Netlify.");
    return false;
  }

  const ctx = getAudioContext();
  
  // Crucial: AudioContext must be resumed inside a user gesture handler.
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Explicitly ask for pronunciation to help the model with ambiguous characters like ஆ (AA)
    const isSingleChar = [...text].length === 1;
    const prompt = isSingleChar 
      ? `Please pronounce the Tamil letter "${text}" clearly and slowly.` 
      : `Say: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    let base64Audio: string | undefined;
    
    // Some responses might have text parts before audio, iterate safely
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          break;
        }
      }
    }
    
    if (base64Audio) {
      const rawBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(rawBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      return true;
    }
    
    console.warn("API responded but no audio bytes found for:", text);
    return false;
  } catch (error: any) {
    console.error(`Gemini TTS Error for "${text}":`, error);
    return false;
  }
};