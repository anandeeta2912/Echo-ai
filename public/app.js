// EchoAI - Azure Speech SDK
// Speech to Text + Text to Speech

// Get UI elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcript = document.getElementById('transcript');
const ttsInput = document.getElementById('ttsInput');
const speakBtn = document.getElementById('speakBtn');

let recognizer;
let speechKey;
let speechRegion;

// ================================
// FETCH CONFIG SAFELY FROM SERVER
// ================================
async function loadConfig() {
    const response = await fetch('/api/config');
    const config = await response.json();
    speechKey = config.speechKey;
    speechRegion = config.speechRegion;
    console.log('Config loaded successfully');
}

// ================================
// SPEECH TO TEXT (STT)
// ================================
startBtn.addEventListener('click', () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    
    transcript.textContent = '🎤 Listening...';
    startBtn.disabled = true;
    stopBtn.disabled = false;

    recognizer.recognizing = (s, e) => {
        transcript.textContent = '🎤 ' + e.result.text;
    };

    recognizer.recognized = (s, e) => {
        if (e.result.text) {
            transcript.textContent = e.result.text;
        }
    };

    recognizer.startContinuousRecognitionAsync();
});

stopBtn.addEventListener('click', () => {
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync();
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
    transcript.textContent = 'Stopped listening.';
});

// ================================
// TEXT TO SPEECH (TTS)
// ================================
speakBtn.addEventListener('click', () => {
    const text = ttsInput.value.trim();
    
    if (!text) {
        alert('Please type something first!');
        return;
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
    
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    
    speakBtn.textContent = '🔊 Speaking...';
    speakBtn.disabled = true;

    synthesizer.speakTextAsync(text, result => {
        speakBtn.textContent = '🔊 Speak';
        speakBtn.disabled = false;
        synthesizer.close();
    });
});

// Load config when page loads
loadConfig();