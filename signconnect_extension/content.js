// SignConnect Extension - Content Script (Optimized for Port 5050)

let isDetecting = false;
let overlayContainer = null;
let videoElement = null;
let canvasElement = null;
let handsInstance = null;
let cameraStream = null;
let animationFrameId = null;

// Handle Messages from Popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_DETECTION') {
        startDetection();
        sendResponse({ success: true });
    } else if (message.type === 'STOP_DETECTION') {
        stopDetection();
        sendResponse({ success: true });
    }
    return true;
});

async function startDetection() {
    if (isDetecting) return;
    isDetecting = true;

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });

        createUI();
        videoElement.srcObject = cameraStream;
        await videoElement.play();

        await loadMediaPipe();
        detectLoop();
        injectSubtitles();
    } catch (error) {
        console.error('[SignConnect] Start Failed:', error);
        isDetecting = false;
    }
}

function stopDetection() {
    isDetecting = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    if (overlayContainer) overlayContainer.remove();
    const sub = document.querySelector('.sc-subtitle-container');
    if (sub) sub.remove();
    handsInstance = null;
}

function createUI() {
    // Remove existing if any
    const existing = document.getElementById('signconnect-overlay');
    if (existing) existing.remove();

    overlayContainer = document.createElement('div');
    overlayContainer.id = 'signconnect-overlay';
    overlayContainer.innerHTML = `
        <div id="sc-header">🤟 SignConnect AI <span id="sc-close" style="cursor:pointer; float:right;">✕</span></div>
        <div id="sc-body">
            <div id="sc-video-container">
                <video id="sc-video" autoplay muted playsinline></video>
                <canvas id="sc-canvas"></canvas>
            </div>
            <div id="sc-sign-display"><span id="sc-sign-text">Initializing...</span></div>
        </div>
    `;
    document.body.appendChild(overlayContainer);
    videoElement = document.getElementById('sc-video');
    canvasElement = document.getElementById('sc-canvas');

    document.getElementById('sc-close').onclick = stopDetection;
    makeDraggable(overlayContainer, document.getElementById('sc-header'));
}

async function loadMediaPipe() {
    if (window.Hands) return;
    console.log("[SignConnect] Loading Local MediaPipe...");
    
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        // Use chrome.runtime.getURL to point to your local file
        s.src = chrome.runtime.getURL('hands.js');
        s.onload = () => {
            console.log("[SignConnect] Local MediaPipe Loaded! ✅");
            res();
        };
        s.onerror = (err) => {
            console.error("[SignConnect] Local Load Failed! ❌", err);
            rej(err);
        };
        document.head.appendChild(s);
    });
}

async function detectLoop() {
  console.log("[SignConnect] Loop Tick...");
    if (!isDetecting || !videoElement) return;

    if (!handsInstance && window.Hands) {
        handsInstance = new window.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
        });
        handsInstance.setOptions({
            maxNumHands: 1,
            modelComplexity: 0,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });
        handsInstance.onResults(onResults);
    }

    if (handsInstance && videoElement.readyState >= 2) {
        await handsInstance.send({ image: videoElement });
    }
    animationFrameId = requestAnimationFrame(detectLoop);
}

// --- UPDATED onResults: Connected to Port 5050 ---
async function onResults(results) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = results.image.width;
    canvasElement.height = results.image.height;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const signText = document.getElementById('sc-sign-text');
    const subText = document.getElementById('sc-live-subtitle');

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        drawLandmarks(ctx, landmarks);

        // Prepare 63-point data (x, y, z for 21 points)
        const flattened = landmarks.flatMap(lm => [lm.x, lm.y, lm.z]);

        try {
            // UPDATED: Now points to 5050
            const resp = await fetch('http://localhost:5050/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ landmarks: flattened })
            });
            
            const data = await resp.json();
            
            if (data.status === "success" || data.status === "ok") {
                const prediction = data.prediction || data.message;
                if (signText) signText.textContent = prediction;
                if (subText) subText.textContent = prediction;
                
                // Optional: Broadcast back to popup
                chrome.runtime.sendMessage({ type: 'SIGN_DETECTED', sign: prediction });
            }
        } catch (e) {
            if (signText) signText.textContent = "Brain Offline (5050)";
        }
    } else {
        if (signText) signText.textContent = "Show Hand";
    }
}

function injectSubtitles() {
    if (document.querySelector('.sc-subtitle-container')) return;
    const div = document.createElement('div');
    div.className = 'sc-subtitle-container';
    div.innerHTML = `<span id="sc-live-subtitle" class="sc-subtitle-text">Waiting...</span>`;
    document.body.appendChild(div);
}

function drawLandmarks(ctx, landmarks) {
    ctx.fillStyle = "#00FF00"; 
    ctx.strokeStyle = "#00FF00"; 
    ctx.lineWidth = 2;
    landmarks.forEach(lm => {
        ctx.beginPath(); 
        ctx.arc(lm.x * ctx.canvas.width, lm.y * ctx.canvas.height, 3, 0, 2 * Math.PI); 
        ctx.fill();
    });
}

function makeDraggable(el, handle) {
    let x = 0, y = 0, l = 0, t = 0;
    handle.onmousedown = (e) => {
        x = e.clientX; y = e.clientY;
        l = el.offsetLeft; t = el.offsetTop;
        document.onmousemove = (e) => {
            el.style.left = (l + e.clientX - x) + "px";
            el.style.top = (t + e.clientY - y) + "px";
            el.style.right = "auto"; el.style.bottom = "auto";
        };
        document.onmouseup = () => document.onmousemove = null;
    };
}