import { useState, useEffect, useCallback } from 'react';

const targetBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const targetVictimUrl = import.meta.env.VITE_TARGET_URL || 'http://localhost:3001';

const TargetSite = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`${targetBackendUrl}/api/target/status`);
            const data = await res.json();
            setStatus(prev => {
                // Force iframe reload when ddosMode changes or comments change
                if (!prev || prev.ddosMode !== data.ddosMode || prev.totalComments !== data.totalComments || (prev.lockedAccounts?.length !== data.lockedAccounts?.length)) {
                    setIframeKey(k => k + 1);
                }
                return data;
            });
        } catch {
            setStatus({ error: true });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        if (autoRefresh) {
            const interval = setInterval(fetchStatus, 2000);
            return () => clearInterval(interval);
        }
    }, [fetchStatus, autoRefresh]);

    const handleReset = async () => {
        setResetting(true);
        try {
            await fetch(`${targetBackendUrl}/api/target/reset`, { method: 'POST' });
            await fetchStatus();
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <div className="text-6xl mb-4 animate-pulse">🎯</div>
                <p className="text-gray-300 text-xl">Connecting to target server...</p>
            </div>
        );
    }

    if (status?.error) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <div className="text-6xl mb-4">🔴</div>
                <h2 className="text-2xl font-bold text-red-400 mb-3">Target Server Offline</h2>
                <p className="text-gray-400 mb-6">The target victim server is not running.</p>
                <div className="bg-gray-900/50 rounded-xl p-6 max-w-md mx-auto text-left">
                    <p className="text-gray-300 font-semibold mb-2">To start it, run:</p>
                    <code className="text-green-400 text-sm block bg-black/50 p-3 rounded">npm run dev</code>
                    <p className="text-gray-400 text-sm mt-2">from the project root directory</p>
                </div>
                <button onClick={fetchStatus} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                    Retry Connection
                </button>
            </div>
        );
    }

    const { totalUsers, totalProducts, totalComments, unsafeComments, lockedAccounts = [], loginAttempts = {}, ddosMode, recentRequestCount, comments = [], recentActivities = [] } = status;

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">🎯</div>
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            ShopVictim Target Server
                        </h1>
                        <p className="text-gray-400 mt-1">Live state of the intentionally vulnerable target website</p>
                    </div>
                </div>

                {/* Status bar */}
                <div className="flex flex-wrap gap-3 items-center">
                    <a href={targetVictimUrl} target="_blank" rel="noreferrer"
                        className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-lg text-sm font-mono hover:bg-orange-500/30 transition-colors">
                        🌐 Open Target Site ↗
                    </a>
                    <span className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${ddosMode ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'}`}>
                        <span className={`w-2 h-2 rounded-full ${ddosMode ? 'bg-red-400 animate-ping' : 'bg-green-400 animate-pulse'}`}></span>
                        {ddosMode ? `💥 UNDER DDOS (${recentRequestCount} req/10s)` : '✅ Server Online'}
                    </span>
                    <button
                        onClick={() => setAutoRefresh(a => !a)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${autoRefresh ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-gray-700/50 border-gray-600/40 text-gray-400'}`}
                    >
                        {autoRefresh ? '🔄 Auto-refresh ON' : '⏸ Auto-refresh OFF'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                        {resetting ? '⏳ Resetting...' : '🔄 Reset All State'}
                    </button>
                </div>
            </div>

            {/* DDoS Banner */}
            {ddosMode && (
                <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/60 rounded-xl animate-pulse">
                    <h3 className="text-red-400 font-bold text-xl">💥 TARGET IS UNDER DDoS ATTACK!</h3>
                    <p className="text-red-300">The target server is overwhelmed. {recentRequestCount} requests received in the last 10 seconds.</p>
                    <p className="text-red-200 text-sm mt-1">Real users on the target site would receive 503 Service Unavailable errors right now.</p>
                </div>
            )}

            {/* Alerts */}
            {recentActivities.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Recent Attack Activity</h3>
                    <ul className="space-y-1">
                        {recentActivities.map((a, i) => (
                            <li key={i} className="text-yellow-300 text-sm">• {a}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Registered Users', value: totalUsers, icon: '👥', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Products', value: totalProducts, icon: '📦', color: 'from-purple-500 to-pink-500' },
                    { label: 'XSS Payloads Stored', value: unsafeComments, icon: '⚠️', color: 'from-yellow-500 to-orange-500' },
                    { label: 'Locked Accounts', value: lockedAccounts.length, icon: '🔒', color: 'from-red-500 to-rose-500' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card p-5 text-center">
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                            {stat.value}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comments (XSS) */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
                        💬 Comments Section (XSS State)
                    </h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {comments.length === 0 ? (
                            <p className="text-gray-400 text-sm">No comments yet.</p>
                        ) : comments.map((comment, i) => (
                            <div key={i} className={`p-3 rounded-lg border-l-4 ${comment.safe ? 'bg-gray-800/50 border-gray-500' : 'bg-red-500/10 border-red-500'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-white">{comment.author}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{comment.date}</span>
                                        {!comment.safe && (
                                            <span className="text-xs bg-red-500/30 text-red-400 px-2 py-0.5 rounded-full">⚠️ XSS</span>
                                        )}
                                    </div>
                                </div>
                                <code className={`text-xs break-all ${comment.safe ? 'text-gray-300' : 'text-red-300'}`}>
                                    {comment.content}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Locked Accounts + Login Attempts */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 mb-4">
                        🔒 Account Security State (Brute Force)
                    </h2>
                    {lockedAccounts.length === 0 && Object.keys(loginAttempts).length === 0 ? (
                        <p className="text-gray-400 text-sm">No account security events detected.</p>
                    ) : (
                        <div className="space-y-3">
                            {lockedAccounts.map((username) => (
                                <div key={username} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <span className="text-2xl">🔒</span>
                                    <div>
                                        <span className="font-semibold text-red-300">{username}</span>
                                        <p className="text-red-400 text-xs">Account locked — too many failed attempts</p>
                                    </div>
                                </div>
                            ))}
                            {Object.entries(loginAttempts)
                                .filter(([u]) => !lockedAccounts.includes(u))
                                .map(([username, attempts]) => (
                                    <div key={username} className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <span className="text-2xl">⚠️</span>
                                        <div>
                                            <span className="font-semibold text-yellow-300">{username}</span>
                                            <p className="text-yellow-400 text-xs">{attempts} failed login attempt(s) — {5 - attempts} until lockout</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Open Target Site */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <h3 className="text-gray-300 font-semibold text-sm mb-3">Open Target Site Directly:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: '🏠 Homepage', url: targetVictimUrl },
                                { label: '👥 Users API', url: `${targetVictimUrl}/api/users` },
                                { label: '📦 Products API', url: `${targetVictimUrl}/api/products` },
                                { label: '📊 Status API', url: `${targetVictimUrl}/api/status` },
                            ].map(link => (
                                <a key={link.url} href={link.url} target="_blank" rel="noreferrer"
                                    className="text-xs px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 text-center transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Embed */}
            <div className="mt-6 glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        🖥️ Live Target Website Preview
                    </h2>
                    <a href={targetVictimUrl} target="_blank" rel="noreferrer"
                        className="text-sm text-orange-400 hover:text-orange-300 underline">
                        Open in new tab ↗
                    </a>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '600px' }}>
                    <iframe
                        key={iframeKey}
                        src={targetVictimUrl}
                        title="ShopVictim Target Website"
                        className="w-full h-full"
                        style={{ border: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TargetSite;
