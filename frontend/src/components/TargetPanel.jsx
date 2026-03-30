import { useState, useEffect, useRef } from 'react';

const targetBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const targetVictimUrl = import.meta.env.VITE_TARGET_URL || 'http://localhost:3001';

const TargetPanel = ({ targetResponse, loading }) => {
    const [targetStatus, setTargetStatus] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const pollRef = useRef(null);

    const fetchStatus = async () => {
        setStatusLoading(true);
        try {
            const res = await fetch(`${targetBackendUrl}/api/target/status`);
            const data = await res.json();
            setTargetStatus(data);
        } catch {
            setTargetStatus({ error: 'Target server offline' });
        } finally {
            setStatusLoading(false);
        }
    };

    // Auto-refresh: immediately after attack (with small delay to let target settle),
    // then poll every 2s so state is always current
    useEffect(() => {
        // Clear any existing poll
        if (pollRef.current) clearInterval(pollRef.current);

        if (targetResponse) {
            // Fetch immediately after attack result comes in (give target 800ms to settle)
            const initialTimer = setTimeout(fetchStatus, 800);
            // Then keep polling every 2s so ddos/lock state updates live
            pollRef.current = setInterval(fetchStatus, 2000);
            return () => {
                clearTimeout(initialTimer);
                clearInterval(pollRef.current);
            };
        } else {
            // No active result — just fetch once on mount
            fetchStatus();
        }
    }, [targetResponse]);


    const getStatusColor = (status) => {
        if (!status) return 'text-gray-400';
        if (status >= 500) return 'text-red-400';
        if (status === 403 || status === 423) return 'text-orange-400';
        if (status === 200) return 'text-green-400';
        return 'text-yellow-400';
    };

    const getStatusLabel = (status) => {
        if (!status) return 'N/A';
        if (status === 503) return '503 Overwhelmed';
        if (status === 423) return '423 Account Locked';
        if (status === 403) return '403 Forbidden';
        if (status === 200) return '200 OK';
        if (status === 401) return '401 Unauthorized';
        if (status === 0) return 'Offline';
        return String(status);
    };

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    🎯 Target Website
                </h3>
                <div className="flex items-center gap-2">
                    {targetStatus && !targetStatus.error ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
                            Online :3001
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                            Offline
                        </span>
                    )}
                    <a
                        href={targetVictimUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                    >
                        Open ↗
                    </a>
                </div>
            </div>

            {/* DDoS Warning */}
            {targetStatus?.ddosMode && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg animate-pulse">
                    <p className="text-red-400 font-bold text-sm">💥 TARGET UNDER DDoS ATTACK!</p>
                    <p className="text-red-300 text-xs">{targetStatus.recentRequestCount} requests in last 10 seconds</p>
                </div>
            )}

            {/* Attack Result on Target */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-3xl mb-3 animate-bounce">⚡</div>
                        <p className="text-orange-400 font-semibold">Hitting target server...</p>
                        <p className="text-gray-400 text-sm mt-1">Sending real attack payload to target</p>
                    </div>
                </div>
            ) : targetResponse ? (
                <div className="flex-1 space-y-3 overflow-y-auto">
                    {/* URL hit */}
                    <div className="bg-gray-900/60 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Target Endpoint Hit:</p>
                        <code className="text-orange-300 text-xs break-all">{targetResponse.method} {targetResponse.url}</code>
                    </div>

                    {/* HTTP Status */}
                    <div className="flex items-center gap-3">
                        <div className={`text-lg font-bold font-mono ${getStatusColor(targetResponse.status)}`}>
                            {getStatusLabel(targetResponse.status)}
                        </div>
                        {targetResponse.offline && (
                            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Target Offline</span>
                        )}
                    </div>

                    {/* Description */}
                    {targetResponse.description && (
                        <p className="text-gray-300 text-sm italic border-l-2 border-orange-500/50 pl-3">
                            {targetResponse.description}
                        </p>
                    )}

                    {/* Response Data */}
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Response from Target:</p>
                        <div className="bg-gray-950/80 rounded-lg p-3 max-h-52 overflow-y-auto">
                            <pre className="text-green-300 text-xs whitespace-pre-wrap break-words">
                                {JSON.stringify(targetResponse.data, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Extra stats (DDoS) */}
                    {targetResponse.overwhelmedCount !== undefined && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
                                <div className="text-red-400 font-bold">{targetResponse.overwhelmedCount}</div>
                                <div className="text-gray-400 text-xs">Rejected</div>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
                                <div className="text-green-400 font-bold">{(targetResponse.totalSent || 0) - (targetResponse.overwhelmedCount || 0)}</div>
                                <div className="text-gray-400 text-xs">Processed</div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    {/* Server Status */}
                    <div className="flex-1">
                        {statusLoading ? (
                            <div className="text-center text-gray-400 py-6">Loading target status...</div>
                        ) : targetStatus && !targetStatus.error ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300">Current state of the target victim server:</p>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-gray-900/50 rounded p-2 text-center">
                                        <div className="text-white font-bold">{targetStatus.totalUsers}</div>
                                        <div className="text-gray-400 text-xs">Users</div>
                                    </div>
                                    <div className="bg-gray-900/50 rounded p-2 text-center">
                                        <div className="text-white font-bold">{targetStatus.totalProducts}</div>
                                        <div className="text-gray-400 text-xs">Products</div>
                                    </div>
                                    <div className="bg-gray-900/50 rounded p-2 text-center">
                                        <div className="text-yellow-400 font-bold">{targetStatus.unsafeComments}</div>
                                        <div className="text-gray-400 text-xs">XSS Payloads</div>
                                    </div>
                                    <div className="bg-gray-900/50 rounded p-2 text-center">
                                        <div className="text-red-400 font-bold">{targetStatus.lockedAccounts?.length || 0}</div>
                                        <div className="text-gray-400 text-xs">Locked Accts</div>
                                    </div>
                                </div>

                                {targetStatus.recentActivities?.length > 0 && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                                        {targetStatus.recentActivities.map((a, i) => (
                                            <p key={i} className="text-yellow-400 text-xs">{a}</p>
                                        ))}
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Run a simulation to attack this server →
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-red-400 text-lg mb-2">⚠️</p>
                                <p className="text-red-400 font-semibold">Target server offline</p>
                                <p className="text-gray-400 text-xs mt-1">Start target server: <code className="text-orange-300">npm run dev</code></p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reset button */}
            {targetStatus && !targetStatus.error && (
                <button
                    onClick={async () => {
                        await fetch(`${targetBackendUrl}/api/target/reset`, { method: 'POST' });
                        fetchStatus();
                    }}
                    className="mt-3 w-full text-xs py-1.5 px-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded border border-gray-600/50 transition-colors"
                >
                    🔄 Reset Target Server State
                </button>
            )}
        </div>
    );
};

export default TargetPanel;
