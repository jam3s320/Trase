import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // 'idle', 'scanning', 'safe', 'danger', 'error'

  const checkSafeBrowsing = async (targetUrl) => {
    setStatus('scanning');
    
    // Grab the key from your .env file
    const API_KEY = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_KEY;
    
    if (!API_KEY) {
      console.error("Missing API Key!");
      setStatus('error');
      return;
    }

    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    // Google's required request format
    const requestBody = {
      client: {
        clientId: "trase-extension",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: targetUrl }]
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      // If Google returns an object with "matches", it found a threat.
      if (data && data.matches && data.matches.length > 0) {
        setStatus('danger');
      } else {
        setStatus('safe');
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      setStatus('error');
    }
  };

  const scanCurrentTab = async () => {
    // Get the active tab from Chrome
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab?.url) {
      setUrl(tab.url);
      
      // Ignore system pages
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
        setStatus('safe');
        return;
      }

      await checkSafeBrowsing(tab.url);
    }
  }

  return (
    <div style={{ width: '300px', padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2>Trase Scanner</h2>
      
      {url && (
        <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
          Scanning: <strong>{new URL(url).hostname}</strong>
        </p>
      )}

      {status === 'scanning' && (
        <div style={{ padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '5px', marginBottom: '15px' }}>
          ⏳ Checking databases...
        </div>
      )}

      {status === 'safe' && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '15px' }}>
          ✅ <strong>SAFE</strong><br/>No threats detected.
        </div>
      )}

      {status === 'danger' && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ <strong>MALICIOUS SITE</strong><br/>Google flagged this as dangerous!
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '5px', marginBottom: '15px' }}>
          ❌ <strong>ERROR</strong><br/>Could not connect to scanner.
        </div>
      )}

      <button 
        onClick={scanCurrentTab}
        disabled={status === 'scanning'}
        style={{
          padding: '10px 20px', fontSize: '16px', cursor: status === 'scanning' ? 'wait' : 'pointer',
          backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px',
          opacity: status === 'scanning' ? 0.7 : 1
        }}
      >
        {status === 'idle' ? 'SCAN SITE' : 'SCAN AGAIN'}
      </button>
    </div>
  )
}

export default App