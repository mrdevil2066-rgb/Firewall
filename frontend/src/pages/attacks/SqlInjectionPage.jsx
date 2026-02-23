import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const SqlInjectionPage = () => {
    const [query, setQuery] = useState("SELECT * FROM users WHERE username = 'admin' OR '1'='1'");

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">SQL Query</label>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                    rows="4"
                    placeholder="Enter SQL query to test..."
                />
            </div>
            <button
                onClick={() => handleSimulate({ query })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Simulating...' : 'Simulate SQL Injection'}
            </button>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                    <strong>Try these examples:</strong><br />
                    • ' OR '1'='1<br />
                    • '; DROP TABLE users; --<br />
                    • ' UNION SELECT * FROM passwords --
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
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-cyber-blue">Original Query</h4>
                        <code className="text-sm text-red-400">{result.details?.originalQuery}</code>
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <div className="text-4xl">{result.blocked ? '🚫' : '✅'}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-cyber-blue">Sanitized Query</h4>
                        <code className="text-sm text-green-400">{result.details?.sanitizedQuery}</code>
                    </div>
                    {result.blocked && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-pulse-slow">
                            <p className="text-red-400 text-sm font-semibold">⚠️ Malicious SQL patterns detected!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <p className="mb-4">Enter a SQL query and click simulate</p>
                    <div className="text-6xl mb-4">💉</div>
                    <p className="text-sm">The firewall will analyze the query for malicious patterns</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="sql-injection"
            attackData={attackInfo['sql-injection']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default SqlInjectionPage;
