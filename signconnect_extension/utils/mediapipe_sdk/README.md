# MediaPipe SDK Files

This folder is reserved for local MediaPipe SDK files.

## Option 1: Use CDN (Current - Easier)

The extension currently loads MediaPipe from CDN:
```
https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/
```

## Option 2: Bundle Locally (Offline Support)

To bundle MediaPipe locally for offline use:

1. Download the files:
```bash
npm install @mediapipe/hands@0.4.1646424915
```

2. Copy from `node_modules/@mediapipe/hands/`:
   - `hands.js`
   - `hands_solution_packed_assets.data`
   - `hands_solution_packed_assets_loader.js`
   - `hands_solution_simd_wasm_bin.js`
   - `hands_solution_simd_wasm_bin.wasm`

3. Place them in this folder.

4. Update the `locateFile` in `content.js`:
```js
locateFile: (file) => chrome.runtime.getURL(`utils/mediapipe_sdk/${file}`)
```

5. Add to `web_accessible_resources` in `manifest.json` (already configured).
