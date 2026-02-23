const express = require('express');
const cors = require('cors');
const data = require('./data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// DDoS tracking middleware
// Only tracks requests to flood-relevant endpoints, NOT internal /api/* monitoring calls
// ─────────────────────────────────────────────
app.use((req, res, next) => {
  // Exclude internal status/reset/api monitoring routes from DDoS counting
  const excluded = ['/api/status', '/api/reset', '/api/users', '/api/products', '/api/transfer'];
  if (excluded.includes(req.path)) return next();

  const now = Date.now();
  data.requestLog.push(now);
  // Keep only last 10 seconds
  const cutoff = now - 10000;
  while (data.requestLog.length && data.requestLog[0] < cutoff) {
    data.requestLog.shift();
  }
  // If more than 30 requests in last 10 seconds, flag as overwhelmed
  if (data.requestLog.length > 30 && !data.ddosMode) {
    data.ddosMode = true;
    // Clear existing timer and set a fresh one
    if (data.ddosResetTimer) clearTimeout(data.ddosResetTimer);
    data.ddosResetTimer = setTimeout(() => {
      data.ddosMode = false;
      data.requestLog.length = 0;
      data.ddosResetTimer = null;
    }, 12000);
  }
  next();
});


// ─────────────────────────────────────────────
// HOMEPAGE — Visual HTML page showing all site data
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  if (data.ddosMode) {
    return res.status(503).send(`
<!DOCTYPE html>
<html>
<head>
  <title>ShopVictim — Service Unavailable</title>
  <style>
    body { font-family: Arial, sans-serif; background: #1a0000; color: #ff6b6b; text-align: center; padding: 80px 20px; }
    h1 { font-size: 4em; margin-bottom: 20px; }
    p { font-size: 1.5em; color: #ffaaaa; }
    .icon { font-size: 5em; }
  </style>
</head>
<body>
  <div class="icon">⚠️</div>
  <h1>503 — Server Overwhelmed</h1>
  <p>Our server is currently experiencing a DDoS attack and cannot handle your request.</p>
  <p>Too many requests received. Please try again later.</p>
  <p style="color:#ff4444; margin-top:30px;">Active request flood detected: ${data.requestLog.length} requests in the last 10 seconds</p>
</body>
</html>`);
  }

  const commentHtml = data.comments.map(c =>
    `<div class="comment ${c.safe ? '' : 'unsafe-comment'}">
            <strong>${c.author}</strong>: <span class="comment-text">${c.content}</span>
            <span class="date">${c.date}</span>
        </div>`
  ).join('');

  const userRows = data.users.map(u =>
    `<tr>
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td class="sensitive">${data.lockedAccounts[u.username] ? '🔒 LOCKED' : '✅ Active'}</td>
        </tr>`
  ).join('');

  const productRows = data.products.map(p =>
    `<tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
        </tr>`
  ).join('');

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopVictim — Online Store</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; color: #333; }
    header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    header h1 { font-size: 2em; }
    header p { opacity: 0.85; }
    nav { background: #5a67d8; padding: 10px 40px; display: flex; gap: 20px; }
    nav a { color: white; text-decoration: none; font-weight: 500; padding: 5px 10px; border-radius: 4px; transition: background 0.2s; }
    nav a:hover { background: rgba(255,255,255,0.2); }
    .container { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
    .section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .section h2 { color: #5a67d8; margin-bottom: 16px; font-size: 1.4em; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #667eea; color: white; padding: 10px 12px; text-align: left; }
    td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:hover { background: #f7fafc; }
    .sensitive { font-family: monospace; color: #e53e3e; }
    .comment { background: #f7fafc; padding: 10px 16px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #667eea; }
    .unsafe-comment { border-left-color: #e53e3e; background: #fff5f5; }
    .comment strong { color: #5a67d8; }
    .comment .date { color: #a0aec0; font-size: 0.8em; float: right; }
    .search-box { display: flex; gap: 10px; margin-bottom: 16px; }
    .search-box input { flex: 1; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1em; }
    .search-box button { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .search-box button:hover { background: #5a67d8; }
    .warning-banner { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; color: #856404; }
    footer { background: #2d3748; color: white; text-align: center; padding: 20px; margin-top: 40px; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.8em; background: #c6f6d5; color: #276749; }
    .status-locked { background: #fed7d7; color: #c53030; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>🛒 ShopVictim</h1>
      <p>Your Trusted Online Store</p>
    </div>
    <div style="text-align:right; font-size:0.85em; opacity:0.8">
      <div>🟢 Server Status: Online</div>
      <div>👥 ${data.users.length} registered users</div>
      <div>📦 ${data.products.length} products</div>
    </div>
  </header>
  <nav>
    <a href="/">🏠 Home</a>
    <a href="/api/users">👥 Users API</a>
    <a href="/api/products">📦 Products API</a>
    <a href="/api/status">📊 Server Status</a>
  </nav>

  <div class="container">
    <div class="warning-banner">
      ⚠️ <strong>Educational Target:</strong> This website is intentionally vulnerable for cybersecurity training. It contains fake data only.
    </div>

    <!-- Search (SQL Injection vulnerable) -->
    <div class="section">
      <h2>🔍 Product & User Search</h2>
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search products or users... (try SQL injection payloads!)">
        <button onclick="doSearch()">Search</button>
      </div>
      <div id="searchResults"></div>
      <p style="color:#a0aec0; font-size:0.85em">⚠️ This search is vulnerable to SQL Injection — no input sanitization!</p>
    </div>

    <!-- Users Table -->
    <div class="section">
      <h2>👥 Registered Users</h2>
      <table>
        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Account Status</th></tr></thead>
        <tbody>${userRows}</tbody>
      </table>
    </div>

    <!-- Products -->
    <div class="section">
      <h2>📦 Products</h2>
      <table>
        <thead><tr><th>ID</th><th>Product</th><th>Price</th><th>Stock</th><th>Category</th></tr></thead>
        <tbody>${productRows}</tbody>
      </table>
    </div>

    <!-- Comments (XSS vulnerable) -->
    <div class="section">
      <h2>💬 Customer Comments</h2>
      <div id="comments-list">
        ${commentHtml}
      </div>
      <div style="margin-top:16px">
        <input type="text" id="commentAuthor" placeholder="Your name" style="padding:8px 12px; border:2px solid #e2e8f0; border-radius:6px; margin-right:10px; width:150px">
        <input type="text" id="commentText" placeholder="Your comment (XSS vulnerable!)" style="padding:8px 12px; border:2px solid #e2e8f0; border-radius:6px; width:300px; margin-right:10px">
        <button onclick="postComment()" style="padding:8px 18px; background:#667eea; color:white; border:none; border-radius:6px; cursor:pointer">Post</button>
        <p style="color:#e53e3e; font-size:0.8em; margin-top:6px">⚠️ No XSS protection — HTML/JS will be rendered!</p>
      </div>
    </div>

  </div>

  <footer>
    <p>ShopVictim Educational Target Server | Port 3001 | For Cybersecurity Training Only</p>
  </footer>

  <script>
    async function doSearch() {
      const q = document.getElementById('searchInput').value;
      const res = await fetch('/search?q=' + encodeURIComponent(q));
      const data = await res.json();
      const el = document.getElementById('searchResults');
      if (data.results && data.results.length) {
        el.innerHTML = '<pre style="background:#1a202c;color:#68d391;padding:16px;border-radius:8px;overflow:auto">' + JSON.stringify(data, null, 2) + '</pre>';
      } else {
        el.innerHTML = '<p style="color:#a0aec0">No results found for: ' + q + '</p>';
      }
    }

    async function postComment() {
      const author = document.getElementById('commentAuthor').value;
      const content = document.getElementById('commentText').value;
      await fetch('/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
      });
      location.reload();
    }
  </script>
</body>
</html>`);
});

// ─────────────────────────────────────────────
// VULNERABLE: SQL Injection — unsanitized search
// ─────────────────────────────────────────────
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const lower = q.toLowerCase();

  // Detect classic SQL injection patterns
  const sqlPatterns = ["' or '1'='1", "' or 1=1", "or 1=1", "' or '", "1=1", "union select", "drop table", "' --", "admin'--", "'; drop", "select *"];
  const isInjection = sqlPatterns.some(p => lower.includes(p));

  let results;
  let queryExecuted;

  if (isInjection) {
    // Simulate SQL injection success — returns all user data
    results = data.users.map(u => ({ ...u }));
    queryExecuted = `SELECT * FROM users WHERE username='${q}' OR 1=1 -- (injection succeeded!)`;
  } else {
    // Normal search — filter users and products
    const matchedUsers = data.users.filter(u =>
      u.username.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
    ).map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role }));

    const matchedProducts = data.products.filter(p =>
      p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)
    );

    results = [...matchedUsers, ...matchedProducts];
    queryExecuted = `SELECT * FROM users,products WHERE name LIKE '%${q}%'`;
  }

  res.json({
    query: q,
    queryExecuted,
    injectionDetected: isInjection,
    resultCount: results.length,
    results,
    warning: isInjection ? '⚠️ SQL INJECTION SUCCESSFUL! All database records exposed!' : null
  });
});

// ─────────────────────────────────────────────
// VULNERABLE: XSS — stores raw HTML in comments
// ─────────────────────────────────────────────
app.post('/comment', (req, res) => {
  const { author = 'Anonymous', content = '' } = req.body;
  const isMalicious = /<script|javascript:|onerror|onload|alert\s*\(|<img|<iframe/i.test(content);

  const comment = {
    id: data.comments.length + 1,
    author,
    content, // NOT sanitized — raw HTML stored
    date: new Date().toISOString().split('T')[0],
    safe: !isMalicious,
    xssDetected: isMalicious
  };

  data.comments.push(comment);

  res.json({
    success: true,
    message: isMalicious
      ? '⚠️ XSS payload stored! It will execute when viewed.'
      : 'Comment posted successfully.',
    comment,
    xssDetected: isMalicious,
    warning: isMalicious
      ? 'Malicious script stored in database without sanitization!' : null
  });
});

// ─────────────────────────────────────────────
// VULNERABLE: Brute Force — no account lockout by default
// ─────────────────────────────────────────────
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (data.lockedAccounts[username]) {
    return res.status(423).json({
      success: false,
      locked: true,
      message: `🔒 Account '${username}' is locked due to too many failed attempts.`,
      attempts: data.loginAttempts[username] || 0
    });
  }

  const user = data.users.find(u => u.username === username);

  if (!user || user.password !== password) {
    data.loginAttempts[username] = (data.loginAttempts[username] || 0) + 1;
    const attempts = data.loginAttempts[username];

    if (attempts >= 5) {
      data.lockedAccounts[username] = true;
      return res.status(423).json({
        success: false,
        locked: true,
        message: `🔒 Account '${username}' locked after ${attempts} failed attempts!`,
        attempts
      });
    }

    return res.status(401).json({
      success: false,
      locked: false,
      message: `❌ Invalid credentials for '${username}'`,
      attempts,
      remainingAttempts: 5 - attempts,
      warning: attempts >= 3 ? `⚠️ ${5 - attempts} attempts before lockout!` : null
    });
  }

  // Reset on success
  delete data.loginAttempts[username];
  res.json({
    success: true,
    message: `✅ Login successful for '${username}'`,
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_token',
    attempts: 0
  });
});

// ─────────────────────────────────────────────
// VULNERABLE: Path Traversal — naive file path reading
// ─────────────────────────────────────────────
app.get('/file', (req, res) => {
  const filePath = req.query.path || 'readme.txt';
  const traversalPatterns = ['../', '..\\', '%2e%2e', '%2f', '/etc/passwd', 'passwd', 'shadow', 'win.ini', 'boot.ini'];
  const isTraversal = traversalPatterns.some(p => filePath.toLowerCase().includes(p.toLowerCase()));

  if (isTraversal) {
    return res.json({
      success: false,
      blocked: true,
      requestedPath: filePath,
      message: '⚠️ Path traversal attempt detected!',
      simulatedFileContent: filePath.includes('passwd') || filePath.includes('etc')
        ? 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n[...simulated /etc/passwd content]'
        : '[simulated sensitive file content would be exposed here]',
      warning: 'Directory traversal pattern detected in path!'
    });
  }

  const safeFiles = {
    'readme.txt': 'Welcome to ShopVictim! This is the public readme file.',
    'about.txt': 'ShopVictim is an educational e-commerce target server.',
    'terms.txt': 'Terms of service: For educational use only.',
  };

  res.json({
    success: true,
    requestedPath: filePath,
    content: safeFiles[filePath] || `File '${filePath}' not found in public directory.`,
    warning: null
  });
});

// ─────────────────────────────────────────────
// API: Users data
// ─────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  res.json({
    total: data.users.length,
    users: data.users.map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role, address: u.address }))
  });
});

// API: Products
app.get('/api/products', (req, res) => {
  res.json({ total: data.products.length, products: data.products });
});

// API: Status — returns full server state for the main platform
app.get('/api/status', (req, res) => {
  res.json({
    online: true,
    ddosMode: data.ddosMode,
    recentRequestCount: data.requestLog.length,
    totalUsers: data.users.length,
    totalProducts: data.products.length,
    totalComments: data.comments.length,
    unsafeComments: data.comments.filter(c => !c.safe).length,
    lockedAccounts: Object.keys(data.lockedAccounts),
    loginAttempts: data.loginAttempts,
    comments: data.comments,
    recentActivities: [
      data.ddosMode ? '🚨 DDoS attack in progress!' : null,
      Object.keys(data.lockedAccounts).length > 0 ? `🔒 ${Object.keys(data.lockedAccounts).length} account(s) locked` : null,
      data.comments.filter(c => !c.safe).length > 0 ? `⚠️ ${data.comments.filter(c => !c.safe).length} XSS payload(s) stored` : null,
    ].filter(Boolean)
  });
});

// API: Reset state
app.post('/api/reset', (req, res) => {
  data.resetState();
  res.json({ success: true, message: '✅ Target server state reset to default.' });
});

// ─────────────────────────────────────────────
// DDoS flood endpoint — receives flood requests
// ─────────────────────────────────────────────
app.post('/flood', (req, res) => {
  if (data.ddosMode) {
    return res.status(503).json({
      success: false,
      overwhelmed: true,
      message: '💥 Server overwhelmed by DDoS attack! Cannot process request.',
      requestCount: data.requestLog.length
    });
  }
  res.json({
    success: true,
    message: 'Request processed normally',
    requestCount: data.requestLog.length
  });
});

// CSRF vulnerable endpoint
app.post('/api/transfer', (req, res) => {
  const { fromUser, toUser, amount, csrfToken } = req.body;
  if (!csrfToken || csrfToken !== 'VALID_CSRF_TOKEN_12345') {
    return res.status(403).json({
      success: false,
      csrfBlocked: true,
      message: '⚠️ CSRF attack! Invalid or missing CSRF token.',
      attempted: { fromUser, toUser, amount },
      warning: 'Fund transfer blocked due to invalid CSRF token!'
    });
  }
  const sender = data.users.find(u => u.username === fromUser);
  if (!sender) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({
    success: true,
    message: `✅ Transferred $${amount} from ${fromUser} to ${toUser}`,
    transaction: { fromUser, toUser, amount, timestamp: new Date().toISOString() }
  });
});

app.listen(PORT, () => {
  console.log(`\n🎯 Target Victim Server running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${data.users.length} users, ${data.products.length} products`);
  console.log(`⚠️  This server is INTENTIONALLY VULNERABLE for educational purposes\n`);
});

module.exports = app;
