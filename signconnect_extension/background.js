// SignConnect Extension - Background Service Worker

// Handle extension install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      autoDetect: false,
      showOverlay: true,
      signLanguage: 'ASL',
      isActive: false
    });

    // Open welcome page
    chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
  }
});

// Relay messages between content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SIGN_DETECTED') {
    // Broadcast to all extension views (popup)
    chrome.runtime.sendMessage(message).catch(() => {
      // Popup may not be open, ignore error
    });
  }
  return true;
});
