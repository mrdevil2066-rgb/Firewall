import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const DdosPage = () => {
    const [requestCount, setRequestCount] = useState(15);

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Number of Requests: {requestCount}
                </label>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={requestCount}
                    onChange={(e) => setRequestCount(parseInt(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>50</span>
                </div>
            </div>
            <button
                onClick={() => handleSimulate({ requestCount })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Simulate DDoS Flood'}
            </button>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-200 text-xs">
                    <strong>Info:</strong> Threshold is 10 requests per second. Try values above 10 to trigger detection.
                </p>
            </div>
        </div>
    );

    const renderVisualization = (result, loading) => (
        <div className="space-y-4">
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : result ? (
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="text-6xl mb-4">{result.blocked ? '🌊' : '📊'}</div>
                        <div className="bg-gray-900/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Requests Sent:</span>
                                <span className="text-white font-bold">{result.details?.requestCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Threshold:</span>
                                <span className="text-white font-bold">{result.details?.threshold}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-700">
                            <div
                                style={{ width: `${Math.min((result.details?.requestCount / result.details?.threshold) * 100, 100)}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${result.blocked ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                            ></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">🌊</div>
                    <p className="text-sm">Simulate request flooding to see rate limiting in action</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="ddos"
            attackData={attackInfo['ddos']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default DdosPage;
