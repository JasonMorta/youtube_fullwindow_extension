chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: handleUrlChange
      });
    }
  });
  
  function handleUrlChange() {
    chrome.runtime.sendMessage({ action: 'urlChanged' });
  }