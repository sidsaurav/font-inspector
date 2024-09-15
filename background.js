// background.js

let isActive = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed and activated.");
});

chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;

  // Send a message to the content script to start or stop font inspection
  chrome.tabs.sendMessage(tab.id, {
    action: isActive ? "startInspection" : "stopInspection",
  });
});
