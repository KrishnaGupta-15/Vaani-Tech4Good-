import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../Context/SocketContext';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import LiveTranscribe from '../features/LiveTranscribe';

const CallInterface = ({ currentLanguage }) => {
    const [localTranscript, setLocalTranscript] = React.useState('');
    const [status, setStatus] = React.useState('Initializing...');
    const [retryCount, setRetryCount] = React.useState(0);

    const {
        name,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        answerCall,
        leaveCall,
        remoteTranscript,
        sendTranscription,
        rejectCall
    } = useContext(SocketContext);

    // Determine if we are in a call
    const inCall = callAccepted && !callEnded;
    const isReceiving = call.isReceivingCall && !callAccepted;

    if (!inCall && !isReceiving) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center text-white">

            {/* Incoming Call Notification */}
            {isReceiving && (
                <div className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center animate-bounce-in">
                    <h2 className="text-2xl mb-4">{call.name || "Someone"} is calling...</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={answerCall}
                            className="bg-green-500 p-4 rounded-full hover:bg-green-600 transition shadow-lg shadow-green-500/30"
                            title="Accept Call"
                        >
                            <Phone size={32} />
                        </button>
                        <button
                            onClick={rejectCall}
                            className="bg-red-500 p-4 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-500/30"
                            title="Decline Call"
                        >
                            <PhoneOff size={32} />
                        </button>
                    </div>
                </div>
            )}

            {/* Active Call UI */}
            {inCall && (
                <div className="w-full h-full flex flex-col p-4 relative">

                    {/* Header */}
                    <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium tracking-wider">LIVE CALL • {call.name || "Connected"}</span>
                        </div>
                    </div>

                    {/* Main Visuals (Avatars / Video) */}
                    <div className="flex-1 flex items-center justify-center gap-4 relative">
                        {/* Remote User - Show Video if available */}
                        <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover absolute inset-0 rounded-2xl opacity-50" />

                        <div className="z-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_50px_rgba(100,100,255,0.3)] animate-pulse">
                            <span className="text-4xl font-bold">{call.name ? call.name[0] : "R"}</span>
                        </div>
                    </div>

                    {/* CAPTIONS / SUBTITLES */}
                    <div className="flex-1 flex flex-col justify-end items-center text-center max-w-4xl mx-auto space-y-4 pb-12 z-20">
                        {/* Remote Transcript */}
                        <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full min-h-[120px] flex flex-col items-center justify-center transition-all">
                            <p className="text-xs text-blue-300 uppercase tracking-widest mb-2 self-start">
                                {call.name || "Remote User"}
                            </p>
                            <p className="text-2xl md:text-4xl font-light text-yellow-300 leading-normal">
                                {remoteTranscript || "..."}
                            </p>
                        </div>

                        {/* Local Transcript (What I am saying) */}
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/5 w-3/4 flex flex-col items-center justify-center relative">
                            <p className="text-[10px] text-green-300 uppercase tracking-widest mb-1 self-start">
                                You
                            </p>
                            <p className="text-lg text-gray-200">
                                {localTranscript || "Listening..."}
                            </p>
                            {/* Status Indicator */}
                            <div className="absolute bottom-2 right-4 flex items-center gap-2">
                                <p className="text-[10px] text-gray-400">
                                    {status}
                                </p>
                                {(status === 'Initializing...' || status.startsWith('Error')) && (
                                    <button
                                        onClick={() => setRetryCount(c => c + 1)}
                                        className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] text-white transition"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-8 flex justify-center gap-6 z-20">
                        <button
                            onClick={leaveCall}
                            className="bg-red-500 hover:bg-red-600 p-4 rounded-full shadow-lg transition-transform hover:scale-110"
                        >
                            <PhoneOff size={32} />
                        </button>
                    </div>

                    {/* Hidden Self-Transcriber */}
                    <div className="opacity-0 pointer-events-none absolute h-0 w-0 overflow-hidden">
                        <LiveTranscribe
                            key={retryCount}
                            isOpen={true}
                            currentLanguage={currentLanguage}
                            onTranscriptUpdate={(text) => {
                                setLocalTranscript(text);
                                sendTranscription(text);
                            }}
                            onError={(err) => {
                                setLocalTranscript("Error: " + err);
                                setStatus("Error");
                            }}
                            onStatusChange={setStatus}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallInterface;
