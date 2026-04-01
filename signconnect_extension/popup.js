// SignConnect Extension - Popup Logic

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const detectedSign = document.getElementById('detectedSign');
const autoDetect = document.getElementById('autoDetect');
const showOverlay = document.getElementById('showOverlay');
const signLanguage = document.getElementById('signLanguage');

// Load saved settings
chrome.storage.local.get(['autoDetect', 'showOverlay', 'signLanguage', 'isActive'], (data) => {
  autoDetect.checked = data.autoDetect || false;
  showOverlay.checked = data.showOverlay !== false; // default true
  signLanguage.value = data.signLanguage || 'ASL';
  updateUI(data.isActive || false);
});

// Listen for sign detections from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SIGN_DETECTED') {
    detectedSign.innerHTML = `
      <span class="sign-text">${message.sign}</span>
      <span class="sign-label">Detected sign</span>
    `;
  }
});

// Start detection
startBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { type: 'START_DETECTION' }, (response) => {
    if (chrome.runtime.lastError) {
      statusText.textContent = 'Cannot inject on this page';
      return;
    }
    chrome.storage.local.set({ isActive: true });
    updateUI(true);
  });
});

// Stop detection
stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { type: 'STOP_DETECTION' });
  chrome.storage.local.set({ isActive: false });
  updateUI(false);
  detectedSign.innerHTML = '<span class="sign-label">No sign detected yet</span>';
});

// Save settings on change
autoDetect.addEventListener('change', () => {
  chrome.storage.local.set({ autoDetect: autoDetect.checked });
});

showOverlay.addEventListener('change', () => {
  chrome.storage.local.set({ showOverlay: showOverlay.checked });
});

signLanguage.addEventListener('change', () => {
  chrome.storage.local.set({ signLanguage: signLanguage.value });
});

// Options page
document.getElementById('optionsLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

function updateUI(isActive) {
  if (isActive) {
    statusDot.classList.add('active');
    statusText.textContent = 'Detection active';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
  } else {
    statusDot.classList.remove('active');
    statusText.textContent = 'Detection inactive';
    startBtn.style.display = 'flex';
    stopBtn.style.display = 'none';
  }
}
