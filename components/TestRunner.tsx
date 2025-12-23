import React, { useState, useCallback } from 'react';
import { VOWELS, CONSONANTS, SAMPLE_WORDS } from '../constants';
import { TestResult } from '../types';
import { generateSpeech } from '../services/geminiService';
import { Play, ClipboardCheck, AlertCircle, CheckCircle2, Loader2, Bug } from 'lucide-react';

export const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const prepareTests = () => {
    const tests: TestResult[] = [
      ...VOWELS.map(v => ({ id: `v-${v.char}`, name: v.char, category: 'vowel' as const, status: 'pending' as const })),
      ...CONSONANTS.map(c => ({ id: `c-${c.char}`, name: c.char, category: 'consonant' as const, status: 'pending' as const })),
      ...SAMPLE_WORDS.map(s => ({ id: `s-${s.word}`, name: s.word, category: 'sample' as const, status: 'pending' as const })),
    ];
    setResults(tests);
    return tests;
  };

  const runTests = async () => {
    const allTests = prepareTests();
    setIsTesting(true);
    setCurrentIdx(0);

    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i];
      setResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'running' } : t));
      setCurrentIdx(i);

      try {
        // Test both the name/char and the actual speech generation
        const success = await generateSpeech(test.name);
        setResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: success ? 'pass' : 'fail', error: success ? undefined : 'No audio returned' } : t));
      } catch (err: any) {
        setResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'fail', error: err.message || 'Unknown error' } : t));
      }

      // Small delay to simulate human wait and prevent flooding
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsTesting(false);
  };

  const copyReport = () => {
    const report = results.map(r => `${r.category.toUpperCase()} [${r.name}]: ${r.status.toUpperCase()} ${r.error ? `(${r.error})` : ''}`).join('\n');
    const summary = `Total: ${results.length} | Passed: ${results.filter(r => r.status === 'pass').length} | Failed: ${results.filter(r => r.status === 'fail').length}`;
    navigator.clipboard.writeText(`${summary}\n\n${report}`);
    alert("Report copied to clipboard!");
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 max-w-4xl mx-auto mb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-2xl">
            <Bug className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Automated Health Check</h2>
            <p className="text-gray-500 text-sm">Testing every button click for audio functionality</p>
          </div>
        </div>
        
        <button
          onClick={runTests}
          disabled={isTesting}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            isTesting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg active:scale-95'
          }`}
        >
          {isTesting ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isTesting ? 'Testing...' : 'Start Full Test'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between">
            <span className="text-green-700 font-medium">Passed</span>
            <span className="text-2xl font-bold text-green-700">{passCount}</span>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
            <span className="text-red-700 font-medium">Failed</span>
            <span className="text-2xl font-bold text-red-700">{failCount}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
            <span className="text-gray-700 font-medium">Total Items</span>
            <span className="text-2xl font-bold text-gray-700">{results.length}</span>
          </div>
        </div>
      )}

      {isTesting && (
        <div className="mb-6">
           <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / results.length) * 100}%` }}
              />
           </div>
           <p className="text-center text-xs text-gray-400 mt-2">Testing item {currentIdx + 1} of {results.length}</p>
        </div>
      )}

      <div className="max-h-[400px] overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50 p-2 custom-scrollbar">
        {results.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
             Click "Start Full Test" to begin the automated diagnostic.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {results.map((res) => (
              <div key={res.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    res.category === 'vowel' ? 'bg-orange-100 text-orange-600' :
                    res.category === 'consonant' ? 'bg-purple-100 text-purple-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {res.category.toUpperCase()}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{res.name}</span>
                  {res.error && <span className="text-xs text-red-500 font-medium italic">Error: {res.error}</span>}
                </div>
                <div>
                  {res.status === 'pending' && <span className="text-gray-300 text-sm italic">Pending...</span>}
                  {res.status === 'running' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                  {res.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {res.status === 'fail' && <AlertCircle className="w-5 h-5 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {results.length > 0 && !isTesting && (
        <button
          onClick={copyReport}
          className="mt-6 w-full flex items-center justify-center gap-2 p-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 transition-colors shadow-lg"
        >
          <ClipboardCheck className="w-5 h-5" />
          Copy Full Test Report
        </button>
      )}
    </div>
  );
};