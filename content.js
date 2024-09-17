// content.js

let tooltip = null;
let infoBox = null;
let statusBanner = null; // Status banner to indicate inspection is active
let lastElement = null;
let copyMessage = null; // Message to display when CSS is copied

function initTooltip() {
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "font-inspector-tooltip";
    tooltip.style.position = "fixed";
    tooltip.style.backgroundColor = "rgba(50, 50, 50, 0.9)";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.zIndex = "10000";
    tooltip.style.fontSize = "14px";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "normal";
    tooltip.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.2s ease-in-out";
    tooltip.style.maxWidth = "300px";
    document.body.appendChild(tooltip);
  }
}

function initInfoBox() {
  if (!infoBox) {
    infoBox = document.createElement("div");
    infoBox.id = "font-inspector-info-box";
    infoBox.style.position = "fixed";
    infoBox.style.backgroundColor = "#fff";
    infoBox.style.color = "#000";
    infoBox.style.padding = "20px";
    infoBox.style.border = "1px solid #ccc";
    infoBox.style.borderRadius = "8px";
    infoBox.style.zIndex = "10000";
    infoBox.style.fontSize = "14px";
    infoBox.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    infoBox.style.display = "none";
    infoBox.style.width = "400px";
    infoBox.style.maxHeight = "80%";
    infoBox.style.overflowY = "auto";
    infoBox.style.boxSizing = "border-box";
    infoBox.style.fontFamily = "Arial, sans-serif";
    infoBox.style.pointerEvents = "auto";
    document.body.appendChild(infoBox);
  }
}

function initStatusBanner() {
  if (!statusBanner) {
    statusBanner = document.createElement("div");
    statusBanner.id = "font-inspector-status-banner";
    statusBanner.style.position = "fixed";
    statusBanner.style.bottom = "20px";
    statusBanner.style.right = "20px";
    statusBanner.style.padding = "10px 20px";
    statusBanner.style.backgroundColor = "#ff6347"; // Tomato color
    statusBanner.style.color = "#fff";
    statusBanner.style.fontSize = "14px";
    statusBanner.style.borderRadius = "8px";
    statusBanner.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    statusBanner.style.zIndex = "10001";
    statusBanner.style.pointerEvents = "none"; // Prevent interaction
    statusBanner.innerHTML = `
      Font Inspection Active<br>
      <small>Press <strong>Esc</strong> to exit</small>
    `;
    document.body.appendChild(statusBanner);
  }
}

function injectStyles() {
  if (!document.getElementById("font-inspector-styles")) {
    const style = document.createElement("style");
    style.id = "font-inspector-styles";
    style.textContent = `
      .font-inspector-highlight {
        transition: background-color 0.2s ease-in-out;
      }
      #font-inspector-info-box ul.font-properties {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      #font-inspector-info-box ul.font-properties li {
        margin-bottom: 8px;
      }
      #font-inspector-info-box button.copy-button {
        margin-top: 10px;
        padding: 8px 12px;
        font-size: 13px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      #font-inspector-info-box button.copy-button:hover {
        background-color: #0056b3;
      }
      #font-inspector-info-box h2 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 18px;
        color: #333;
      }
      #font-inspector-info-box .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #888;
      }
      #font-inspector-info-box .close-button:hover {
        color: #000;
      }
      #font-inspector-tooltip,
      #font-inspector-info-box {
        pointer-events: none;
      }
      #font-inspector-info-box {
        pointer-events: auto;
      }
      /* Cursor style for font inspection mode */
      body.font-inspector-active,
      body.font-inspector-active * {
        cursor: help !important;
      }
      #copy-message {
        margin-top: 10px;
        color: green;
        font-size: 12px;
        display: none; /* Hidden by default */
      }
      #positionInfoBox, #positionInfoBox:hover {
          cursor: default;    
      }
    `;
    document.head.appendChild(style);
  }
}

function inspectFont(event) {
  const target = event.target;

  if (isInspectorElement(target)) return;

  if (target && target.nodeType === Node.ELEMENT_NODE) {
    initTooltip();
    const computedStyle = window.getComputedStyle(target);
    let fontStyle = computedStyle.fontFamily;
    const fontSize = computedStyle.fontSize;
    const fontColor = rgbToHex(computedStyle.color);

    let fontList = fontStyle.split(",");
    if (fontList.length > 3) {
      fontList = fontList.slice(0, 3);
      fontStyle = fontList.join(", ") + ", ...";
    }

    tooltip.innerHTML = `
      <div style="text-align: left;">
        <strong>Font Family:</strong> ${fontStyle}<br>
        <strong>Font Size:</strong> ${fontSize}<br>
        <strong>Color:</strong> ${fontColor}
        <span style="display:inline-block; width:16px; height:16px; background-color:${fontColor}; border:1px solid #000; margin-left:10px;"></span>
      </div>
    `;

    showTooltip(event);

    if (lastElement && lastElement !== target) {
      removeHighlight(lastElement);
    }

    highlightElement(target);

    lastElement = target;
  }
}

function showDetailedInfo(event) {
  const target = event.target;

  if (isInspectorElement(target)) return;

  if (target && target.nodeType === Node.ELEMENT_NODE) {
    event.preventDefault();
    event.stopPropagation();

    initInfoBox();
    injectStyles();

    const computedStyle = window.getComputedStyle(target);

    const fontProperties = {
      "Font Family": computedStyle.fontFamily,
      "Font Size": computedStyle.fontSize,
      Color: rgbToHex(computedStyle.color),
      "Line Height": computedStyle.lineHeight,
      "Font Weight": computedStyle.fontWeight,
      "Font Style": computedStyle.fontStyle,
      "Font Variant": computedStyle.fontVariant,
      "Letter Spacing": computedStyle.letterSpacing,
      "Text Transform": computedStyle.textTransform,
    };

    const cssProperties = {
      "font-family": computedStyle.fontFamily,
      "font-size": computedStyle.fontSize,
      color: computedStyle.color,
      "line-height": computedStyle.lineHeight,
      "font-weight": computedStyle.fontWeight,
      "font-style": computedStyle.fontStyle,
      "font-variant": computedStyle.fontVariant,
      "letter-spacing": computedStyle.letterSpacing,
      "text-transform": computedStyle.textTransform,
      "text-decoration": computedStyle.textDecoration,
    };

    // Generate the correct URL for the SVG icon
    const copyIconUrl = chrome.runtime.getURL("assets/copy.svg");

    let infoContent = '<h2>Font Properties</h2><ul class="font-properties">';
    for (const [propName, propValue] of Object.entries(fontProperties)) {
      if (propName === "Color") {
        infoContent += `
            <li >
              <strong>${propName}:</strong> ${propValue}
              <span style="display:inline-block; width:16px; height:16px; background-color:${propValue}; border:1px solid #000; margin-left:10px;"></span>
              <button id="copyColorButton" style="background:none;border:none;cursor:pointer;margin-left:5px;">
                <img src="${copyIconUrl}" alt="Copy color" style="width:16px; height:16px;">
              </button>
              <span id="color-copy-message" style="color: green; font-size: 12px; display: none; margin-left: 5px;">Color Copied!</span>
            </li>`;
      } else {
        infoContent += `<li><strong>${propName}:</strong> ${propValue}</li>`;
      }
    }
    infoContent += "</ul>";

    infoBox.innerHTML = infoContent;

    // Event listener for copying the color
    document.getElementById("copyColorButton").addEventListener("click", () => {
      copyToClipboard(fontProperties["Color"]);
      showColorCopyMessage();
    });

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy CSS";
    copyButton.className = "copy-button";
    copyButton.addEventListener("click", () => {
      const cssCode = convertToCSS(cssProperties);
      copyToClipboard(cssCode);
      showCopyMessage();
    });
    infoBox.appendChild(copyButton);

    // Close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.className = "close-button";
    closeButton.addEventListener("click", () => {
      infoBox.style.display = "none";
    });
    infoBox.appendChild(closeButton);

    // Message for "CSS Copied!"
    copyMessage = document.createElement("div");
    copyMessage.id = "copy-message";
    copyMessage.textContent = "CSS Copied!";
    infoBox.appendChild(copyMessage);
    infoBox.style.display = "block";

    positionInfoBox(event);
  }
}

function showColorCopyMessage() {
  const colorCopyMessage = document.getElementById("color-copy-message");
  colorCopyMessage.style.display = "inline"; // Show the "Color Copied!" message
}

function showCopyMessage() {
  copyMessage.style.display = "block"; // Show the "CSS Copied!" message
}

function positionInfoBox(event) {
  const clickX = event.clientX;
  const clickY = event.clientY;

  const infoBoxWidth = infoBox.offsetWidth;
  const infoBoxHeight = infoBox.offsetHeight;
  let left = clickX;
  let top = clickY;

  if (left + infoBoxWidth > window.innerWidth) {
    left = window.innerWidth - infoBoxWidth - 20;
  }
  if (top + infoBoxHeight > window.innerHeight) {
    top = window.innerHeight - infoBoxHeight - 20;
  }

  infoBox.style.left = `${left}px`;
  infoBox.style.top = `${top}px`;

  infoBox.style.transform = "";
}

function convertToCSS(properties) {
  return Object.entries(properties)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Could not copy text: ", err);
  });
}

function showTooltip(event) {
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  let top = event.clientY + 15;
  let left = event.clientX + 15;

  if (left + tooltipWidth > window.innerWidth) {
    left = event.clientX - tooltipWidth - 15;
  }
  if (top + tooltipHeight > window.innerHeight) {
    top = event.clientY - tooltipHeight - 15;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

function hideTooltip(event) {
  if (tooltip) {
    tooltip.style.opacity = "0";
    setTimeout(() => {
      tooltip.style.display = "none";
    }, 200);
  }
  if (lastElement) {
    removeHighlight(lastElement);
    lastElement = null;
  }
}

function highlightElement(element) {
  injectStyles();
  element.classList.add("font-inspector-highlight");

  if (!element._originalBackgroundColor) {
    element._originalBackgroundColor = element.style.backgroundColor;
  }
  element.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
}

function removeHighlight(element) {
  if (element._originalBackgroundColor !== undefined) {
    element.style.backgroundColor = element._originalBackgroundColor;
    delete element._originalBackgroundColor;
  } else {
    element.style.backgroundColor = "";
  }
  element.classList.remove("font-inspector-highlight");
}

function isInspectorElement(element) {
  return (
    element.id === "font-inspector-tooltip" ||
    element.id === "font-inspector-info-box" ||
    element.closest("#font-inspector-tooltip") ||
    element.closest("#font-inspector-info-box")
  );
}

function startFontInspection() {
  injectStyles();
  initStatusBanner(); // Show status banner when inspection starts
  document.addEventListener("mouseover", inspectFont);
  document.addEventListener("mousemove", showTooltip);
  document.addEventListener("mouseout", hideTooltip);
  document.addEventListener("click", showDetailedInfo, true);

  document.addEventListener("keydown", handleKeydown);

  document.body.classList.add("font-inspector-active");

  console.log("Font Inspection Enabled");
}

function stopFontInspection() {
  document.removeEventListener("mouseover", inspectFont);
  document.removeEventListener("mousemove", showTooltip);
  document.removeEventListener("mouseout", hideTooltip);
  document.removeEventListener("click", showDetailedInfo, true);
  document.removeEventListener("keydown", handleKeydown);

  hideTooltip();
  if (infoBox) {
    infoBox.style.display = "none";
  }

  if (statusBanner) {
    statusBanner.remove(); // Remove the status banner when inspection stops
    statusBanner = null;
  }

  document.body.classList.remove("font-inspector-active");

  console.log("Font Inspection Disabled");
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    stopFontInspection();
  }
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return (
    "#" +
    (
      (1 << 24) +
      (parseInt(result[0]) << 16) +
      (parseInt(result[1]) << 8) +
      parseInt(result[2])
    )
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startInspection") {
    startFontInspection();
  } else if (message.action === "stopInspection") {
    stopFontInspection();
  }
});
