import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Languages, X } from 'lucide-react';

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
      alert('Speech Recognition is not supported in this browser window. Please use Chrome/Edge.');
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
      setTranscript('Listening for your order...');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      if (event.results[current].isFinal) {
        setIsListening(false);
        onSpeechResult(text);
        speakFeedback(`Got it! Searching for ${text}`);
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
    <div className="relative inline-block">
      <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-full p-1 shadow-lg">
        {/* Language selector toggle */}
        <div className="flex items-center text-xs font-semibold px-2 py-1 text-slate-300 gap-1 border-r border-slate-800">
          <Languages className="w-3.5 h-3.5 text-orange-400" />
          <select 
            value={activeLanguage}
            onChange={(e) => onLanguageChange(e.target.value as any)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-bold"
          >
            <option value="en" className="bg-slate-900 text-white">EN</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
            <option value="mr" className="bg-slate-900 text-white">मराठी</option>
          </select>
        </div>

        {/* Mic Action Button */}
        <button
          onClick={toggleListening}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' 
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
          }`}
          title="Voice Order Assistant"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice Transcript Popup Card */}
      {isListening && (
        <div className="absolute right-0 top-12 z-50 w-72 p-3 bg-slate-900 border border-orange-500/50 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-orange-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Voice Order Assistant
            </span>
            <button onClick={() => setIsListening(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 italic font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
};
