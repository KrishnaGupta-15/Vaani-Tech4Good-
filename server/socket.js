export default function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.emit("me", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            socket.broadcast.emit("callEnded");
        });

        // Calling logic
        socket.on("callUser", (data) => {
            console.log("Calling user:", data.userToCall);
            io.to(data.userToCall).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
        });

        socket.on("rejectCall", (data) => {
            // data: { to: callerSocketId }
            console.log("Call rejected by:", socket.id);
            io.to(data.to).emit("callRejected");
        });

        socket.on("endCall", (data) => {
            io.to(data.to).emit("callEnded");
        });

        socket.on("answerCall", (data) => {
            console.log("Answering call from:", data.to);
            io.to(data.to).emit("callAccepted", data.signal);
        });

        // Transcription Sync Logic
        socket.on("transcription", (data) => {
            // data should contain: { to: "socketId", text: "..." }
            if (data.to && data.text) {
                io.to(data.to).emit("transcription", {
                    text: data.text,
                    isFinal: data.isFinal,
                    lang: data.lang
                });
            }
        });
    });
}
