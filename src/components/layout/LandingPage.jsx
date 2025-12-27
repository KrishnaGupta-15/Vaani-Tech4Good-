import React from 'react';
import { ArrowRight, Mic, Volume2, Phone } from 'lucide-react';

function LandingPage({ onGetStarted, onLoginClick }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar Placeholder */}
            <nav className="p-6 flex justify-between items-center z-50 relative">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold">V</div>
                    Vaani
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLoginClick}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </button>
                    <div className="text-sm text-gray-400">v1.0.0</div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10 mt-[-50px]">

                {/* Badge */}
                <div className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest uppercase text-blue-300 backdrop-blur-sm">
                    AI-Powered Accessibility
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-600 bg-clip-text text-transparent">
                    Voice for the <br /> Voiceless.
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
                    Bridge the communication gap with real-time Speech-to-Text,
                    Text-to-Speech, and Live Call Translation.
                    Designed for everyone.
                </p>

                {/* CTA Button */}
                <button
                    onClick={onGetStarted}
                    className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 flex items-center gap-2"
                >
                    Get Started
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Feature Grid (floating below) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl px-4">
                    <FeatureCard
                        icon={<Mic size={24} className="text-blue-400" />}
                        title="Speech to Text"
                        desc="Instant conversion of spoken language into clear, readable text."
                    />
                    <FeatureCard
                        icon={<Volume2 size={24} className="text-purple-400" />}
                        title="Text to Speech"
                        desc="Type your thoughts and let Vaani speak them out loud naturally."
                    />
                    <FeatureCard
                        icon={<Phone size={24} className="text-green-400" />}
                        title="Live Captioning"
                        desc="Real-time transcription for phone calls and daily conversations."
                    />
                </div>

            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-gray-600 text-xs">
                &copy; 2025 Vaani Accessibility Project. Built for SIH.
            </footer>
        </div>
    );
}

// Simple internal component for feature cards
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left backdrop-blur-sm">
            <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
            <h3 className="text-lg font-bold mb-2 text-gray-200">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

export default LandingPage;
