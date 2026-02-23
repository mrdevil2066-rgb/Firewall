import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const MitmPage = () => {
    const [certificateValid, setCertificateValid] = useState(false);

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">SSL Certificate Status</label>
                <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            checked={certificateValid === true}
                            onChange={() => setCertificateValid(true)}
                            className="w-4 h-4"
                        />
                        <span className="text-white">Valid Certificate</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            checked={certificateValid === false}
                            onChange={() => setCertificateValid(false)}
                            className="w-4 h-4"
                        />
                        <span className="text-white">Invalid/Untrusted Certificate</span>
                    </label>
                </div>
            </div>
            <button
                onClick={() => handleSimulate({ certificateValid })}
                disabled={loading}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Simulating...' : 'Test Connection'}
            </button>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-xs">
                    <strong>Warning:</strong> Invalid certificates indicate possible MITM attack
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
                        <div className="text-6xl mb-4">{result.details?.certificateValid ? '🔒' : '👤'}</div>
                        <div className="bg-gray-900/50 rounded-lg p-4">
                            <div className="mb-4">
                                <div className="text-sm text-gray-400 mb-2">Connection Status</div>
                                <div className={`text-lg font-bold ${result.details?.certificateValid ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.details?.certificateValid ? 'SECURE' : 'INSECURE'}
                                </div>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-2xl">🖥️</span>
                                <span className="text-2xl">{result.details?.certificateValid ? '🔒' : '⚠️'}</span>
                                <span className="text-2xl">🌐</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-sm">Test SSL certificate validation</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="mitm"
            attackData={attackInfo['mitm']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default MitmPage;
