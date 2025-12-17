import React, { useState } from 'react';
import { VOWELS, CONSONANTS, SAMPLE_WORDS } from './constants';
import { AppMode } from './types';
import { LetterCard } from './components/LetterCard';
import { SampleCard } from './components/SampleCard';
import { Navigation } from './components/Navigation';
import { QuizMode } from './components/QuizMode';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-4">
             <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-75"></div>
                <h1 className="text-6xl md:text-8xl font-black text-gray-800 drop-shadow-sm mb-2 relative z-10">
                  தமிழ் துளிர்
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium">Tamil Thulir</p>
             </div>
             
             <p className="text-xl md:text-2xl max-w-md text-gray-700 leading-relaxed">
               Welcome kids! Let's learn the beautiful Tamil language with fun sounds and colors.
             </p>
             
             <div className="flex flex-col gap-4 mt-8 w-full max-w-md">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setMode(AppMode.LEARN_VOWELS)}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xl md:text-2xl font-bold"
                  >
                    Vowels
                    <span className="block text-sm font-normal opacity-90 mt-1">Uyir</span>
                  </button>
                  <button 
                    onClick={() => setMode(AppMode.LEARN_CONSONANTS)}
                    className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xl md:text-2xl font-bold"
                  >
                    Consonants
                    <span className="block text-sm font-normal opacity-90 mt-1">Mei</span>
                  </button>
                </div>
                <button 
                  onClick={() => setMode(AppMode.SAMPLES)}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xl md:text-2xl font-bold flex items-center justify-center gap-2"
                >
                  Learn Words
                  <span className="text-3xl">🌟</span>
                </button>
             </div>
          </div>
        );
      
      case AppMode.LEARN_VOWELS:
        return (
          <div className="space-y-6 pb-24">
            <header className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">🍊</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Uyir Eluthukkal</h2>
                <p className="text-gray-500">Tap a card to hear the sound!</p>
              </div>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {VOWELS.map((letter) => (
                <LetterCard key={letter.char} letter={letter} />
              ))}
            </div>
          </div>
        );

      case AppMode.LEARN_CONSONANTS:
        return (
          <div className="space-y-6 pb-24">
             <header className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">🍇</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Mei Eluthukkal</h2>
                <p className="text-gray-500">Learn Ka, Nga, Cha!</p>
              </div>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {CONSONANTS.map((letter) => (
                <LetterCard key={letter.char} letter={letter} />
              ))}
            </div>
          </div>
        );

      case AppMode.SAMPLES:
        return (
          <div className="space-y-6 pb-24">
             <header className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl">🐘</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Vocabulary</h2>
                <p className="text-gray-500">Learn easy Tamil words!</p>
              </div>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {SAMPLE_WORDS.map((sample) => (
                <SampleCard key={sample.word} sample={sample} />
              ))}
            </div>
          </div>
        );

      case AppMode.QUIZ:
        return (
          <div className="pb-24 w-full h-full">
            <header className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Fun Quiz Time!</h2>
              <p className="text-gray-500">Listen and find the letter</p>
            </header>
            <QuizMode />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFbeb] selection:bg-orange-200">
      {/* Background Blobs for Visual Interest */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="blob bg-yellow-300 w-96 h-96 rounded-full top-0 left-[-100px] opacity-30 mix-blend-multiply"></div>
        <div className="blob bg-blue-300 w-96 h-96 rounded-full bottom-0 right-[-100px] opacity-30 mix-blend-multiply"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {renderContent()}
      </main>

      <Navigation currentMode={mode} setMode={setMode} />
    </div>
  );
};

export default App;