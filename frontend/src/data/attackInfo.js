export const attackInfo = {
    'sql-injection': {
        name: 'SQL Injection',
        icon: '💉',
        description: 'SQL Injection is a code injection technique that exploits security vulnerabilities in an application\'s database layer.',
        howItWorks: 'Attackers insert malicious SQL statements into entry fields, manipulating the database to reveal sensitive information, modify data, or execute administrative operations.',
        realWorldExample: 'In 2008, Heartland Payment Systems suffered a massive SQL injection attack that compromised 130 million credit card numbers, making it one of the largest data breaches in history.',
        prevention: [
            'Use parameterized queries (prepared statements)',
            'Implement input validation and sanitization',
            'Use ORM (Object-Relational Mapping) frameworks',
            'Apply principle of least privilege for database accounts',
            'Regularly update and patch database systems'
        ],
        detection: [
            'Monitor for SQL keywords in user inputs (UNION, SELECT, DROP, etc.)',
            'Detect unusual database query patterns',
            'Implement Web Application Firewalls (WAF)',
            'Log and analyze all database queries',
            'Use intrusion detection systems'
        ],
        severity: 'critical',
        codeExample: `// Vulnerable code:
const query = "SELECT * FROM users WHERE username = '" + userInput + "'";

// Safe code:
const query = "SELECT * FROM users WHERE username = ?";
db.execute(query, [userInput]);`
    },
    'xss': {
        name: 'Cross-Site Scripting (XSS)',
        icon: '🔗',
        description: 'XSS attacks inject malicious scripts into trusted websites, which are then executed in victims\' browsers.',
        howItWorks: 'Attackers inject client-side scripts into web pages viewed by other users, stealing cookies, session tokens, or other sensitive information.',
        realWorldExample: 'In 2018, British Airways suffered an XSS attack that compromised 380,000 payment card details by injecting malicious JavaScript into their website.',
        prevention: [
            'Encode all user-generated content before rendering',
            'Implement Content Security Policy (CSP) headers',
            'Use HTTPOnly and Secure flags on cookies',
            'Validate and sanitize all inputs',
            'Use modern frameworks with built-in XSS protection'
        ],
        detection: [
            'Scan for <script> tags and JavaScript event handlers',
            'Monitor for encoded malicious payloads',
            'Detect suspicious URL parameters',
            'Implement input pattern matching',
            'Use automated security scanning tools'
        ],
        severity: 'high',
        codeExample: `// Vulnerable code:
element.innerHTML = userInput;

// Safe code:
element.textContent = userInput;
// Or use DOMPurify library
element.innerHTML = DOMPurify.sanitize(userInput);`
    },
    'ddos': {
        name: 'DDoS Attack',
        icon: '🌊',
        description: 'Distributed Denial of Service attacks overwhelm systems with traffic from multiple sources, making services unavailable.',
        howItWorks: 'Attackers use botnets to flood a target with massive amounts of traffic, exhausting bandwidth, server resources, or application capacity.',
        realWorldExample: 'In 2016, the Mirai botnet launched a massive DDoS attack against Dyn DNS, taking down major websites including Twitter, Netflix, and Reddit for several hours.',
        prevention: [
            'Implement rate limiting and throttling',
            'Use CDN and load balancers',
            'Deploy DDoS mitigation services',
            'Increase bandwidth and server capacity',
            'Implement traffic filtering and blacklisting'
        ],
        detection: [
            'Monitor for sudden traffic spikes',
            'Analyze request patterns and sources',
            'Track connection rates per IP',
            'Detect abnormal protocol usage',
            'Use anomaly detection systems'
        ],
        severity: 'critical',
        codeExample: `// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests'
});

app.use('/api/', limiter);`
    },
    'brute-force': {
        name: 'Brute Force Attack',
        icon: '🔨',
        description: 'Brute force attacks systematically try all possible password combinations until the correct one is found.',
        howItWorks: 'Attackers use automated tools to rapidly attempt numerous username/password combinations to gain unauthorized access.',
        realWorldExample: 'In 2014, iCloud accounts were compromised through brute force attacks on the "Find My iPhone" service, which lacked rate limiting.',
        prevention: [
            'Implement account lockout after failed attempts',
            'Use CAPTCHA after multiple failures',
            'Enforce strong password policies',
            'Implement multi-factor authentication (MFA)',
            'Add delays between login attempts'
        ],
        detection: [
            'Monitor failed login attempt frequency',
            'Track login attempts per username/IP',
            'Detect rapid successive login requests',
            'Analyze login patterns and timing',
            'Implement honeypot accounts'
        ],
        severity: 'high',
        codeExample: `// Brute force protection
const loginAttempts = new Map();

function checkBruteForce(username) {
  const attempts = loginAttempts.get(username) || 0;
  if (attempts >= 5) {
    throw new Error('Account locked');
  }
  loginAttempts.set(username, attempts + 1);
}`
    },
    'csrf': {
        name: 'Cross-Site Request Forgery (CSRF)',
        icon: '🎭',
        description: 'CSRF tricks authenticated users into executing unwanted actions on web applications.',
        howItWorks: 'Attackers craft malicious requests that appear to come from legitimate users, exploiting the trust a website has in the user\'s browser.',
        realWorldExample: 'In 2008, a CSRF vulnerability in YouTube allowed attackers to perform actions on behalf of logged-in users, including adding videos to favorites.',
        prevention: [
            'Use anti-CSRF tokens in forms',
            'Implement SameSite cookie attribute',
            'Verify Origin and Referer headers',
            'Require re-authentication for sensitive actions',
            'Use custom request headers'
        ],
        detection: [
            'Validate CSRF tokens on all state-changing requests',
            'Check for missing or invalid tokens',
            'Monitor for suspicious cross-origin requests',
            'Analyze request patterns',
            'Implement logging for token validation failures'
        ],
        severity: 'high',
        codeExample: `// CSRF protection
const csrfToken = generateToken();

// In form:
<input type="hidden" name="csrf_token" value="\${csrfToken}">

// Server validation:
if (req.body.csrf_token !== req.session.csrfToken) {
  throw new Error('Invalid CSRF token');
}`
    },
    'mitm': {
        name: 'Man-in-the-Middle (MITM)',
        icon: '👤',
        description: 'MITM attacks intercept communications between two parties to eavesdrop or modify data in transit.',
        howItWorks: 'Attackers position themselves between the client and server, intercepting and potentially altering communications without either party knowing.',
        realWorldExample: 'In 2011, DigiNotar, a Dutch certificate authority, was compromised, allowing attackers to issue fraudulent SSL certificates for MITM attacks against Google users.',
        prevention: [
            'Use HTTPS/TLS for all communications',
            'Implement certificate pinning',
            'Use VPNs on untrusted networks',
            'Enable HSTS (HTTP Strict Transport Security)',
            'Verify SSL/TLS certificates'
        ],
        detection: [
            'Monitor for invalid SSL certificates',
            'Detect certificate changes',
            'Analyze encryption protocol downgrades',
            'Check for unexpected certificate authorities',
            'Implement certificate transparency monitoring'
        ],
        severity: 'critical',
        codeExample: `// HTTPS enforcement
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

// HSTS header
app.use(helmet.hsts({ maxAge: 31536000 }));`
    },
    'port-scan': {
        name: 'Port Scanning',
        icon: '🔍',
        description: 'Port scanning is a reconnaissance technique used to discover open ports and services on a network.',
        howItWorks: 'Attackers probe a server or host for open ports to identify potential vulnerabilities and entry points for attacks.',
        realWorldExample: 'Port scanning is often the first step in targeted attacks. The 2017 Equifax breach began with reconnaissance that identified vulnerable Apache Struts servers.',
        prevention: [
            'Use firewalls to filter unnecessary ports',
            'Implement port knocking',
            'Disable unused services and ports',
            'Use intrusion detection systems',
            'Implement network segmentation'
        ],
        detection: [
            'Monitor for sequential port access attempts',
            'Detect connections to multiple ports from single IP',
            'Analyze connection patterns and timing',
            'Use honeypots to detect scanning',
            'Implement threshold-based alerting'
        ],
        severity: 'medium',
        codeExample: `// Port scan detection
const portAccess = new Map();

function detectPortScan(ip, port) {
  const key = ip;
  const ports = portAccess.get(key) || [];
  ports.push({ port, time: Date.now() });
  
  if (ports.length > 5) {
    alert('Port scan detected from ' + ip);
  }
  portAccess.set(key, ports);
}`
    },
    'path-traversal': {
        name: 'Path Traversal',
        icon: '📁',
        description: 'Path traversal attacks access files and directories outside the intended directory structure.',
        howItWorks: 'Attackers manipulate file paths using sequences like "../" to access restricted files, potentially exposing sensitive data or system files.',
        realWorldExample: 'In 2019, a path traversal vulnerability in Cisco\'s RV110W routers allowed attackers to download sensitive configuration files.',
        prevention: [
            'Validate and sanitize all file path inputs',
            'Use whitelists for allowed files/directories',
            'Implement proper access controls',
            'Avoid using user input in file paths',
            'Use chroot jails or sandboxing'
        ],
        detection: [
            'Scan for "../" and "..\\" patterns',
            'Monitor for encoded traversal sequences',
            'Detect access to system directories',
            'Analyze file access patterns',
            'Implement file access logging'
        ],
        severity: 'high',
        codeExample: `// Path traversal prevention
const path = require('path');

function sanitizePath(userPath) {
  const safePath = path.normalize(userPath).replace(/^(\\.\\.\\/)+/, '');
  const fullPath = path.join(__dirname, 'uploads', safePath);
  
  if (!fullPath.startsWith(path.join(__dirname, 'uploads'))) {
    throw new Error('Invalid path');
  }
  return fullPath;
}`
    }
};
