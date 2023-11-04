chrome.runtime.onInstalled.addListener(function () {
    // Initialize blocked websites with an empty array
    chrome.storage.sync.set({ blockedWebsites: [] });
  });
  