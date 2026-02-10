import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // 'idle', 'safe', 'danger'

  const scanCurrentTab = async () => {
    // 1. Get the active tab from Chrome
    // We need to query for the 'active' tab in the 'currentWindow'
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab?.url) {
      setUrl(tab.url);
      
      // 2. Mock Logic: simulate a scan
      // (Later, we will replace this with real API calls)
      if (tab.url.includes('google.com')) {
        setStatus('safe');
      } else {
        setStatus('danger');
      }
    }
  }

  return (
    <div style={{ width: '300px', padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2>Trase Scanner</h2>
      
      {/* Show the URL if we have one */}
      {url && (
        <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
          Scanning: <strong>{new URL(url).hostname}</strong>
        </p>
      )}

      {/* The Status Box */}
      {status === 'safe' && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '15px' }}>
          ✅ <strong>SAFE</strong><br/>
          This site is trusted.
        </div>
      )}

      {status === 'danger' && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ <strong>SUSPICIOUS</strong><br/>
          Proceed with caution.
        </div>
      )}

      {/* The Button */}
      <button 
        onClick={scanCurrentTab}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        {status === 'idle' ? 'SCAN SITE' : 'SCAN AGAIN'}
      </button>
    </div>
  )
}

export default App