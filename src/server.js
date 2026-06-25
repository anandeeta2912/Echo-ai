const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Safe API endpoint - key never reaches frontend code
app.get('/api/config', (req, res) => {
    res.json({
        speechKey: process.env.SPEECH_KEY,
        speechRegion: process.env.SPEECH_REGION
    });
});

app.listen(PORT, () => {
    console.log(`EchoAI running at http://localhost:${PORT}`);
});