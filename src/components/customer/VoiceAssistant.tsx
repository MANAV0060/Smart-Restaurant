import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Languages, X } from 'lucide-react';

interface VoiceAssistantProps {
  onSpeechResult: (text: string) => void;
  activeLanguage: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onSpeechResult,
  activeLanguage,
  onLanguageChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Set language code
    if (activeLanguage === 'hi') recognition.lang = 'hi-IN';
    else if (activeLanguage === 'mr') recognition.lang = 'mr-IN';
    else recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening for food order...');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      if (event.results[current].isFinal) {
        setIsListening(false);
        onSpeechResult(text);
        speakFeedback(`Searching menu for ${text}`);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript('Could not capture audio. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speakFeedback = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative inline-block font-sans">
      <div className="flex items-center gap-1 bg-[#14171f] border border-white/[0.08] rounded-lg p-1">
        {/* Language selector toggle */}
        <div className="flex items-center text-xs font-semibold px-2 py-0.5 text-slate-300 gap-1 border-r border-white/[0.08]">
          <Languages className="w-3.5 h-3.5 text-amber-400" />
          <select 
            value={activeLanguage}
            onChange={(e) => onLanguageChange(e.target.value as any)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-bold"
          >
            <option value="en" className="bg-[#14171f] text-white">EN</option>
            <option value="hi" className="bg-[#14171f] text-white">हिंदी</option>
            <option value="mr" className="bg-[#14171f] text-white">मराठी</option>
          </select>
        </div>

        {/* Mic Action Button */}
        <button
          onClick={toggleListening}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
            isListening 
              ? 'bg-rose-600 text-white' 
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
          }`}
          title="Voice Search"
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Voice Transcript Popup Card */}
      {isListening && (
        <div className="absolute right-0 top-11 z-50 w-72 p-3 bg-[#14171f] border border-amber-500/40 rounded-lg shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Voice Order Assistant
            </span>
            <button onClick={() => setIsListening(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
};
