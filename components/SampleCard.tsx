import React, { useState } from 'react';
import { SampleWord } from '../types';
import { generateSpeech } from '../services/geminiService';
import { Loader2, Volume2 } from 'lucide-react';

interface SampleCardProps {
  sample: SampleWord;
}

export const SampleCard: React.FC<SampleCardProps> = ({ sample }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // Passing just the Tamil word works well for pronunciation
    await generateSpeech(sample.word);
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`${sample.color} w-full aspect-[4/3] rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center relative group p-4 md:p-6 border-b-8 border-black/10 active:border-b-0 active:translate-y-2`}
      aria-label={`Play sound for ${sample.transliteration}`}
    >
      {isLoading ? (
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-white/80" />
        </div>
      ) : (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-1 md:gap-2 w-full">
        <span className="text-4xl md:text-6xl font-bold text-white drop-shadow-md text-center leading-tight">
            {sample.word}
        </span>
        <div className="flex flex-col items-center mt-2">
            <span className="text-lg md:text-xl font-bold text-white/90 uppercase tracking-wider">
                {sample.transliteration}
            </span>
            <span className="text-sm md:text-base text-white/90 font-medium bg-black/10 px-3 py-1 rounded-full mt-1">
                {sample.meaning}
            </span>
        </div>
      </div>
    </button>
  );
};