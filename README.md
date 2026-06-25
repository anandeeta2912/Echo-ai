# EchoAI 🎤

Talk to your browser. Let it talk back.

EchoAI is a voice notes app built with Azure AI Speech. Speak into your mic and watch it transcribe in real time. Type anything and hear it spoken back using a neural AI voice.

---

## What it does

- 🎤 Speech to Text — real time transcription from your microphone
- 🔊 Text to Speech — types anything (Azure Neural Voice) reads it back

---

## Stack

- Azure AI Speech (F0 free tier)
- Azure Speech JavaScript SDK
- Node.js + Express

---

## Run it locally

```
git clone https://github.com/saishagoel27/EchoAI
cd EchoAI
npm install
```

Create a `.env` file:

```
SPEECH_KEY=your_azure_speech_key
SPEECH_REGION=eastus
```

Then:

```
npm start
```

Open `http://localhost:3000`

---

## Get your free Azure Speech key

1. Go to portal.azure.com
2. Create a Speech resource — Free F0 tier
3. Copy Key 1 and your region into `.env`

---
