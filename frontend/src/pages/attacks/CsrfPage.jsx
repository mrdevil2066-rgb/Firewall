import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const CsrfPage = () => {
    const [token, setToken] = useState('');
    const [action, setAction] = useState('transfer_funds');

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Action</label>
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                >
                    <option value="transfer_funds">Transfer Funds</option>
                    <option value="change_password">Change Password</option>
                    <option value="delete_account">Delete Account</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">CSRF Token</label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyber-blue focus:outline-none"
                    placeholder="Enter CSRF token..."
                />
            </div>
            <button
                onClick={() => handleSimulate({ token, action })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Submit Request'}
            </button>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-200 text-xs">
                    <strong>Valid Token:</strong> VALID_CSRF_TOKEN_12345
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
                        <div className="text-6xl mb-4">{result.details?.tokenValid ? '✅' : '🎭'}</div>
                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Action:</span>
                                <span className="text-white font-bold">{action}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Token Valid:</span>
                                <span className={`font-bold ${result.details?.tokenValid ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.details?.tokenValid ? 'YES' : 'NO'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">🎭</div>
                    <p className="text-sm">Test CSRF token validation</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="csrf"
            attackData={attackInfo['csrf']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default CsrfPage;
