# 🛡️ Firewall Educational Platform

An interactive educational web application where you can simulate real cyber attacks against a **live vulnerable target website** and see genuine HTTP responses — all in a safe, sandboxed environment.

## ⚠️ IMPORTANT DISCLAIMER

**THIS APPLICATION IS FOR EDUCATIONAL PURPOSES ONLY**

- All attack simulations target an intentionally vulnerable local server containing only fake data
- No real systems are harmed — all data is synthetic
- Do NOT use the knowledge gained here for malicious purposes
- Unauthorized access to computer systems is illegal
- Learn responsibly and pursue ethical cybersecurity careers

---

## 🎯 Features

### 🎯 Real Target Website (ShopVictim)
A fully operational fake e-commerce site (`localhost:3001`) with intentional vulnerabilities:
- **6 fake users** with usernames, passwords, credit cards
- **8 products**, blog posts, and a comment section
- Attacks actually hit this server and return real HTTP responses

### Attack Simulations (8 Types)
| Attack | What Happens on Target |
|---|---|
| **SQL Injection** | Returns all user records including passwords |
| **XSS** | Stores raw HTML/JS payloads in comment database |
| **DDoS** | Server enters overwhelmed mode, responds 503 |
| **Brute Force** | Tracks failed logins, locks account after 5 attempts |
| **CSRF** | Blocks fund transfers with invalid tokens |
| **MITM** | User data intercepted over unencrypted channel |
| **Port Scan** | Shows open ports on target host |
| **Path Traversal** | Simulates `/etc/passwd` file exposure |

### 🖥️ Target Site Dashboard (`/target-site`)
Live view of the target server's current state — locked accounts, stored XSS payloads, DDoS status, and an embedded iframe preview that auto-reloads when attacks trigger state changes.

### Interactive Dashboard
- Real-time attack monitoring and history logs
- Live charts and color-coded threat levels

### Educational Content
- Detailed explanations per attack type
- Prevention techniques and real-world examples
- Interactive quiz module and cybersecurity glossary

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm

### Installation

```bash
# 1. Clone the repo
git clone <repository-url>
cd Firewall

# 2. Install all dependencies (frontend + backend + target-server)
npm run install-all

# 3. Set up backend environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your MongoDB URI
```

**`backend/.env`:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/firewall-edu
NODE_ENV=development
```

> 💡 **MongoDB Atlas**: Replace the URI with your Atlas connection string.

### Start

```bash
npm run dev
```

This starts **3 servers simultaneously**:

| Server | URL | Purpose |
|---|---|---|
| Frontend | `http://localhost:5173` | React UI (main platform) |
| Backend API | `http://localhost:5001` | Express + MongoDB |
| Target Server | `http://localhost:3001` | ShopVictim (victim site) |

Open **`http://localhost:5173`** in your browser.

---

## 📁 Project Structure

```
Firewall/
├── frontend/               # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/     # AttackSimulator, TargetPanel, etc.
│       ├── pages/
│       │   ├── attacks/    # 8 attack simulation pages
│       │   └── TargetSite.jsx  # Live target state dashboard
│       └── utils/
├── backend/                # Node.js + Express API (port 5001)
│   ├── routes/             # attacks.js, firewall.js, logs.js
│   ├── models/             # MongoDB models
│   ├── middleware/         # Firewall detection rules
│   └── config/
├── target-server/          # ShopVictim vulnerable site (port 3001)
│   ├── server.js           # Express server with intentional vulns
│   └── data.js             # Fake seed data (users, products, etc.)
└── package.json            # Root — runs all 3 servers with one command
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, Winston
- **Target Server**: Express (no database — in-memory state)
- **Security**: Helmet, CORS, express-rate-limit

---

## 📄 License

MIT License

---

**Remember: Use this knowledge ethically and legally. Cybersecurity skills should be used to protect, not to harm.**
