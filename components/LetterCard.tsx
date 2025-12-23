import React, { useState } from 'react';
import { TamilLetter } from '../types';
import { generateSpeech } from '../services/geminiService';
import { Loader2, Volume2, AlertCircle } from 'lucide-react';

interface LetterCardProps {
  letter: TamilLetter;
  onClick?: (letter: TamilLetter) => void;
  interactive?: boolean;
}

export const LetterCard: React.FC<LetterCardProps> = ({ letter, onClick, interactive = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setHasError(false);

    if (onClick) {
      onClick(letter);
    }
    
    if (!interactive) return;

    setIsLoading(true);
    try {
      const success = await generateSpeech(letter.char);
      if (!success) {
        setHasError(true);
        console.warn(`Audio playback failed for letter: ${letter.char}`);
      }
    } catch (err) {
      console.error("Audio interaction error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${letter.color} aspect-square rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative group p-4 border-b-8 border-black/10 active:border-b-0 active:translate-y-2 disabled:cursor-wait`}
      aria-label={`Play sound for ${letter.transliteration}`}
    >
      <div className="absolute top-4 right-4">
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-white/80" />
        ) : hasError ? (
          <AlertCircle className="w-6 h-6 text-red-100 animate-pulse" />
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Volume2 className="w-6 h-6 text-white/80" />
          </div>
        )}
      </div>
      
      <span className="text-7xl md:text-8xl font-bold text-white drop-shadow-md">
        {letter.char}
      </span>
      <span className="text-xl md:text-2xl font-semibold text-white/90 mt-2 uppercase tracking-wider">
        {letter.transliteration}
      </span>
      
      {hasError && (
        <span className="absolute bottom-3 text-[10px] font-bold text-white/70 uppercase">
          Speaker Error
        </span>
      )}
    </button>
  );
};