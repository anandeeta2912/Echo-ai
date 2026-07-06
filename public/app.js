// Get UI elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcript = document.getElementById('transcript');
const ttsInput = document.getElementById('ttsInput');
const speakBtn = document.getElementById('speakBtn');
const vizContainer = document.getElementById('vizContainer');
const robot = document.getElementById('robot');
const robotMouth = document.getElementById('robotMouth');
const robotScreen = document.getElementById('robotScreen');

let recognizer;
let speechKey;
let speechRegion;

function setRobotState(state) {
    robotMouth.classList.remove('speaking', 'listening');
    if (state === 'listening') {
        robotMouth.classList.add('listening');
        robotScreen.textContent = 'Listening';
    } else if (state === 'speaking') {
        robotMouth.classList.add('speaking');
        robotScreen.textContent = 'Speaking';
    } else {
        robotScreen.textContent = 'Hi!';
    }
}

function bounceRobot() {
    robot.classList.remove('bounce');
    void robot.offsetWidth;
    robot.classList.add('bounce');
}

function showError(message) {
    console.error(message);
    transcript.textContent = 'Error: ' + message;
    robotScreen.textContent = 'Err';
}

function checkEnvironment() {
    if (window.location.protocol === 'file:') {
        showError('Please open http://localhost:3000, not the file directly.');
        return false;
    }
    if (typeof SpeechSDK === 'undefined') {
        showError('Speech SDK failed to load. Check your internet connection and refresh.');
        return false;
    }
    return true;
}

async function loadConfig() {
    try {
        if (!checkEnvironment()) return;
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error('Config request failed');
        const config = await response.json();
        speechKey = config.speechKey;
        speechRegion = config.speechRegion;
        if (!speechKey || !speechRegion) {
            showError('Server did not return Azure keys. Check server .env file.');
        }
    } catch (error) {
        showError('Could not load config: ' + error.message);
    }
}

// SPEECH TO TEXT (STT)
startBtn.addEventListener('click', async () => {
    if (!checkEnvironment()) return;
    if (!speechKey || !speechRegion) {
        showError('Configuration not loaded yet. Refresh the page.');
        return;
    }

    try {
        if (recognizer) {
            recognizer.stopContinuousRecognitionAsync();
            recognizer.close();
        }

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
            if (e.result.text) {
                transcript.textContent = e.result.text;
            }
        };

        recognizer.recognized = (s, e) => {
            if (e.result.text) {
                transcript.textContent = e.result.text;
            }
        };

        recognizer.canceled = (s, e) => {
            showError('Microphone error: ' + (e.errorDetails || 'Permission denied or unavailable'));
            resetSTTUI();
        };

        recognizer.sessionStopped = (s, e) => {
            resetSTTUI();
        };

        transcript.textContent = ' Listening...';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        vizContainer.classList.add('active');
        setRobotState('listening');
        bounceRobot();

        recognizer.startContinuousRecognitionAsync((err) => {
            if (err) {
                showError('Failed to start recognition: ' + err);
                resetSTTUI();
            }
        });
    } catch (error) {
        showError('Speech to Text error: ' + error.message);
        resetSTTUI();
    }
});

function resetSTTUI() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    vizContainer.classList.remove('active');
    setRobotState('idle');
}

stopBtn.addEventListener('click', () => {
    if (recognizer) {
        recognizer.stopContinuousRecognitionAsync();
        recognizer.close();
        recognizer = null;
    }
    resetSTTUI();
    transcript.textContent = 'Stopped listening.';
    bounceRobot();
});

// TEXT TO SPEECH (TTS)
speakBtn.addEventListener('click', async () => {
    const text = ttsInput.value.trim();
    if (!text) {
        alert('Please type something first!');
        bounceRobot();
        return;
    }
    if (!checkEnvironment()) return;
    if (!speechKey || !speechRegion) {
        showError('Configuration not loaded yet. Refresh the page.');
        return;
    }

    try {
        speakBtn.disabled = true;
        speakBtn.textContent = ' Speaking...';
        setRobotState('speaking');
        bounceRobot();

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = 'en-US-AriaNeural';

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(text, (result) => {
            console.log('TTS result reason:', result.reason);
            console.log('TTS result errorDetails:', result.errorDetails);

            speakBtn.textContent = ' Speak';
            speakBtn.disabled = false;
            setRobotState('idle');
            synthesizer.close();

            if (result.reason === SpeechSDK.ResultReason.Canceled) {
                const err = result.errorDetails || 'Speech synthesis was canceled';
                showError('TTS Error: ' + err);
            } else if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                transcript.textContent = 'Finished speaking.';
            } else {
                transcript.textContent = 'Speaking completed.';
            }
        });
    } catch (error) {
        console.error('TTS exception:', error);
        showError('Text to Speech error: ' + error.message);
        speakBtn.textContent = ' Speak';
        speakBtn.disabled = false;
        setRobotState('idle');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
});
