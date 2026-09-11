import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2 } from 'lucide-react';

// Simplified type for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export const MasteryReciterStudio: React.FC<{ ayahText: string }> = ({ ayahText }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedWords, setRecognizedWords] = useState<string[]>([]);
  const [highlightedWords, setHighlightedWords] = useState<{text: string, isMatch: boolean}[]>(
    ayahText.split(' ').map(text => ({ text, isMatch: false }))
  );
  const recognition = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  const updateHighlights = (recognizedWordsArr: string[]) => {
    const ayahWords = ayahText.split(/\s+/);
    const highlighted = ayahWords.map((word) => {
      const cleanWord = word.replace(/[^\u0621-\u064A]/g, '').toLowerCase();
      const match = recognizedWordsArr.some((rec) => rec.toLowerCase().includes(cleanWord) || cleanWord.includes(rec.toLowerCase()));

      return {
        text: word,
        isMatch: match
      };
    });
    setHighlightedWords(highlighted);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'ar-SA';
      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results as SpeechRecognitionResultList)
          .map((result: SpeechRecognitionResult) => result[0].transcript)
          .join(' ');
        const words = transcript.split(/\s+/);
        setRecognizedWords(words);
        updateHighlights(words);
      };
    }
  }, [ayahText]);

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
      navigate('/review', { state: { ayahText, recognizedWords } });
    } else {
      recognition.current?.start();
      setIsListening(true);
      setRecognizedWords([]);
    }
  };

  const words = ayahText.split(' ');

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-3xl border border-[#D4AF37]/30 shadow-2xl">
      <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 text-center">Mastery Reciter Studio</h2>
      
      <div className="text-center mb-8 p-4 bg-black rounded-2xl border border-white/10">
        <p className="text-3xl leading-relaxed">
          {highlightedWords.map((item, i) => (
            <span key={i} className={`mr-2 ${item.isMatch ? 'text-[#D4AF37]' : 'text-red-700'}`}>
              {item.text}
            </span>
          ))}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={toggleListening}
          className={`p-6 rounded-full ${isListening ? 'bg-red-600' : 'bg-[#D4AF37]'} transition-all hover:scale-105`}
        >
          {isListening ? <Square size={32} color="white" /> : <Mic size={32} color="black" />}
        </button>
      </div>
    </div>
  );
};
