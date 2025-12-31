import React from 'react';
import { Volume2 } from 'lucide-react';

// Props: 'text' is the message, 'translation' is optional translated text, 'isSender' is true if I sent it, 'highContrast' for theme, 'languageCode' for TTS
function ChatBubble({ text, translation, isSender, highContrast, languageCode }) {

    // Manage voices state to ensure they are loaded
    const [voices, setVoices] = React.useState([]);

    React.useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) {
                setVoices(available);
                console.log("DEBUG: Voices loaded:", available.length);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const textToSpeak = (translation && !translation.startsWith("Translating")) ? translation : text;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);

            console.log("DEBUG: Speaking...", { textToSpeak, languageCode, voicesCount: voices.length });

            // Ensure we have voices before trying to find one
            if (voices.length === 0) {
                // Try one last fetch
                const freshVoices = window.speechSynthesis.getVoices();
                if (freshVoices.length === 0) {
                    alert("Browser voices are still loading or not available. Please wait a moment and try again.");
                    return;
                }
                setVoices(freshVoices); // sync state
            }

            // Use explicitly passed language code if available
            if (languageCode) {
                utterance.lang = languageCode;

                // Try to explicitly find a matching voice object
                const exactVoice = voices.find(v => v.lang === languageCode || v.lang.replace('_', '-') === languageCode);
                if (exactVoice) {
                    utterance.voice = exactVoice;
                } else {
                    // Fallback: try finding just the base language (e.g. 'ta' from 'ta-IN')
                    const baseLang = languageCode.split('-')[0];
                    const closeVoice = voices.find(v => v.lang.startsWith(baseLang));
                    if (closeVoice) {
                        utterance.voice = closeVoice;
                        utterance.lang = closeVoice.lang;
                    } else {
                        alert(`Voice for ${languageCode} not found on your device. please check your OS settings.`);
                    }
                }
            }
            // Fallback: Auto-detect language based on content
            else if (/[\u0900-\u097F]/.test(textToSpeak)) {
                utterance.lang = 'hi-IN';
            } else if (/[\u0980-\u09FF]/.test(textToSpeak)) {
                utterance.lang = 'bn-IN';
            } else {
                utterance.lang = 'en-US';
            }

            window.speechSynthesis.speak(utterance);
        } else {
            alert("Text-to-Speech not supported in this browser.");
        }
    };

    // Determine styles based on theme and sender
    const getBubbleStyles = () => {
        if (highContrast) {
            // High Contrast Mode (Yellow/Black)
            return isSender
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 rounded-br-none' // Sender
                : 'bg-black text-yellow-400 border-2 border-yellow-400 rounded-bl-none'; // Receiver
        } else {
            // Standard Mode
            return isSender
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none';
        }
    };

    return (
        <div className={`flex w-full mt-4 ${isSender ? 'justify-end' : 'justify-start'}`}>

            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm relative group ${getBubbleStyles()}`}>

                {/* The Message Text */}
                <p className="text-lg leading-relaxed pr-6">
                    {text}
                </p>

                {/* Translation (if available) */}
                {translation && (
                    <div className={`mt-2 pt-2 border-t ${highContrast ? 'border-opacity-30' : ''} ${isSender && highContrast ? 'border-black' : ''} ${!isSender && highContrast ? 'border-yellow-400' : ''} ${!highContrast && isSender ? 'border-blue-400' : ''} ${!highContrast && !isSender ? 'border-gray-100' : ''}`}>
                        <p className={`text-sm italic ${highContrast ? 'opacity-80' : ''} ${!highContrast && isSender ? 'text-blue-100' : ''} ${!highContrast && !isSender ? 'text-gray-500' : ''}`}>
                            {translation}
                        </p>
                    </div>
                )}

                {/* Speaker Icon (Hidden by default, shows on hover or valid for accessibility) */}
                <button
                    onClick={handleSpeak}
                    className={`absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full ${highContrast
                        ? (isSender ? 'text-black hover:bg-black/10' : 'text-yellow-400 hover:bg-yellow-400/20')
                        : (isSender ? 'hover:bg-blue-500 text-blue-100' : 'hover:bg-gray-100 text-gray-400')
                        }`}
                    title="Listen"
                >
                    <Volume2 size={16} />
                </button>

                {/* Tiny label at the bottom */}
                <span className={`text-[10px] absolute bottom-1 ${highContrast
                    ? (isSender ? 'right-3 text-black/60 font-bold' : 'left-3 text-yellow-400/60')
                    : (isSender ? 'right-3 text-blue-200' : 'left-3 text-gray-400')
                    }`}>
                    {isSender ? 'You' : 'Hearing Person'}
                </span>

            </div>

        </div>
    );
}

export default ChatBubble;
