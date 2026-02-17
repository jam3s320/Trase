console.log("Trase Content Script Loaded!");

// 1. Create the floating button
const scanBtn = document.createElement('button');
scanBtn.innerText = '🔍 Scan Highlighted Link';
scanBtn.style.position = 'absolute';
scanBtn.style.display = 'none'; // Hidden by default
scanBtn.style.zIndex = '999999'; 
scanBtn.style.padding = '8px 12px';
scanBtn.style.backgroundColor = '#1a73e8'; // A nice Google-style blue
scanBtn.style.color = 'white';
scanBtn.style.border = 'none';
scanBtn.style.borderRadius = '6px';
scanBtn.style.cursor = 'pointer';
scanBtn.style.fontSize = '14px';
scanBtn.style.fontWeight = 'bold';
scanBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

document.body.appendChild(scanBtn);

let currentUrlToScan = "";

// 2. Watch for when the user finishes clicking/highlighting (Mouse Up)
document.addEventListener('mouseup', (event) => {
    // Don't trigger if they are just clicking the button itself
    if (event.target === scanBtn) return;

    // Grab whatever text the user just highlighted
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // If they actually highlighted something
    if (selectedText.length > 0) {
        // Figure out if the highlighted text is inside a link (<a> tag)
        let node = selection.anchorNode;
        let element = node.nodeType === 3 ? node.parentElement : node; // Handle text nodes safely
        let linkElement = element.closest('a');

        let urlFound = "";

        if (linkElement && linkElement.href) {
            // They highlighted text inside a real link
            urlFound = linkElement.href;
        } else if (selectedText.startsWith('http') || selectedText.includes('.com')) {
            // They highlighted plain text that looks like a URL
            urlFound = selectedText.startsWith('http') ? selectedText : 'https://' + selectedText;
        }

        // If we found a URL from their highlight, show the button!
        if (urlFound) {
            currentUrlToScan = urlFound;

            // Get the coordinates of the highlighted text so we can put the button near it
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Position the button right below their highlight
            scanBtn.style.left = `${window.scrollX + rect.left}px`;
            scanBtn.style.top = `${window.scrollY + rect.bottom + 10}px`;
            scanBtn.style.display = 'block';
            
            // Reset button look
            scanBtn.innerText = '🔍 Scan Link';
            scanBtn.style.backgroundColor = '#1a73e8';
        } else {
            scanBtn.style.display = 'none';
        }
    } else {
        // Nothing highlighted (they just clicked normally), hide the button
        scanBtn.style.display = 'none';
    }
});

// 3. Hide button immediately when they click anywhere else (Mouse Down)
document.addEventListener('mousedown', (event) => {
    if (event.target !== scanBtn) {
        scanBtn.style.display = 'none';
    }
});

// 4. When the user clicks our injected button
scanBtn.addEventListener('click', (event) => {
    event.preventDefault(); 
    event.stopPropagation();
    
    if (currentUrlToScan) {
        scanBtn.innerText = 'Scanning...';
        
        // MOCK LOGIC: Pretend to scan it
        setTimeout(() => {
            if (currentUrlToScan.includes('evil.com') || currentUrlToScan.includes('badsite')) {
                scanBtn.innerText = '⚠️ DANGER';
                scanBtn.style.backgroundColor = '#dc3545'; // Red
            } else {
                scanBtn.innerText = '✅ SAFE';
                scanBtn.style.backgroundColor = '#28a745'; // Green
            }
        }, 500); 
    }
});