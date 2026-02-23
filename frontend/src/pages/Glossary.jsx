import { useState } from 'react';

const glossaryTerms = [
    { term: 'Firewall', definition: 'A network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.' },
    { term: 'SQL Injection', definition: 'A code injection technique used to attack data-driven applications by inserting malicious SQL statements into entry fields.' },
    { term: 'XSS (Cross-Site Scripting)', definition: 'A security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.' },
    { term: 'DDoS (Distributed Denial of Service)', definition: 'An attack where multiple compromised systems flood a target with traffic, making it unavailable to legitimate users.' },
    { term: 'Brute Force Attack', definition: 'A trial-and-error method used to obtain information such as passwords by systematically trying all possible combinations.' },
    { term: 'CSRF (Cross-Site Request Forgery)', definition: 'An attack that tricks authenticated users into executing unwanted actions on a web application.' },
    { term: 'MITM (Man-in-the-Middle)', definition: 'An attack where the attacker secretly intercepts and possibly alters communications between two parties.' },
    { term: 'Port Scanning', definition: 'A method used to determine which ports on a network are open and could be receiving or sending data.' },
    { term: 'Path Traversal', definition: 'An attack that allows access to files and directories outside the intended directory by manipulating file paths.' },
    { term: 'Encryption', definition: 'The process of encoding information so that only authorized parties can access it.' },
    { term: 'SSL/TLS', definition: 'Cryptographic protocols designed to provide secure communication over a computer network.' },
    { term: 'Authentication', definition: 'The process of verifying the identity of a user, device, or system.' },
    { term: 'Authorization', definition: 'The process of determining what an authenticated user is allowed to do.' },
    { term: 'Vulnerability', definition: 'A weakness in a system that can be exploited by attackers to gain unauthorized access or cause harm.' },
    { term: 'Exploit', definition: 'A piece of software or technique that takes advantage of a vulnerability to cause unintended behavior.' },
    { term: 'Malware', definition: 'Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.' },
    { term: 'Phishing', definition: 'A social engineering attack where attackers impersonate legitimate entities to steal sensitive information.' },
    { term: 'Botnet', definition: 'A network of compromised computers controlled by an attacker to perform coordinated attacks.' },
    { term: 'Zero-Day', definition: 'A vulnerability that is unknown to the software vendor and has no available patch.' },
    { term: 'Penetration Testing', definition: 'Authorized simulated attacks on a system to identify security weaknesses.' },
    { term: 'WAF (Web Application Firewall)', definition: 'A firewall that monitors, filters, and blocks HTTP traffic to and from a web application.' },
    { term: 'IDS (Intrusion Detection System)', definition: 'A system that monitors network traffic for suspicious activity and alerts administrators.' },
    { term: 'IPS (Intrusion Prevention System)', definition: 'A system that monitors network traffic and can take action to block detected threats.' },
    { term: 'Sandbox', definition: 'An isolated environment where potentially unsafe code can be executed without affecting the host system.' },
    { term: 'Rate Limiting', definition: 'A technique to control the rate of requests sent or received by a system to prevent abuse.' },
    { term: 'Token', definition: 'A piece of data used to authenticate or authorize access to resources.' },
    { term: 'Session Hijacking', definition: 'An attack where an attacker takes over a user\'s session to gain unauthorized access.' },
    { term: 'Cookie', definition: 'Small pieces of data stored by web browsers to remember user information and preferences.' },
    { term: 'HTTPS', definition: 'HTTP Secure - an extension of HTTP that uses encryption for secure communication.' },
    { term: 'Certificate Authority', definition: 'A trusted entity that issues digital certificates to verify identities on the internet.' }
];

const Glossary = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTerms = glossaryTerms.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Cybersecurity Glossary</h1>
                    <p className="text-gray-400">Essential terms and definitions for understanding cybersecurity</p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search terms..."
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 pl-12 text-white focus:border-cyber-blue focus:outline-none"
                        />
                        <span className="absolute left-4 top-4 text-gray-400 text-xl">🔍</span>
                    </div>
                </div>

                {/* Terms List */}
                <div className="space-y-4">
                    {filteredTerms.length > 0 ? (
                        filteredTerms.map((item, index) => (
                            <div key={index} className="glass-card p-6 hover:bg-white/10 transition-all">
                                <h3 className="text-xl font-bold gradient-text mb-2">{item.term}</h3>
                                <p className="text-gray-300">{item.definition}</p>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card p-12 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-gray-400">No terms found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-8 glass-card p-6 text-center">
                    <p className="text-gray-400">
                        Showing <span className="text-cyber-blue font-bold">{filteredTerms.length}</span> of{' '}
                        <span className="text-cyber-blue font-bold">{glossaryTerms.length}</span> terms
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Glossary;
