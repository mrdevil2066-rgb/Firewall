import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const PathTraversalPage = () => {
    const [path, setPath] = useState('../../etc/passwd');

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">File Path</label>
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                    placeholder="Enter file path..."
                />
            </div>
            <button
                onClick={() => handleSimulate({ path })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Access File'}
            </button>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                    <strong>Try these examples:</strong><br />
                    • ../../etc/passwd<br />
                    • ..\\..\\windows\\system32\\config<br />
                    • ../../../var/log/auth.log
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
                    <div className="bg-gray-900/50 border border-red-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-red-400">Requested Path</h4>
                        <code className="text-sm text-red-400 break-all">{result.details?.requestedPath}</code>
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <div className="text-4xl">{result.blocked ? '🚫' : '✅'}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-green-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-green-400">Sanitized Path</h4>
                        <code className="text-sm text-green-400 break-all">{result.details?.sanitizedPath}</code>
                    </div>
                    {result.blocked && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm font-semibold">⚠️ Directory traversal attempt blocked!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-sm">Enter a file path to test</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="path-traversal"
            attackData={attackInfo['path-traversal']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default PathTraversalPage;
