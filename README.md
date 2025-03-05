# PhishGuard

A browser extension that protects you from phishing in real-time using AI, all while keeping your data local!  
**Note**: PhishGuard requires a local LLM (like Ollama) to run. The speed of the "safety score" calculation depends on your machine’s power—it might take a moment on slower systems.

---

## Features

### Enabled by Default
- ⚠️ **Phishing Detection**: Spots phishing attempts with high accuracy using AI analysis.  
- 🫂 **Privacy First**: Your data never leaves your machine—everything runs locally.  
- 🏳️ **Custom Whitelist**: Skip analysis for websites you trust, fully customizable.

### Optional (Enable in Settings)
- 🔞 **NSFW Protection**: Block adult content with a simple toggle.

---

## How It Works

PhishGuard analyzes websites as you browse, assigning a **safety score** from 0 to 10 (10 being safest):
- **Score < 3**: A red warning banner (⚠️) appears: "This website may be a phishing site. Proceed at your own risk."
- **Score ≥ 3**: A green banner (✅) confirms: "This website appears safe."
- **NSFW Detected**: An orange warning (🔞) pops up if enabled: "This website may contain adult content."

Click the extension icon to see the score and details for the current page!

---

## Installation

### Prerequisites
- **Ollama**: Install it from [ollama.com](https://ollama.com) and ensure a model (e.g., `llava`) is available.  
- **Chrome Browser**: PhishGuard is a Chrome extension.

### Setup Steps
1. **Run Ollama Locally**:
   - Open PowerShell (Windows) or your terminal and start the server:
     ```powershell
     $env:OLLAMA_ORIGINS="chrome-extension://*"; ollama serve
     ```
   - Verify it’s running at `http://localhost:11434`.

2. **Install the Extension**:
- Clone or download this repository to a folder (e.g., `PhishGuard`).
- Open Chrome, go to `chrome://extensions/`, and enable "Developer mode" (top right).
- Click "Load unpacked" and select the `PhishGuard` folder.

3. **Configure (Optional)**:
- Right-click the PhishGuard icon > "Options":
- Add trusted domains to the whitelist (e.g., `google.com`).
- Toggle NSFW protection on/off.

---

## Usage

- Browse normally—PhishGuard analyzes each page automatically.
- Look for banners:
- Green (✅): Safe to proceed.
- Red (⚠️): Potential phishing risk.
- Orange (🔞): Adult content warning (if enabled).
- Click the extension icon for the safety score and NSFW status.

**Tip**: If no banner appears, check the console (right-click icon > "Inspect") or ensure Ollama is running.

---

## Development

- **Tech Stack**: Chrome Extension, JavaScript, Ollama LLM.
- **Files**:
- `manifest.json`: Extension configuration.
- `background.js`: Handles AI requests and logic.
- `content.js`: Displays warnings on pages.
- `popup.html/js`: Shows analysis in the popup.
- `options.html/js`: Settings UI.

- **Contributing**: Fork, tweak, and submit a PR! Suggestions welcome.

---

## Troubleshooting

- **No Response?**  
- Ensure Ollama is running: `$env:OLLAMA_ORIGINS="chrome-extension://*"; ollama serve`.
- Check the background console for errors.

- **Slow Analysis?**  
- Your machine’s CPU/GPU power affects speed. Upgrade hardware or use a lighter model.

- **Still Stuck?**  
- Open an issue with logs from the console (right-click icon > "Inspect").

---

## License

MIT License—feel free to use, modify, and share!
