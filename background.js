let analysisResults = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    chrome.storage.sync.get(['whitelist', 'adultProtection'], (data) => {
      const whitelist = data.whitelist || [];
      const adultProtection = data.adultProtection || false;
      
      // Extract the hostname
      try {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        const domain = hostname.startsWith('www.') ? hostname.substring(4) : hostname;
        
        // Check both the full hostname and the domain without www
        if (whitelist.includes(hostname) || whitelist.includes(domain)) {
          console.log(`Skipping analysis for whitelisted domain: ${domain}`);
          // Update the analysis results to show it's safe (whitelisted)
          analysisResults[tabId] = { score: 10, adult: false, whitelisted: true };
          return;
        }
        
        // Only try to send a message if we're on an actual webpage (not a chrome:// page, for obv reasons)
        chrome.tabs.sendMessage(tabId, { action: 'extractDetails' }, (response) => {
          // Check for the error first
          if (chrome.runtime.lastError) {
            console.log('Error sending message:', chrome.runtime.lastError.message);
            return;
          }
          
          if (response) {
            const { title, description } = response;
            const prompt = `Analyze the following website details and return a JSON object with 'phishing_score' (integer 0-10, 10 being safest) and 'adult_content' (boolean):

URL: ${tab.url}
Title: ${title}
Description: ${description}`;
            console.log('Sending prompt to Ollama:', prompt);
            fetch('http://localhost:11434/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'llava',
                prompt: prompt,
                stream: false
              })
            })
              .then((res) => {
                console.log('Ollama response status:', res.status);
                return res.json();
              })
              .then((data) => {
                console.log('Ollama raw response:', data);
                const responseText = data.response;
                try {
                  const jsonMatch = responseText.match(/```[\s\S]*?({[\s\S]*?})[\s\S]*?```/);
                  if (jsonMatch && jsonMatch[1]) {
                    const jsonString = jsonMatch[1];
                    const result = JSON.parse(jsonString);
                    const score = result.phishing_score;
                    const adult = result.adult_content;
                    console.log(`Parsed result - Score: ${score}, Adult: ${adult}`);
                    analysisResults[tabId] = { score, adult };
                    if (score < 3) {
                      chrome.tabs.sendMessage(tabId, { action: 'showPhishingWarning' });
                    } else {
                      chrome.tabs.sendMessage(tabId, { action: 'showSafeNotification' });
                    }
                    if (adult && adultProtection) {
                      chrome.tabs.sendMessage(tabId, { action: 'showAdultWarning' });
                    }
                  } else {
                    throw new Error('No valid JSON block found in response');
                  }
                } catch (e) {
                  console.error('Failed to parse Ollama response:', responseText, e);
                  analysisResults[tabId] = { score: 5, adult: false }; // Fallback to a neutral score in case of any errors
                  chrome.tabs.sendMessage(tabId, { action: 'showSafeNotification' });
                }
              })
              .catch((err) => {
                console.error('Error contacting Ollama:', err);
                chrome.notifications.create({
                  type: 'basic',
                  iconUrl: 'icon16.png',
                  title: 'PhishGuard',
                  message: 'Error contacting Ollama server. Please ensure it is running.'
                });
              });
          } else {
            console.log('No response from content script for tab:', tabId);
          }
        });
      } catch (error) {
        console.error('Error processing URL:', error);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getAnalysis') {
    const tabId = message.tabId;
    console.log('Popup requested analysis for tab:', tabId, 'Results:', analysisResults[tabId]);
    sendResponse(analysisResults[tabId] || null);
  }
  return true; // Keep the message channel open async resp
});