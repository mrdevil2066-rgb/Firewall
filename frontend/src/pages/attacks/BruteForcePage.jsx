import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const BruteForcePage = () => {
    const [username, setUsername] = useState('admin');
    const [attemptCount, setAttemptCount] = useState(7);

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                    placeholder="Enter username..."
                />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Login Attempts: {attemptCount}
                </label>
                <input
                    type="range"
                    min="1"
                    max="15"
                    value={attemptCount}
                    onChange={(e) => setAttemptCount(parseInt(e.target.value))}
                    className="w-full"
                />
            </div>
            <button
                onClick={() => handleSimulate({ username, attemptCount })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Simulate Brute Force'}
            </button>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                    <strong>Info:</strong> Account locks after 5 failed attempts
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
                        <div className="text-6xl mb-4">{result.details?.accountLocked ? '🔒' : '🔓'}</div>
                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Attempts:</span>
                                <span className="text-white font-bold">{result.details?.attemptCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Max Allowed:</span>
                                <span className="text-white font-bold">{result.details?.maxAttempts}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-bold ${result.details?.accountLocked ? 'text-red-400' : 'text-green-400'}`}>
                                    {result.details?.accountLocked ? 'LOCKED' : 'ACTIVE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">🔨</div>
                    <p className="text-sm">Simulate multiple login attempts</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="brute-force"
            attackData={attackInfo['brute-force']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default BruteForcePage;
