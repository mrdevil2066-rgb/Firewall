import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                api.get('/logs/stats'),
                api.get('/logs?limit=10')
            ]);
            setStats(statsRes.data.stats);
            setLogs(logsRes.data.logs);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const clearLogs = async () => {
        if (window.confirm('Are you sure you want to clear all logs?')) {
            try {
                await api.delete('/logs');
                fetchData();
            } catch (error) {
                console.error('Error clearing logs:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    const attackTypeData = {
        labels: Object.keys(stats?.attacksByType || {}),
        datasets: [{
            data: Object.values(stats?.attacksByType || {}),
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 191, 36, 0.8)'
            ],
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 2
        }]
    };

    const severityData = {
        labels: Object.keys(stats?.attacksBySeverity || {}),
        datasets: [{
            label: 'Attacks by Severity',
            data: Object.values(stats?.attacksBySeverity || {}),
            backgroundColor: 'rgba(0, 212, 255, 0.6)',
            borderColor: 'rgba(0, 212, 255, 1)',
            borderWidth: 2
        }]
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-2">Security Dashboard</h1>
                <p className="text-gray-400">Real-time monitoring and attack statistics</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-2xl font-bold text-white">{stats?.totalAttacks || 0}</div>
                    <div className="text-gray-400 text-sm">Total Attacks</div>
                </div>
                <div className="glass-card p-6">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="text-2xl font-bold text-green-400">{stats?.blockedCount || 0}</div>
                    <div className="text-gray-400 text-sm">Blocked</div>
                </div>
                <div className="glass-card p-6">
                    <div className="text-3xl mb-2">⚠️</div>
                    <div className="text-2xl font-bold text-red-400">{stats?.allowedCount || 0}</div>
                    <div className="text-gray-400 text-sm">Allowed</div>
                </div>
                <div className="glass-card p-6">
                    <div className="text-3xl mb-2">🔔</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats?.recentAttacks || 0}</div>
                    <div className="text-gray-400 text-sm">Last 24 Hours</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Attacks by Type</h2>
                    <div className="h-64 flex items-center justify-center">
                        {Object.keys(stats?.attacksByType || {}).length > 0 ? (
                            <Pie data={attackTypeData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-gray-400">No data available</p>
                        )}
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Attacks by Severity</h2>
                    <div className="h-64">
                        {Object.keys(stats?.attacksBySeverity || {}).length > 0 ? (
                            <Bar data={severityData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-gray-400">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Logs */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Attack Logs</h2>
                    <button onClick={clearLogs} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        Clear Logs
                    </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Time</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Severity</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Source IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-gray-300 text-sm">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-white font-medium">{log.attackType}</td>
                                    <td className="py-3 px-4">
                                        <span className={`threat-badge threat-${log.severity}`}>{log.severity}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.blocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {log.blocked ? 'BLOCKED' : 'ALLOWED'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-300 text-sm">{log.sourceIP}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">
                                        No attack logs yet. Try running some simulations!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
