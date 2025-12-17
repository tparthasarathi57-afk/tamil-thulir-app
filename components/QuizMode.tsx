import React, { useState, useEffect, useCallback } from 'react';
import { TamilLetter, QuizState } from '../types';
import { VOWELS, CONSONANTS } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { Volume2, RefreshCw, Star, CheckCircle2, XCircle } from 'lucide-react';

export const QuizMode: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>({
    currentQuestion: null,
    options: [],
    score: 0,
    totalQuestions: 0,
    isCorrect: null,
  });

  const [loadingAudio, setLoadingAudio] = useState(false);

  // Combine letters
  const allLetters = [...VOWELS, ...CONSONANTS];

  const playQuestionAudio = async (letter: TamilLetter) => {
    setLoadingAudio(true);
    try {
      // "Identify the letter..." helps contextualize for the model to speak clearly
      await generateSpeech(`Identify the letter ${letter.char}`);
    } catch (e: any) {
      console.error(e);
      // Only alert once to avoid spamming on load
    } finally {
      setLoadingAudio(false);
    }
  };

  const generateQuestion = useCallback(() => {
    // Pick a random letter
    const target = allLetters[Math.floor(Math.random() * allLetters.length)];
    
    // Pick 2 wrong options distinct from target
    const wrongOptions: TamilLetter[] = [];
    while (wrongOptions.length < 2) {
      const r = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (r.char !== target.char && !wrongOptions.find(o => o.char === r.char)) {
        wrongOptions.push(r);
      }
    }

    // Shuffle options
    const options = [target, ...wrongOptions].sort(() => Math.random() - 0.5);

    setGameState(prev => ({
      ...prev,
      currentQuestion: target,
      options,
      isCorrect: null,
    }));

    // Auto play sound for the question
    // We need a small timeout to allow UI to render first
    setTimeout(() => {
        playQuestionAudio(target);
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);


  const handleOptionClick = async (selected: TamilLetter) => {
    if (gameState.isCorrect !== null) return; // Prevent clicking after answer

    const isCorrect = selected.char === gameState.currentQuestion?.char;
    
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1,
      isCorrect: isCorrect
    }));

    try {
      if (isCorrect) {
         await generateSpeech("Correct! Very good.");
      } else {
         await generateSpeech(`Oops. That was ${selected.transliteration}. Try again.`);
      }
    } catch (e) {
      console.error("Audio failed", e);
    }

    // Next question after delay
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  if (!gameState.currentQuestion) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-4">
      <div className="flex items-center gap-4 bg-white/50 px-6 py-2 rounded-full shadow-sm">
        <Star className="text-yellow-500 fill-yellow-500" />
        <span className="text-2xl font-bold text-gray-700">
          Score: {gameState.score}
        </span>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Which letter is this?</h2>
        <button 
          onClick={() => gameState.currentQuestion && playQuestionAudio(gameState.currentQuestion)}
          className={`p-6 rounded-full bg-blue-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-all ${loadingAudio ? 'opacity-70' : ''}`}
        >
          {loadingAudio ? <RefreshCw className="animate-spin w-12 h-12" /> : <Volume2 className="w-12 h-12" />}
        </button>
        <p className="text-gray-500 text-sm">Click to hear again</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl">
        {gameState.options.map((option, idx) => {
          let stateStyles = "";
          if (gameState.isCorrect !== null) {
             if (option.char === gameState.currentQuestion?.char) {
                stateStyles = "ring-4 ring-green-500 scale-105 opacity-100";
             } else if (option === gameState.options.find(o => o.char !== gameState.currentQuestion?.char)) {
                // Dim wrong answers
                stateStyles = "opacity-50 scale-95"; 
             }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`${option.color} aspect-square rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 relative ${stateStyles} hover:scale-105 active:scale-95`}
            >
              <span className="text-5xl md:text-7xl font-bold text-white">
                {option.char}
              </span>
              {gameState.isCorrect !== null && option.char === gameState.currentQuestion?.char && (
                 <div className="absolute -top-3 -right-3 bg-white rounded-full p-1">
                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                 </div>
              )}
               {gameState.isCorrect === false && gameState.isCorrect !== null && option.char !== gameState.currentQuestion?.char && stateStyles.includes('opacity-50') && ( // This logic is simplified for visual clarity
                 <div className="hidden"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {gameState.isCorrect !== null && (
        <div className={`text-2xl font-bold animate-bounce ${gameState.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {gameState.isCorrect ? "Awesome!" : "Keep Trying!"}
        </div>
      )}
    </div>
  );
};