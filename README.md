# 🛡️ Trase Phishing Scanner
A real-time security tool designed to protect users from malicious websites and social engineering attacks.

### 👥 The Team
**Jordan Benzon, James Mallari, Jayden Tumboken, James Suba**

---

## 🚀 Overview
Trase is a Google Chrome extension built to bridge the gap between user browsing and enterprise-grade security intelligence. By leveraging live threat databases, Trase identifies and flags malicious URLs before they can compromise user data.

## 🛠️ Technical Stack
* **Framework**: React + Vite for a high-performance, reactive UI.
* **Runtime**: Node.js environment.
* **API**: Integrated Google Safe Browsing API for real-time malware and social engineering detection.
* **Security**: Implemented environment variable protection (`.env`) to secure sensitive API credentials.

## ✨ Key Features
* **Live Database Querying**: Instantly checks the current tab against Google's global blocklist.
* **Dynamic UI States**: Real-time visual feedback (Scanning, Safe, and Malicious alerts).
* **Heuristic Preparedness**: Structure built to support future HTML-based "Content Script" scanning.

## 🔧 Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/jam3s320/Trase.git](https://github.com/jam3s320/Trase.git)git add .