document.addEventListener('DOMContentLoaded', () => {
    const adultToggle = document.getElementById('adultToggle');
    const whitelistInput = document.getElementById('whitelistInput');
    const addButton = document.getElementById('addButton');
    const whitelistList = document.getElementById('whitelistList');
  
    // Check if whitelist is empty and show message (if it is)
    function checkEmptyWhitelist() {
      if (whitelistList.children.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-list';
        emptyMessage.textContent = 'No domains in whitelist';
        whitelistList.appendChild(emptyMessage);
      } else {
        const emptyMessage = whitelistList.querySelector('.empty-list');
        if (emptyMessage) {
          emptyMessage.remove();
        }
      }
    }
  
    chrome.storage.sync.get(['adultProtection', 'whitelist'], (data) => {
      adultToggle.checked = data.adultProtection || false;
      const whitelist = data.whitelist || [];
      
      whitelistList.innerHTML = '';
      
      whitelist.forEach((domain) => addToList(domain));
      
      checkEmptyWhitelist();
    });
  
    adultToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ adultProtection: adultToggle.checked });
    });
  
    addButton.addEventListener('click', () => {
      const domain = whitelistInput.value.trim();
      if (domain) {
        chrome.storage.sync.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          if (!whitelist.includes(domain)) {
            whitelist.push(domain);
            chrome.storage.sync.set({ whitelist }, () => {
              addToList(domain);
              whitelistInput.value = '';
              checkEmptyWhitelist();
            });
          }
        });
      }
    });
  
    // Add Enter key support for the input field for a better UX
    whitelistInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addButton.click();
      }
    });
  
    function addToList(domain) {
      // Rm empty list message if it exists
      const emptyMessage = whitelistList.querySelector('.empty-list');
      if (emptyMessage) {
        emptyMessage.remove();
      }
      
      const li = document.createElement('li');
      
      // Create text
      const domainText = document.createElement('span');
      domainText.textContent = domain;
      li.appendChild(domainText);
      
      // Create remove bttn
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        chrome.storage.sync.get('whitelist', (data) => {
          const whitelist = data.whitelist || [];
          const index = whitelist.indexOf(domain);
          if (index > -1) {
            whitelist.splice(index, 1);
            chrome.storage.sync.set({ whitelist }, () => {
              li.remove();
              checkEmptyWhitelist();
            });
          }
        });
      });
      
      li.appendChild(removeButton);
      whitelistList.appendChild(li);
    }
  });