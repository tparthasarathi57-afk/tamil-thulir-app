import React, { useState } from 'react';
import { TamilLetter } from '../types';
import { generateSpeech } from '../services/geminiService';
import { Loader2, Volume2 } from 'lucide-react';

interface LetterCardProps {
  letter: TamilLetter;
  onClick?: (letter: TamilLetter) => void;
  interactive?: boolean;
}

export const LetterCard: React.FC<LetterCardProps> = ({ letter, onClick, interactive = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!interactive) {
        if(onClick) onClick(letter);
        return;
    }

    if (isLoading) return;

    if (onClick) {
      onClick(letter);
    }
    
    setIsLoading(true);
    // Add a slight descriptive prompt for clearer pronunciation if just a single char
    // "The Tamil letter is ..." helps context, but sometimes just the char is better for raw sound.
    // For Tamil, passing the character directly works well with recent models.
    await generateSpeech(letter.char); 
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`${letter.color} aspect-square rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative group p-4 border-b-8 border-black/10 active:border-b-0 active:translate-y-2`}
      aria-label={`Play sound for ${letter.transliteration}`}
    >
      {isLoading ? (
        <div className="absolute top-4 right-4">
          <Loader2 className="w-6 h-6 animate-spin text-white/80" />
        </div>
      ) : (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Volume2 className="w-6 h-6 text-white/80" />
        </div>
      )}
      
      <span className="text-7xl md:text-8xl font-bold text-white drop-shadow-md">
        {letter.char}
      </span>
      <span className="text-xl md:text-2xl font-semibold text-white/90 mt-2 uppercase tracking-wider">
        {letter.transliteration}
      </span>
    </button>
  );
};
