
import React, { useState , useEffect} from 'react';
import Header from './components/layout/Header';
import ChatBubble from './components/chat/ChatBubble';
import ChatInput from './components/chat/ChatInput';
import LiveTranscribe from './components/features/LiveTranscribe';
import SettingsDrawer from './components/layout/SettingsDrawer';
import LandingPage from './components/layout/LandingPage';
import LoginForm from './components/AuthForm/LoginForm';


function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showCallMode, setShowCallMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);



// check
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:4000/api/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => console.log(data));
}, []);
//check end

  // Accessibility State
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large, xl
  const [highContrast, setHighContrast] = useState(true); // Default to Dark/High Contrast for accessibility

  // Dynamic Styles based on settings
  const getAppStyles = () => {
    let base = "h-screen flex flex-col transition-colors duration-300 ";
    if (highContrast) {
      base += "bg-black text-yellow-400";
    } else {
      base += "bg-gray-50 text-gray-800";
    }

    // Font Size Mapping
    const sizeMap = {
      'small': 'text-sm',
      'medium': 'text-base',
      'large': 'text-lg',
      'xl': 'text-xl'
    };

    return `${base} ${sizeMap[fontSize]}`;
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", isSender: false },
    { id: 2, text: "Hello! I am deaf. This app converts my text to speech.", isSender: true },
  ]);

  const handleSendMessage = (text) => {
    // 1. Add User Message
    const newMessage = {
      id: Date.now(),
      text: text,
      isSender: true,
      // Mock Translation logic for demo
      translation: language === 'Hindi' ? "Translating to Hindi..." : null
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  if (showLogin) {
    return (
      <LoginForm
        onBack={() => {
          setShowLogin(false);
          setShowLanding(true);
        }}
        onLoginSuccess={() => {
          setShowLogin(false);
          setShowLanding(false);
        }}
      />
    );
  }

  if (showLanding) {
    return (
      <LandingPage
        onGetStarted={() => setShowLanding(false)}
        onLoginClick={() => {
          setShowLanding(false);
          setShowLogin(true);
        }}
      />
    );
  }

  return (
    <div className={getAppStyles()}>

      {/* Accessibility Settings Drawer */}
      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Live Captioning Overlay */}
      <LiveTranscribe
        isOpen={showCallMode}
        onClose={() => setShowCallMode(false)}
        currentLanguage={language}
        highContrast={highContrast}
      />

      {/* 1. Put the Header at the top */}
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        onToggleCallMode={() => setShowCallMode(true)}
        onOpenSettings={() => setShowSettings(true)}
        highContrast={highContrast} // Pass theme
        onLogoClick={() => {
          setShowLanding(true);
          setShowLogin(false);
        }}
      />

      {/* 2. The Chat Area (Middle) */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${highContrast ? 'bg-black' : ''}`}>

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            translation={msg.translation}
            isSender={msg.isSender}
            highContrast={highContrast} // Pass theme
          />
        ))}

      </div>

      {/* 3. The Input Area (Bottom) */}
      <ChatInput
        currentLanguage={language}
        onSendMessage={handleSendMessage}
        highContrast={highContrast} // Pass theme
      />
    </div>
  );
}

export default App;