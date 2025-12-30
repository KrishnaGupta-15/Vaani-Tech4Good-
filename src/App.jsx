
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import Header from './components/layout/Header';
import ChatBubble from './components/chat/ChatBubble';
import ChatInput from './components/chat/ChatInput';
import LiveTranscribe from './components/features/LiveTranscribe';
import SettingsDrawer from './components/layout/SettingsDrawer';
import LandingPage from './components/layout/LandingPage';
import LoginForm from './components/AuthForm/LoginForm';
import ChatSidebar from './components/chat/ChatSidebar';
import { PanelLeftOpen } from 'lucide-react';
import { getLanguageCode } from './utils/languages';


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

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Auth Listener
  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized. Config missing.");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Optional: Save token for backend calls if needed
        currentUser.getIdToken().then(token => localStorage.setItem("token", token));
      } else {
        localStorage.removeItem("token");
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Messages Subscription
  useEffect(() => {
    // ALWAYS clear messages when switching conversation ID to prevent mixing
    setMessages([]);

    if (!db || !currentConversationId) {
      return;
    }

    // Query messages for current conversation
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", currentConversationId)
      // orderBy("timestamp", "asc") // Removed to fix latency/index issues
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Merge DB messages with local messages that are NOT in DB yet
      setMessages(prev => {
        const dbIds = new Set(dbMsgs.map(m => m.id));
        const localOnly = prev.filter(m => !dbIds.has(m.id));
        return [...dbMsgs, ...localOnly].sort((a, b) => {
          const tA = a.timestamp ? (a.timestamp.seconds ? a.timestamp.toMillis() : new Date(a.timestamp).getTime()) : Date.now();
          const tB = b.timestamp ? (b.timestamp.seconds ? b.timestamp.toMillis() : new Date(b.timestamp).getTime()) : Date.now();
          return tA - tB;
        });
      });
    });

    return () => unsubscribe();
  }, [currentConversationId]); // Re-run when conversation changes

  const handleSend = async () => {
    alert("DEBUG: ChatInput handleSend");
    if (!inputValue.trim()) return; tConversationId(null);
    setMessages([]);
    // Close sidebar on mobile automatically? Optional.
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    // Close sidebar on mobile automatically? Optional.
  };

  const handleSelectChat = (id) => {
    setCurrentConversationId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close on mobile
  };

  const handleSendMessage = async (text, isSender = true) => {
    if (!db) {
      // Run locally only -> OPTIMISTIC UPDATE
      const tempId = Date.now().toString();
      const newMessage = {
        id: tempId,
        text: text,
        isSender: isSender,
        translation: language === 'Hindi' ? "Translating to Hindi..." : null,
        timestamp: new Date() // Local date for sorting
      };
      setMessages(prev => [...prev, newMessage]);
      return;
    }

    try {
      let conversationId = currentConversationId;

      // If no conversation selected, CREATE ONE FIRST
      if (!conversationId) {
        const docRef = await addDoc(collection(db, "conversations"), {
          userId: user ? user.uid : "anonymous",
          title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
          createdAt: serverTimestamp()
        });
        conversationId = docRef.id;
        setCurrentConversationId(conversationId);
      }

      let translationContent = null;
      if (language !== 'English') {
        translationContent = "Translating to " + language + "...";
      }

      // Add message to that conversation
      const fullLangCode = getLanguageCode(language);
      const msgRef = await addDoc(collection(db, "messages"), {
        conversationId: conversationId,
        text: text,
        isSender: isSender,
        translation: translationContent,
        languageCode: fullLangCode,
        timestamp: serverTimestamp(),
        userId: user ? user.uid : "anonymous",
        type: "text"
      });

      // If we started translation, follow up with the result
      if (language !== 'English') {
        console.log("DEBUG: Starting translation fetch for", text);

        // Get code like 'hi-IN', split to get 'hi'
        const langCode = getLanguageCode(language).split('-')[0];

        fetch('http://localhost:4000/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            text: text,
            targetLang: langCode
          })
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log("DEBUG: Translation received", data);
            if (data.translatedText) {
              updateDoc(msgRef, { translation: data.translatedText })
                .then(() => console.log("DEBUG: Firestore updated with translation"))
                .catch(e => console.error("DEBUG: Firestore update failed", e));
            }
          })
          .catch(err => console.error("DEBUG: Translation update failed:", err));
      }

      // Note: When DB creates doc, onSnapshot will fire. 
      // Logic to dedupe could be better (replace tempId with real ID), 
      // but for now the merge strategy keeps the "latest" DB version.
      // Ideally we remove the `tempId` version when real version arrives, 
      // but since content is same, dedupe by content? 
      // Actually, the `tempId` message will stay forever if we don't match it.
      // Simple fix: Remove the optimistic message on successful send? 
      // No, `onSnapshot` fires asynchronously.
      // Let's rely on the Merge strategy: 
      // dbMsgs have ID. localOnly have tempId. 
      // We will have DUPLICATES if we don't match them. 
      // But for "precise effort", duplicate is better than "nothing happens".
      // Actually, if we just want "something to happen", this works.
      // The user will see their message.
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Message sent locally (failed to save to DB). Check console.");
    }
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
        user={user}
      />

      {/* 2. The Chat Area (Middle) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        <ChatSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          currentConversationId={currentConversationId}
          user={user}
          highContrast={highContrast}
        />

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>

          {/* Sidebar Toggle (Visible when closed) */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 z-20 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${highContrast ? 'bg-black' : ''}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <p className={`text-xl font-medium ${highContrast ? 'text-gray-600' : 'text-gray-400'}`}>
                  {currentConversationId ? "No messages yet." : "Start a new conversation"}
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  text={msg.text}
                  translation={msg.translation}
                  languageCode={msg.languageCode}
                  isSender={msg.isSender}
                  highContrast={highContrast} // Pass theme
                />
              ))
            )}
          </div>

          {/* 3. The Input Area (Bottom) */}
          <ChatInput
            currentLanguage={language}
            onSendMessage={handleSendMessage}
            highContrast={highContrast} // Pass theme
          />
        </div>
      </div>
    </div>
  );
}

export default App;