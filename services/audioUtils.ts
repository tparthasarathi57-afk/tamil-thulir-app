// Utility to decode raw PCM data from Gemini API

// Base64 decoding
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64.replace(/\s/g, '')); // Remove whitespace if any
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert PCM to AudioBuffer
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  // Safety: Ensure byte length is even for Int16Array
  let alignedData = data;
  if (data.byteLength % 2 !== 0) {
    console.warn("Audio data length odd, padding for alignment");
    const newBuffer = new Uint8Array(data.byteLength + 1);
    newBuffer.set(data);
    alignedData = newBuffer;
  }

  // Create Int16 view safely
  const dataInt16 = new Int16Array(
    alignedData.buffer, 
    alignedData.byteOffset, 
    alignedData.byteLength / 2
  );

  const frameCount = dataInt16.length / numChannels;
  
  // Create buffer at the SOURCE sample rate (24k). 
  // The AudioContext (running at 44.1k/48k) will handle resampling automatically during playback.
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}