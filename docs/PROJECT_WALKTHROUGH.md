# Vaani - Accessibility App Implementation Walkthrough

We have successfully built the **Frontend Interface** for Vaani, enabling accessibility features using browser-native APIs.

## 🚀 Features Implemented

| Feature | Component | Logic (Frontend Only) |
| :--- | :--- | :--- |
| **Header & Nav** | `Header.jsx` | Language Dropdown + Call Mode Button |
| **Speech-to-Text** | `ChatInput.jsx` | Uses `window.webkitSpeechRecognition` to type what you say. |
| **Text-to-Speech** | `ChatBubble.jsx` | Uses `window.speechSynthesis` to read messages aloud. |
| **Translation UI** | `App.jsx` | Simulates translation (e.g., Hindi adds a "Translated" label). |
| **Live Captioning** | `LiveTranscribe.jsx` | Full-screen overlay for phone calls/meetings. |

### **1. Settings Drawer**
-   **Location**: `src/components/layout/SettingsDrawer.jsx`
-   **Features**:
    -   **Text Size Control**: Users can toggle between Small, Medium, Large, and XL fonts.
    -   **High Contrast Mode**: Global toggle for "Black & Yellow" high-visibility theme.
    -   **State Management**: `App.jsx` manages `fontSize` and `highContrast` state and passes it down.

### **2. Futuristic Landing Page**
-   **Location**: `src/components/layout/LandingPage.jsx`
-   **Design**: Dark mode, glassmorphism, gradient accents.
-   **Functionality**: Acts as the "Welcome Screen". Clicking "Get Started" sets `showLanding` to `false` in `App.jsx`, revealing the main app.

### **3. Live Transcribe (Call Mode)**
-   **Location**: `src/components/features/LiveTranscribe.jsx`
-   **Fixes**: Resolved white screen crash by importing `getLanguageCode`.
-   **Visuals**: Updated to match the "Futuristic/High Contrast" aesthetic.

## 📂 Project Structure

```plaintext
src
 ├── components
 │    ├── chat
 │    │    ├── ChatBubble.jsx   (Message display + Speaker icon)
 │    │    └── ChatInput.jsx    (Input bar + Microphone logic)
 │    ├── features
 │    │    └── LiveTranscribe.jsx (Full-screen captioning mode)
 │    └── layout
 │         ├── Header.jsx       (Logo + Language Selector + Phone Button)
 │         ├── SettingsDrawer.jsx (Accessibility Controls)
 │         └── LandingPage.jsx    (Welcome Screen)
 └── App.jsx                    (Main wiring & State management)
```

## 🧪 How to Test

1.  **Speech-to-Text**:
    *   Click the **Mic Icon** 🎤 in the input bar.
    *   Speak clearly.
    *   Text should appear in the input box.

2.  **Text-to-Speech**:
    *   Hover over any message bubble.
    *   Click the **Speaker Icon** 🔊.
    *   Your computer will read the text.

3.  **Call Mode (Live Transcribe)**:
    *   Click the **Phone Icon** 📞 in the Header (top right).
    *   A black screen will appear.
    *   Speak continuously -> It will display large yellow text (subtitles).

## 📝 Note for Backend Team

1.  **Translation**: Currently mocked in `App.jsx`. You need to replace the logic in `handleSendMessage` to call your API (e.g., Azure Translator or Google Cloud Translation).
2.  **Speech API**: Currently using Browser API. For better accuracy, replace with Google Cloud STT or similar in the future.
3.  **Deployment**: Connect this frontend to your Python/Node.js backend.

## **How to Run**
1.  `npm install`
2.  `npm run dev`
3.  Open browser to localhost.
