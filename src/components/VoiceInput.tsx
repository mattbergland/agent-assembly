"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
}

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function VoiceInput({
  value,
  onChange,
  placeholder,
  label,
}: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const supported = isSpeechSupported();
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(valueRef.current ? `${valueRef.current} ${transcript}` : transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  }, [listening, onChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-lavender/40 resize-none pr-16 transition-all"
        />
        {supported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-3 top-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-wide transition-all active:scale-90 ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-lavender/10 text-lavender hover:bg-lavender/20"
            }`}
            title={listening ? "Stop recording" : "Start voice input"}
          >
            {listening ? "Stop" : "Mic"}
          </button>
        )}
      </div>
      {listening && (
        <p className="text-xs text-lavender animate-pulse font-light">
          Listening... speak now
        </p>
      )}
    </div>
  );
}
