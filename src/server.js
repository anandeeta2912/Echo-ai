const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - only allow requests from your own domain
const allowedOrigins = [
    'http://localhost:3000',
    process.env.ALLOWED_ORIGIN 
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Serving frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Safe API endpoint
app.get('/api/config', (req, res) => {
    res.json({
        speechKey: process.env.SPEECH_KEY,
        speechRegion: process.env.SPEECH_REGION
    });
});

app.listen(PORT, () => {
    console.log(`EchoAI running at http://localhost:${PORT}`);
});