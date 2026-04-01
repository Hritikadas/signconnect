# SignConnect Browser Extension

Real-time sign language detection overlay for Chrome, Edge, and Firefox.

## Structure

```
signconnect_extension/
├── manifest.json          - Extension ID card (Manifest V3)
├── popup.html             - UI when clicking extension icon
├── popup.js               - Popup logic
├── content.js             - Injected into web pages (Google Meet, Zoom, etc.)
├── content.css            - Scoped styles for overlay
├── background.js          - Service worker for state management
├── welcome.html           - Shown on first install
└── utils/
    └── mediapipe_sdk/     - Place local MediaPipe files here (optional)
```

## Installation (Developer Mode)

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `signconnect_extension/` folder
5. The extension icon will appear in your toolbar

## Usage

1. Click the 🤟 SignConnect icon in your toolbar
2. Click "Start Detection"
3. Allow camera access when prompted
4. A draggable overlay appears with live sign detection
5. Works on any webpage including Google Meet and Zoom

## Supported Gestures

- 👋 Hello (open hand)
- 👍 Thumbs Up
- ✌️ Peace
- 👌 OK
- ☝️ Pointing
- 🤘 Rock On
- 🤙 Call Me
- ✊ Fist

## Publishing to Chrome Web Store

1. Zip the `signconnect_extension/` folder
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Click "New Item" and upload the zip
4. Fill in store listing details
5. Submit for review

## MediaPipe Version

This extension uses MediaPipe Hands `@0.4.1646424915` (pinned for stability).
