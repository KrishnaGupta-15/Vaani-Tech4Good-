import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import { getLanguageCode } from '../../utils/languages';

function LiveTranscribe({ isOpen, onClose, currentLanguage, highContrast, onTranscriptUpdate, onError, onStatusChange }) {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const transcriptRef = useRef("");
    const isActuallyListening = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            setTranscript("");
            isActuallyListening.current = false;
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) { }
            }
            return;
        }

        const startRecognition = () => {
            if (isActuallyListening.current) return;

            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

                if (!recognitionRef.current) {
                    recognitionRef.current = new SpeechRecognition();
                    recognitionRef.current.continuous = true;
                    recognitionRef.current.interimResults = true;
                }

                recognitionRef.current.lang = getLanguageCode(currentLanguage);

                recognitionRef.current.onstart = () => {
                    console.log("Speech recognition started");
                    setIsListening(true);
                    isActuallyListening.current = true;
                    if (onStatusChange) onStatusChange("Mic Active");
                };

                recognitionRef.current.onend = () => {
                    console.log("Speech recognition ended.");
                    setIsListening(false);
                    isActuallyListening.current = false;

                    if (isOpen) {
                        if (onStatusChange) onStatusChange("Restarting...");
                        setTimeout(() => {
                            if (isOpen) startRecognition();
                        }, 2000); // 2-second delay to be safe
                    }
                };

                recognitionRef.current.onresult = (event) => {
                    if (onStatusChange) onStatusChange("Sound Detected...");

                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        transcriptRef.current = (transcriptRef.current + " " + finalTranscript).slice(-300);
                        setTranscript(transcriptRef.current);
                        if (onTranscriptUpdate) onTranscriptUpdate(transcriptRef.current);
                    } else if (interimTranscript) {
                        const tempText = (transcriptRef.current + " " + interimTranscript).slice(-300);
                        if (onTranscriptUpdate) onTranscriptUpdate(tempText);
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    console.error("Speech Recognition Error:", event.error);
                    let msg = event.error;
                    if (event.error === 'aborted') {
                        msg = "Mic aborted. Close other tabs for this app.";
                    } else if (event.error === 'not-allowed') {
                        msg = "Permission denied.";
                    }

                    if (onError) onError(msg);
                    if (onStatusChange) onStatusChange("Error: " + event.error);

                    if (event.error === 'not-allowed') {
                        isActuallyListening.current = true; // Block restart for permission issues
                    }
                };

                if (onStatusChange) onStatusChange("Requesting Mic...");
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Immediate start fail", e);
                    if (onStatusChange) onStatusChange("Start Failed");
                }
            } else {
                if (onStatusChange) onStatusChange("Browser Not Supported");
            }
        };

        startRecognition();

        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) { }
            }
            isActuallyListening.current = false;
        };
    }, [isOpen, currentLanguage]);

    if (!isOpen) return null;

    // Theme Configuration
    const theme = highContrast ? {
        bg: 'bg-black',
        text: 'text-yellow-400',
        subtext: 'text-yellow-400/60',
        border: 'border-yellow-400/30',
        icon: 'text-yellow-400',
        pulse: 'bg-yellow-400'
    } : {
        bg: 'bg-slate-900', // Futurist Dark Blue/Black
        text: 'text-cyan-400', // Neon Cyan
        subtext: 'text-cyan-400/60',
        border: 'border-cyan-400/30',
        icon: 'text-cyan-400',
        pulse: 'bg-cyan-400'
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${theme.bg}`}>

            {/* Minimalist Header */}
            <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center ${highContrast ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${isListening ? `animate-pulse ${theme.pulse}` : 'bg-gray-600'}`}></div>
                    <span className={`text-sm uppercase tracking-[0.2em] font-medium ${theme.subtext}`}>
                        Live Captioning
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${theme.border} ${theme.subtext}`}>
                        {currentLanguage}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${theme.icon}`}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Central Transcript */}
            <div className="flex-1 w-full max-w-4xl flex items-center justify-center text-center p-4">
                <p className={`text-3xl md:text-5xl font-light leading-relaxed tracking-wide transition-all ${theme.text} ${isListening ? 'opacity-100' : 'opacity-50'}`}>
                    {transcript || "Listening..."}
                </p>
            </div>

            {/* Futuristic Footer */}
            <div className={`absolute bottom-8 text-xs tracking-widest uppercase opacity-40 ${theme.text}`}>
                Vaani AI • Real-time Transcription
            </div>

        </div>
    );
}

export default LiveTranscribe;
