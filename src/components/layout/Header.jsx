import React, { useState, useContext } from 'react';
import { Phone, Settings, Copy, PhoneForwarded } from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';
import { SocketContext } from '../../Context/SocketContext';
import { auth } from '../../firebase';

function Header({ currentLanguage, onLanguageChange, onToggleCallMode, onOpenSettings, highContrast, onLogoClick, user }) {
    const { me, callUser, name, setName, isSocketConnected } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const [showCallMenu, setShowCallMenu] = useState(false);

    const copyId = () => {
        navigator.clipboard.writeText(me);
        alert("ID Copied: " + me);
    };

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
                    {/* Socket Status */}
                    <p className={`text-[10px] font-medium ${isSocketConnected ? (highContrast ? 'text-green-400' : 'text-green-600') : 'text-red-500'}`}>
                        {isSocketConnected ? "Server Connected" : "Connecting..."}
                    </p>
                </div>
            </div>

            {/* Right Side: Call Mode & Language */}
            <div className="flex items-center gap-2">

                {/* CALL MENU POPUP */}
                {showCallMenu && (
                    <div className="absolute top-16 right-20 z-50 p-4 rounded-xl shadow-2xl border bg-slate-900 border-white/20 text-white w-72 animate-in fade-in zoom-in">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-cyan-400">Secure Voice Line</h3>

                        {/* Copy ID */}
                        <div className="mb-4">
                            <label className="text-xs text-gray-400 mb-1 block">Your Secure ID</label>
                            <div className="flex gap-2">
                                <input readOnly value={me} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-mono text-gray-300" />
                                <button onClick={copyId} className="p-1 hover:text-cyan-400"><Copy size={14} /></button>
                            </div>
                        </div>

                        {/* Call Input */}
                        <div className="mb-4">
                            <label className="text-xs text-gray-400 mb-1 block">Call Remote ID</label>
                            <div className="flex gap-2">
                                <input
                                    value={idToCall}
                                    onChange={(e) => setIdToCall(e.target.value)}
                                    placeholder="Paste ID here..."
                                    className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white focus:border-cyan-400 outline-none"
                                />
                                <button
                                    onClick={() => callUser(idToCall)}
                                    className={`p-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white ${!idToCall && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <PhoneForwarded size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Name Input (Optional) */}
                        <div className="mb-2">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name (Optional)"
                                className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-xs text-center focus:border-cyan-400 outline-none"
                            />
                        </div>

                    </div>
                )}

                {/* User Avatar & Logout */}
                {user && (
                    <div className="flex items-center gap-2 mr-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${highContrast
                                ? 'bg-yellow-400 text-black'
                                : 'bg-blue-600 text-white'
                                }`}
                            title={user.email}
                        >
                            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <button
                            onClick={() => auth.signOut()}
                            className="text-xs px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className={`p-2 rounded-full transition-colors mr-1 ${highContrast ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    title="Accessibility Settings"
                >
                    <Settings size={20} />
                </button>

                {/* NEW CALL BUTTON */}
                <button
                    onClick={() => setShowCallMenu(!showCallMenu)}
                    className={`p-2 rounded-full transition-colors ${highContrast
                        ? 'bg-black border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                        : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                        }`}
                    title="Open Secure Line"
                >
                    <Phone size={20} />
                </button>

                {/* Old Call Mode Button (Local Transcribe) */}
                <button
                    onClick={onToggleCallMode}
                    className={`hidden md:block p-2 rounded-full transition-colors ${highContrast
                        ? 'bg-black border border-green-400 text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    title="Local Transcription Mode"
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
