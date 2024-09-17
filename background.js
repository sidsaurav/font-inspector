// background.js

let isActive = false;

// Create the context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "inspectFont",
    title: "Inspect Font",
    contexts: ["all"], // This makes it available on all elements
  });

  console.log("Service worker installed and activated.");
});

// Toggle font inspection when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  isActive = !isActive;

  chrome.tabs.sendMessage(tab.id, {
    action: isActive ? "startInspection" : "stopInspection",
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "inspectFont") {
    // Send a message to the content script to start font inspection
    chrome.tabs.sendMessage(tab.id, { action: "startInspection" });
  }
});
