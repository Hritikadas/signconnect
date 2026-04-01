// SignConnect - Welcome Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // These IDs must match exactly with welcome.html
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const serverUrl = 'http://localhost:5050/';

    /**
     * Pings the FastAPI server at localhost:5050
     */
    async function checkServerStatus() {
        // Safety check to prevent "null" errors
        if (!statusDot || !statusText) return;

        try {
            // Setup a 2-second timeout so the ping doesn't hang forever
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(serverUrl, { 
                mode: 'cors', // Enable Cross-Origin Resource Sharing
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                // SUCCESS: Server is running
                statusDot.style.background = '#22c55e'; // Bright Green
                statusDot.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.6)';
                statusText.textContent = "Python Brain: Online and Ready";
                statusText.style.color = '#22c55e';
            } else {
                throw new Error('Server unreachable');
            }
        } catch (error) {
            // FAIL: Server is offline
            statusDot.style.background = '#ef4444'; // Bright Red
            statusDot.style.boxShadow = 'none';
            statusText.textContent = "Python Brain: Offline (Run ml_bridge.py)";
            statusText.style.color = '#94a3b8';
        }
    }

    // Run the check every 3 seconds to give live feedback
    setInterval(checkServerStatus, 3000);
    
    // Run once immediately on page load
    checkServerStatus();
});