import { useState, useEffect } from 'react';
import api from '../utils/api';
import InfoPanel from './InfoPanel';
import TargetPanel from './TargetPanel';

const AttackSimulator = ({ attackType, attackData, renderInputs, renderVisualization }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async (payload) => {
        setLoading(true);
        try {
            const response = await api.post(`/attacks/${attackType}`, payload);
            setResult(response.data);
        } catch (error) {
            console.error('Simulation error:', error);
            setResult({
                success: false,
                error: 'Simulation failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="text-6xl">{attackData.icon}</div>
                    <div>
                        <h1 className="text-4xl font-bold gradient-text">{attackData.name}</h1>
                        <span className={`threat-badge threat-${attackData.severity} mt-2 inline-block`}>
                            {attackData.severity} severity
                        </span>
                    </div>
                </div>
                <p className="text-gray-300 text-lg">{attackData.description}</p>

                {/* Target badge */}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <span className="text-orange-400 text-sm">🎯 Real attacks hit:</span>
                    <a href="http://localhost:3001" target="_blank" rel="noreferrer"
                        className="text-orange-300 font-mono text-sm hover:text-orange-200 underline">
                        http://localhost:3001 (ShopVictim)
                    </a>
                    <span className="text-gray-500 text-xs">— intentionally vulnerable target</span>
                </div>
            </div>

            {/* Four-Panel Layout: 2 rows × 2 cols on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Panel 1: Info */}
                <div className="xl:col-span-1 space-y-6">
                    <InfoPanel attack={attackData} />
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold gradient-text mb-4">Simulation Controls</h3>
                        {renderInputs(handleSimulate, loading)}
                    </div>
                </div>

                {/* Panel 2: Visualization */}
                <div className="xl:col-span-1">
                    <div className="glass-card p-6 h-full">
                        <h3 className="text-xl font-bold gradient-text mb-4">Live Visualization</h3>
                        {renderVisualization(result, loading)}
                    </div>
                </div>

                {/* Panel 3: Firewall Detection Results */}
                <div className="xl:col-span-1">
                    <div className="glass-card p-6 h-full">
                        <h3 className="text-xl font-bold gradient-text mb-4">🛡️ Firewall Detection</h3>
                        {result ? (
                            <div className="space-y-4">
                                {/* Status */}
                                <div className={`p-4 rounded-lg border-2 ${result.blocked ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'}`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-2xl">{result.blocked ? '🚫' : '✅'}</span>
                                        <span className="font-bold text-lg">{result.message}</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{result.details?.explanation}</p>
                                </div>

                                {/* Severity */}
                                {result.severity && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-white">Threat Level</h4>
                                        <span className={`threat-badge threat-${result.severity}`}>{result.severity}</span>
                                    </div>
                                )}

                                {/* Detection Details */}
                                {result.details && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-white">Detection Details</h4>
                                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                                            {Object.entries(result.details).map(([key, value]) => {
                                                if (key === 'explanation') return null;
                                                return (
                                                    <div key={key} className="text-sm">
                                                        <span className="text-gray-400">{key}:</span>
                                                        <span className="text-white ml-2">
                                                            {Array.isArray(value) ? value.join(', ') : String(value)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Triggered Rules */}
                                {result.details?.detectedPatterns && result.details.detectedPatterns.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-white">Triggered Firewall Rules</h4>
                                        <ul className="space-y-1">
                                            {result.details.detectedPatterns.map((pattern, index) => (
                                                <li key={index} className="text-sm text-red-400 flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <code className="bg-gray-900/50 px-2 py-1 rounded">{pattern}</code>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-12">
                                <p>Run a simulation to see firewall detection results</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 4: Target Website Response */}
                <div className="xl:col-span-1">
                    <TargetPanel
                        targetResponse={result?.targetResponse}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttackSimulator;
