import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import SqlInjectionPage from './pages/attacks/SqlInjectionPage';
import XssPage from './pages/attacks/XssPage';
import DdosPage from './pages/attacks/DdosPage';
import BruteForcePage from './pages/attacks/BruteForcePage';
import CsrfPage from './pages/attacks/CsrfPage';
import MitmPage from './pages/attacks/MitmPage';
import PortScanPage from './pages/attacks/PortScanPage';
import PathTraversalPage from './pages/attacks/PathTraversalPage';
import Quiz from './pages/Quiz';
import Glossary from './pages/Glossary';
import TargetSite from './pages/TargetSite';

function App() {
    return (
        <Router>
            <div className="min-h-screen cyber-grid-bg">
                {/* Navigation */}
                <nav className="glass-card sticky top-0 z-50 border-b border-white/10">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🛡️</span>
                                </div>
                                <span className="text-xl font-bold gradient-text">Firewall Edu</span>
                            </Link>

                            <div className="hidden md:flex items-center space-x-6">
                                <Link to="/" className="hover:text-cyber-blue transition-colors">Home</Link>
                                <Link to="/dashboard" className="hover:text-cyber-blue transition-colors">Dashboard</Link>
                                <Link to="/target-site" className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-semibold">🎯 Target Site</Link>
                                <Link to="/quiz" className="hover:text-cyber-blue transition-colors">Quiz</Link>
                                <Link to="/glossary" className="hover:text-cyber-blue transition-colors">Glossary</Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/attacks/sql-injection" element={<SqlInjectionPage />} />
                        <Route path="/attacks/xss" element={<XssPage />} />
                        <Route path="/attacks/ddos" element={<DdosPage />} />
                        <Route path="/attacks/brute-force" element={<BruteForcePage />} />
                        <Route path="/attacks/csrf" element={<CsrfPage />} />
                        <Route path="/attacks/mitm" element={<MitmPage />} />
                        <Route path="/attacks/port-scan" element={<PortScanPage />} />
                        <Route path="/attacks/path-traversal" element={<PathTraversalPage />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/glossary" element={<Glossary />} />
                        <Route path="/target-site" element={<TargetSite />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="glass-card mt-20 border-t border-white/10">
                    <div className="container mx-auto px-6 py-8">
                        <div className="text-center">
                            <div className="mb-4">
                                <p className="text-red-400 font-bold text-lg mb-2">⚠️ EDUCATIONAL USE ONLY ⚠️</p>
                                <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                                    This platform is designed strictly for educational purposes to teach cybersecurity concepts.
                                    All attack simulations are sandboxed and do not execute actual malicious code.
                                    Do NOT use this knowledge for illegal or malicious purposes.
                                </p>
                            </div>
                            <div className="text-gray-500 text-sm">
                                <p>© 2024 Firewall Educational Platform | Learn Responsibly</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
