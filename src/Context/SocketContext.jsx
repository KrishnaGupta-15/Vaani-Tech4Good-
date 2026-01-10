import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';

const SocketContext = createContext();

// Initialize outside to keep singleton, but we need to handle the "already connected" case
const socket = io('http://localhost:4000', {
    autoConnect: true,
    reconnection: true
});

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [otherUser, setOtherUser] = useState('');
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Transcription State
    const [remoteTranscript, setRemoteTranscript] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // Helper to request media with better error handling
    const tryGetStream = async () => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            return currentStream;
        } catch (err) {
            console.error("Media Error:", err);
            if (err.name === 'NotAllowedError') {
                alert("Microphone permission denied. Please allow access in browser settings.");
            } else if (err.name === 'NotFoundError') {
                alert("No microphone found. Please connect a device.");
            } else {
                alert("Could not access microphone: " + err.message);
            }
            return null;
        }
    };

    useEffect(() => {
        tryGetStream(); // Initial try

        // 2. Handle Socket ID
        if (socket.id) {
            setMe(socket.id);
            setIsSocketConnected(true);
        }

        socket.on('connect', () => {
            console.log("Socket Connected:", socket.id);
            setMe(socket.id);
            setIsSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log("Socket Disconnected");
            setIsSocketConnected(false);
        });

        socket.on('me', (id) => {
            console.log("Received ME event:", id);
            setMe(id);
        });

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            console.log("Receiving call from:", from);
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        socket.on('transcription', (data) => {
            console.log("Remote Transcription Received:", data.text);
            setRemoteTranscript(prev => data.text);
        });

        socket.on('callRejected', () => {
            alert("Call was rejected");
            setCallEnded(true);
            setCallAccepted(false);
            setCall({});
            // Ensure we don't reload page, just reset UI
        });

        socket.on('callEnded', () => {
            setCallEnded(true);
            setCallAccepted(false);
            setCall({});
            setOtherUser('');
            if (connectionRef.current) connectionRef.current.destroy();
            alert("Call ended by remote user");
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('me');
            socket.off('callUser');
            socket.off('transcription');
        }
    }, []);

    const answerCall = async () => {
        setCallAccepted(true);
        setCallEnded(false);
        const callerId = call.from;
        setOtherUser(callerId);

        // Ensure stream exists before answering
        let myStream = stream;
        if (!myStream) {
            myStream = await tryGetStream();
            if (!myStream) return; // Abort if still no mic
        }

        const peer = new SimplePeer({ initiator: false, trickle: false, stream: myStream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: callerId });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const rejectCall = () => {
        setCallAccepted(false);
        setCallEnded(true);
        // Emit rejection to caller
        if (call.from) {
            socket.emit("rejectCall", { to: call.from });
        }
        setCall({});
    };

    const callUser = async (id) => {
        if (!id) {
            alert("Please enter an ID to call");
            return;
        }

        // RESET STATE for new call
        setCallEnded(false);
        setCallAccepted(false);

        // Ensure stream exists before calling
        let myStream = stream;
        if (!myStream) {
            console.log("Stream missing, retrying...");
            myStream = await tryGetStream();
            if (!myStream) return; // Abort
        }

        setOtherUser(id);

        const peer = new SimplePeer({ initiator: true, trickle: false, stream: myStream });

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        if (callAccepted && !callEnded) {
            // Notify other user
            let target = otherUser;
            if (!target && call.from) target = call.from;

            if (target) {
                socket.emit("endCall", { to: target });
            }
        }

        if (connectionRef.current) connectionRef.current.destroy();

        // Reset state without reload
        setCallAccepted(false);
        setCall({});
        setOtherUser('');
    };

    const sendTranscription = (text) => {
        let target = otherUser;
        if (!target && call.isReceivingCall) {
            target = call.from;
        }

        if (target && callAccepted && !callEnded) {
            socket.emit('transcription', { to: target, text: text });
        }
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            rejectCall,
            remoteTranscript,
            sendTranscription,
            setCall,
            otherUser,
            isSocketConnected
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
