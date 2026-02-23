import { Link } from 'react-router-dom';
import AttackCard from '../components/AttackCard';
import { attackInfo } from '../data/attackInfo';

const HomePage = () => {
    const attacks = [
        { ...attackInfo['sql-injection'], path: '/attacks/sql-injection' },
        { ...attackInfo['xss'], path: '/attacks/xss' },
        { ...attackInfo['ddos'], path: '/attacks/ddos' },
        { ...attackInfo['brute-force'], path: '/attacks/brute-force' },
        { ...attackInfo['csrf'], path: '/attacks/csrf' },
        { ...attackInfo['mitm'], path: '/attacks/mitm' },
        { ...attackInfo['port-scan'], path: '/attacks/port-scan' },
        { ...attackInfo['path-traversal'], path: '/attacks/path-traversal' }
    ];

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-block mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink rounded-2xl flex items-center justify-center text-6xl animate-pulse-slow">
                        🛡️
                    </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="gradient-text">Firewall Educational Platform</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Learn about cyber attacks and firewall protection through interactive simulations in a safe, controlled environment.
                </p>

                {/* Warning Banner */}
                <div className="glass-card border-2 border-red-500/30 p-6 max-w-2xl mx-auto mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                        <span className="text-3xl">⚠️</span>
                        <h2 className="text-2xl font-bold text-red-400">EDUCATIONAL USE ONLY</h2>
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                        All simulations are sandboxed and safe. This platform is designed to teach cybersecurity concepts responsibly.
                        Do not use this knowledge for malicious purposes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/dashboard" className="cyber-button">
                        View Dashboard
                    </Link>
                    <Link to="/target-site" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        🎯 View Target Site
                    </Link>
                    <Link to="/quiz" className="cyber-button-outline">
                        Test Your Knowledge
                    </Link>
                </div>
            </div>

            {/* Attack Types Grid */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">
                    <span className="gradient-text">Explore Attack Types</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {attacks.map((attack, index) => (
                        <AttackCard key={index} attack={attack} path={attack.path} />
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">🎓</div>
                    <h3 className="text-xl font-bold mb-3 text-white">Learn Interactively</h3>
                    <p className="text-gray-300">
                        Hands-on simulations help you understand how attacks work and how to prevent them.
                    </p>
                </div>
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-xl font-bold mb-3 text-white">Real-Time Monitoring</h3>
                    <p className="text-gray-300">
                        See how firewalls detect and block attacks in real-time with detailed logs and statistics.
                    </p>
                </div>
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold mb-3 text-white">Safe Environment</h3>
                    <p className="text-gray-300">
                        All simulations are completely sandboxed with no actual external security vulnerabilities.
                    </p>
                </div>
                <Link to="/target-site" className="glass-card p-8 text-center border-2 border-orange-500/30 hover:border-orange-500/60 transition-colors group">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                    <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Real Target Site</h3>
                    <p className="text-gray-300">
                        Attacks hit a real vulnerable target website. Watch data get leaked, accounts get locked, and XSS payloads execute!
                    </p>
                    <span className="mt-3 inline-block text-sm text-orange-400 group-hover:text-orange-300">Explore Target Site →</span>
                </Link>
            </div>

            {/* Quick Start Guide */}
            <div className="glass-card p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Quick Start Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                            <span className="bg-cyber-blue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                            Choose an Attack Type
                        </h3>
                        <p className="text-gray-300 ml-11">
                            Select from 8 different cyber attack simulations to learn about.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                            <span className="bg-cyber-blue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                            Run Simulations
                        </h3>
                        <p className="text-gray-300 ml-11">
                            Configure attack parameters and execute simulations to see how they work.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                            <span className="bg-cyber-blue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                            Observe Detection
                        </h3>
                        <p className="text-gray-300 ml-11">
                            Watch how the firewall analyzes, detects, and blocks malicious patterns.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                            <span className="bg-cyber-blue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
                            Learn & Test
                        </h3>
                        <p className="text-gray-300 ml-11">
                            Read educational content and take quizzes to verify your understanding.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
