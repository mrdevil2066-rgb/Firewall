import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const XssPage = () => {
    const [input, setInput] = useState("<script>alert('XSS Attack!')</script>");

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">User Input</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                    rows="4"
                    placeholder="Enter input to test..."
                />
            </div>
            <button
                onClick={() => handleSimulate({ input })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Simulate XSS Attack'}
            </button>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                    <strong>Try these examples:</strong><br />
                    • &lt;script&gt;alert('XSS')&lt;/script&gt;<br />
                    • &lt;img src=x onerror=alert('XSS')&gt;<br />
                    • &lt;iframe src="javascript:alert('XSS')"&gt;
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
                        <h4 className="text-sm font-semibold mb-2 text-red-400">Unfiltered Input (Dangerous)</h4>
                        <code className="text-sm text-red-400 break-all">{result.details?.originalInput}</code>
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <div className="text-4xl">{result.blocked ? '🚫' : '✅'}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-green-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-green-400">Sanitized Output (Safe)</h4>
                        <code className="text-sm text-green-400 break-all">{result.details?.sanitizedInput}</code>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <p className="mb-4">Enter user input and click simulate</p>
                    <div className="text-6xl mb-4">🔗</div>
                    <p className="text-sm">The firewall will detect and sanitize malicious scripts</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="xss"
            attackData={attackInfo['xss']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default XssPage;
