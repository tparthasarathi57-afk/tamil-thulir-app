import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "./audioUtils";

const API_KEY = process.env.API_KEY || '';

// Singleton AudioContext
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, // Gemini TTS standard output rate
    });
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export const generateSpeech = async (text: string): Promise<void> => {
  if (!API_KEY) {
    console.error("API Key is missing");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Using the TTS model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is usually clear for enunciation
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      const ctx = getAudioContext();
      const rawBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(rawBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    }
  } catch (error) {
    console.error("Error generating speech:", error);
  }
};
