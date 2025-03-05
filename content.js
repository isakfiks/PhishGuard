// Listen for messages coming from the background js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractDetails') {
    const title = document.title || '';
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = metaDescription ? metaDescription.getAttribute('content') : '';
    sendResponse({ title, description });
    return true; 
  } else if (message.action === 'showPhishingWarning') {
    showNotification('⚠️ Warning: This site may be unsafe!', 'danger');
  } else if (message.action === 'showSafeNotification') {
    showNotification('✅ This site appears to be safe', 'success');
  } else if (message.action === 'showAdultWarning') {
    showNotification('🔞 Adult content detected', 'warning');
  } else if (message.action === 'showWhitelistedNotification') {
    showNotification('✓ Trusted site (whitelisted)', 'whitelisted');
  }
});

function showNotification(message, type) {
  // Remove any previous notifi
  const existingNotification = document.getElementById('phishguard-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create the notifi element
  const notification = document.createElement('div');
  notification.id = 'phishguard-notification';
  notification.textContent = message;

  // Styling
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontSize = '14px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
  if (type === 'danger') {
    notification.style.backgroundColor = '#ef4444';
    notification.style.color = 'white';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#f59e0b';
    notification.style.color = 'white';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#10b981';
    notification.style.color = 'white';
  } else if (type === 'whitelisted') {
    notification.style.backgroundColor = '#3b82f6';
    notification.style.color = 'white';
  }
  
  // Add close bttn
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  closeButton.style.marginLeft = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontWeight = 'bold';
  closeButton.onclick = () => notification.remove();
  notification.appendChild(closeButton);
  
  // Add to the page
  document.body.appendChild(notification);
  
  // Auto delete after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}