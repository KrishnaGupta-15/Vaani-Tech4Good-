import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, AlertCircle } from 'lucide-react';
import { getLanguageCode } from '../../utils/languages';
import {sendToGemini} from "../../utils/geminiClient";
function ChatInput({ currentLanguage, onSendMessage, highContrast }) {
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            // IMPORTANT: continuous = true allows it to keep listening
            recognitionRef.current.continuous = true;

            // IMPORTANT: interimResults = true allows seeing text AS you speak
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    setError("Microphone permission denied. Please allow access.");
                } else if (event.error === 'no-speech') {
                    // Ignore no-speech errors, just a pause
                } else {
                    setError("Error listening. Please try again.");
                }
            };

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // We only append final results to the input to avoid duplication issues in this simple implementation
                // But we could show interim in a separate UI if needed. 
                // For now, let's just make sure we capture final properly.
                if (finalTranscript) {
                    setInputValue(prev => prev + (prev ? " " : "") + finalTranscript);
                }
            };
        } else {
            setError("Speech Recognition not supported in this browser.");
        }
    }, []);

    // Update language dynamically
    useEffect(() => {
        const langCode = getLanguageCode(currentLanguage);
        if (recognitionRef.current && isListening) {
            // If language changes while listening, restart
            recognitionRef.current.stop();
            setTimeout(() => {
                recognitionRef.current.lang = langCode;
                recognitionRef.current.start();
            }, 100);
        } else if (recognitionRef.current) {
            recognitionRef.current.lang = langCode;
        }
    }, [currentLanguage]);

    // const handleSend = () => {
    //     if (inputValue.trim()) {
    //         if (onSendMessage) {
    //             onSendMessage(inputValue);
    //         }
    //         setInputValue("");
    //     }
    // };
    
    const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");

    
    if (onSendMessage) {
        onSendMessage(userText);
    }

    try {
        
        const geminiReply = await sendToGemini(userText);

    
        if (onSendMessage) {
            onSendMessage(geminiReply, false); 
        }
    } catch (err) {
        console.error("Gemini failed", err);
    }
};


    const toggleMic = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setError(null);
            recognitionRef.current.start();
        }
    };

    return (
        <div className={`border-t p-4 sticky bottom-0 transition-colors ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>

            {/* Error Message */}
            {error && (
                <div className="max-w-4xl mx-auto mb-2 text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} />
                    {error}
                </div>
            )}

            <div className="max-w-4xl mx-auto flex items-center gap-3">

                {/* Text Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder={`Type or Speak in ${currentLanguage}...`}
                        className={`w-full rounded-full py-3 px-6 focus:outline-none focus:ring-2 transition-all font-medium ${highContrast
                            ? 'bg-black text-yellow-400 placeholder-yellow-400/50 focus:ring-yellow-400 border border-yellow-400/30'
                            : 'bg-gray-100 text-gray-800 focus:ring-blue-500'
                            }`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                </div>

                {/* Microphone Button */}
                <button
                    onClick={toggleMic}
                    className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${isListening
                        ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                        : (highContrast
                            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-400/30'
                            : 'bg-blue-600 text-white hover:bg-blue-700')
                        }`}
                    title={error || "Speak now"}
                >
                    <Mic size={24} />
                </button>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={`p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${highContrast
                            ? 'text-yellow-400 hover:bg-gray-800'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                    title="Send"
                >
                    <Send size={24} />
                </button>

            </div>
        </div>
    );
}

export default ChatInput;
