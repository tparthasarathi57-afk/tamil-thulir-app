import { TamilLetter, SampleWord } from './types';

// Uyir Eluthukkal (Vowels)
export const VOWELS: TamilLetter[] = [
  { char: 'அ', transliteration: 'a', color: 'bg-red-400' },
  { char: 'ஆ', transliteration: 'aa', color: 'bg-orange-400' },
  { char: 'இ', transliteration: 'i', color: 'bg-amber-400' },
  { char: 'ஈ', transliteration: 'ee', color: 'bg-yellow-400' },
  { char: 'உ', transliteration: 'u', color: 'bg-lime-400' },
  { char: 'ஊ', transliteration: 'uu', color: 'bg-green-400' },
  { char: 'எ', transliteration: 'e', color: 'bg-emerald-400' },
  { char: 'ஏ', transliteration: 'ae', color: 'bg-teal-400' },
  { char: 'ஐ', transliteration: 'ai', color: 'bg-cyan-400' },
  { char: 'ஒ', transliteration: 'o', color: 'bg-sky-400' },
  { char: 'ஓ', transliteration: 'oo', color: 'bg-blue-400' },
  { char: 'ஔ', transliteration: 'au', color: 'bg-indigo-400' },
  { char: 'ஃ', transliteration: 'ak', color: 'bg-violet-400' },
];

// UyirMei Eluthukkal (Consonants - Base form 'Ka')
export const CONSONANTS: TamilLetter[] = [
  { char: 'க', transliteration: 'ka', color: 'bg-rose-400' },
  { char: 'ங', transliteration: 'nga', color: 'bg-pink-400' },
  { char: 'ச', transliteration: 'cha', color: 'bg-fuchsia-400' },
  { char: 'ஞ', transliteration: 'nja', color: 'bg-purple-400' },
  { char: 'ட', transliteration: 'ta', color: 'bg-violet-400' },
  { char: 'ண', transliteration: 'nna', color: 'bg-indigo-400' },
  { char: 'த', transliteration: 'tha', color: 'bg-blue-400' },
  { char: 'ந', transliteration: 'na', color: 'bg-sky-400' },
  { char: 'ப', transliteration: 'pa', color: 'bg-cyan-400' },
  { char: 'ம', transliteration: 'ma', color: 'bg-teal-400' },
  { char: 'ய', transliteration: 'ya', color: 'bg-emerald-400' },
  { char: 'ர', transliteration: 'ra', color: 'bg-green-400' },
  { char: 'ல', transliteration: 'la', color: 'bg-lime-400' },
  { char: 'வ', transliteration: 'va', color: 'bg-yellow-400' },
  { char: 'ழ', transliteration: 'zha', color: 'bg-amber-400' },
  { char: 'ள', transliteration: 'lla', color: 'bg-orange-400' },
  { char: 'ற', transliteration: 'rra', color: 'bg-red-400' },
  { char: 'ன', transliteration: 'nna', color: 'bg-rose-400' },
];

export const SAMPLE_WORDS: SampleWord[] = [
  { word: 'அம்மா', transliteration: 'Amma', meaning: 'Mother', color: 'bg-red-400' },
  { word: 'ஆடு', transliteration: 'Aadu', meaning: 'Goat', color: 'bg-orange-400' },
  { word: 'இலை', transliteration: 'Ilai', meaning: 'Leaf', color: 'bg-yellow-400' },
  { word: 'ஈ', transliteration: 'Ee', meaning: 'Fly', color: 'bg-lime-400' },
  { word: 'உரல்', transliteration: 'Ural', meaning: 'Mortar', color: 'bg-green-400' },
  { word: 'ஊசி', transliteration: 'Oosi', meaning: 'Needle', color: 'bg-teal-400' },
  { word: 'எலி', transliteration: 'Eli', meaning: 'Rat', color: 'bg-cyan-400' },
  { word: 'ஏணி', transliteration: 'Eni', meaning: 'Ladder', color: 'bg-sky-400' },
  { word: 'ஐவர்', transliteration: 'Ivar', meaning: 'Five People', color: 'bg-blue-400' },
  { word: 'ஒட்டகம்', transliteration: 'Ottagam', meaning: 'Camel', color: 'bg-indigo-400' },
  { word: 'ஓடம்', transliteration: 'Odam', meaning: 'Boat', color: 'bg-violet-400' },
  { word: 'ஔவை', transliteration: 'Avvai', meaning: 'Poet', color: 'bg-fuchsia-400' },
  { word: 'கண்', transliteration: 'Kan', meaning: 'Eye', color: 'bg-pink-400' },
  { word: 'பந்து', transliteration: 'Pandhu', meaning: 'Ball', color: 'bg-rose-400' },
  { word: 'மரம்', transliteration: 'Maram', meaning: 'Tree', color: 'bg-emerald-400' },
  { word: 'வானம்', transliteration: 'Vaanam', meaning: 'Sky', color: 'bg-sky-400' },
];