import React from 'react';
import { Phone, Settings } from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';

function Header({ currentLanguage, onLanguageChange, onToggleCallMode, onOpenSettings, highContrast, onLogoClick }) {
    return (
        <div className={`border-b p-4 flex justify-between items-center shadow-sm sticky top-0 z-10 transition-colors duration-300 ${highContrast ? 'bg-black border-yellow-400/30' : 'bg-white border-gray-200'
            }`}>

            {/* Logo Area */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-all ${highContrast
                    ? 'bg-black border border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                    : 'bg-blue-600 text-white'
                    }`}>
                    V
                </div>
                <div>
                    <h1 className={`text-xl font-bold tracking-tight ${highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Vaani</h1>
                    <p className={`text-xs font-medium flex items-center gap-1 ${highContrast ? 'text-green-400' : 'text-green-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${highContrast ? 'bg-green-400 animate-pulse' : 'bg-green-600'}`}></span>
                        Online
                    </p>
                </div>
            </div>

            {/* Right Side: Call Mode & Language */}
            <div className="flex items-center gap-2">
                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className={`p-2 rounded-full transition-colors mr-1 ${highContrast ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    title="Accessibility Settings"
                >
                    <Settings size={20} />
                </button>

                {/* Call Mode Button */}
                <button
                    onClick={onToggleCallMode}
                    className={`p-2 rounded-full transition-colors ${highContrast
                        ? 'bg-black border border-green-400 text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    title="Start Live Captioning (Call Mode)"
                >
                    <Phone size={20} />
                </button>

                {/* Language Selector */}
                <select
                    value={currentLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className={`py-2 px-4 rounded-lg text-sm border-none focus:ring-2 outline-none max-w-[150px] transition-all ${highContrast
                        ? 'bg-black text-yellow-400 border border-yellow-400/50 focus:ring-yellow-400 focus:shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                        : 'bg-gray-100 text-gray-700 focus:ring-blue-500'
                        }`}
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                            {lang.name} ({lang.native})
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
}

export default Header;
