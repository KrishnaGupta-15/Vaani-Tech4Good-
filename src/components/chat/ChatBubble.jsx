import React from 'react';
import { Volume2 } from 'lucide-react';

// Props: 'text' is the message, 'translation' is optional translated text, 'isSender' is true if I sent it, 'highContrast' for theme
function ChatBubble({ text, translation, isSender, highContrast }) {

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to match the language if possible, simple default for now
            // Ideally we would pass the message language as a prop
            utterance.lang = 'hi-IN'; // Defaulting to Hindi/Indian English context for Vaani
            // But let's be smart: if it looks like English (ASCII), use English
            if (/^[A-Za-z0-9\s.,?!]*$/.test(text)) {
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

    const getTranslationStyles = () => {
        if (highContrast) {
            return isSender ? 'border-black text-black' : 'border-yellow-400 text-yellow-200';
        }
        return isSender ? 'border-blue-400 text-blue-100' : 'border-gray-100 text-gray-500';
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
