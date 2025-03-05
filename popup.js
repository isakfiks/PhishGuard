document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.runtime.sendMessage({ action: 'getAnalysis', tabId: currentTab.id }, (response) => {
        const scoreElement = document.getElementById('score');
        const adultElement = document.getElementById('adult');
        
        if (response) {
          if (response.whitelisted) {
            scoreElement.textContent = 'Whitelisted Site - Trusted';
            scoreElement.className = 'whitelisted';
            adultElement.textContent = 'Whitelisted Site - No Scanning';
            adultElement.className = 'whitelisted';
          } else {
            const score = response.score;
            if (score >= 7) {
              scoreElement.textContent = `Safe (Score: ${score}/10)`;
              scoreElement.className = 'safe';
            } else if (score >= 3) {
              scoreElement.textContent = `Suspicious (Score: ${score}/10)`;
              scoreElement.className = 'warning';
            } else {
              scoreElement.textContent = `Dangerous (Score: ${score}/10)`;
              scoreElement.className = 'danger';
            }
            
            if (response.adult) {
              adultElement.textContent = 'Adult content detected';
              adultElement.className = 'danger';
            } else {
              adultElement.textContent = 'No adult content detected';
              adultElement.className = 'safe';
            }
          }
        } else {
          scoreElement.textContent = 'No analysis available';
          adultElement.textContent = 'No analysis available';
        }
      });
    });
  });