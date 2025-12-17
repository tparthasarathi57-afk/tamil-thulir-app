import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "./audioUtils";

const API_KEY = process.env.API_KEY || '';

// Singleton AudioContext
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    // Do not force sampleRate here; let the browser/OS decide.
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export const generateSpeech = async (text: string): Promise<void> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ctx = getAudioContext();
  
  // Critical: Resume audio context inside the user interaction handler
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      const rawBytes = decodeBase64(base64Audio);
      // Gemini TTS usually returns 24kHz
      const audioBuffer = await decodeAudioData(rawBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } else {
      console.warn("Gemini returned no audio data for text:", text);
    }
  } catch (error: any) {
    console.error("Error generating speech for:", text, error);
    
    const msg = error?.message || JSON.stringify(error);
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
        alert("Daily learning limit reached! Please try again tomorrow.");
    } else if (msg.includes("API Key")) {
        alert("API Key is invalid or missing.");
    } else {
        console.warn("Speech generation failed:", msg);
    }
  }
};