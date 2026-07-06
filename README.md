# EchoAI - Voice Notes Web App

A futuristic voice assistant web app built with Express.js and the Azure Cognitive Services Speech SDK.

## Features
- Speech to Text (microphone transcription)
- Text to Speech (Indian female neural voice)
- Animated robot mascot and futuristic UI

## Local Development
```bash
npm install
npm start
# open http://localhost:3000
```

## Environment Variables
Create `src/.env` (not committed to git):
```
SPEECH_KEY=your_azure_speech_key
SPEECH_REGION=your_region   # e.g. southeastasia
```

## Deploy to Azure App Service
```bash
az webapp up --name echoai --resource-group echoai-rg --runtime "NODE:20-lts" --sku F1
```
Then set app settings in Azure Portal (Configuration > Application settings):
- `SPEECH_KEY`
- `SPEECH_REGION`

Or use Deployment Center with this GitHub repo: https://github.com/anandeeta2912/Echo-ai
