import { useState } from 'react';
import AttackSimulator from '../../components/AttackSimulator';
import { attackInfo } from '../../data/attackInfo';

const PortScanPage = () => {
    const [selectedPorts, setSelectedPorts] = useState([80, 443, 22, 21, 3306, 8080]);
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 5432, 8080, 8443];

    const togglePort = (port) => {
        setSelectedPorts(prev =>
            prev.includes(port) ? prev.filter(p => p !== port) : [...prev, port]
        );
    };

    const renderInputs = (handleSimulate, loading) => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Select Ports to Scan ({selectedPorts.length} selected)
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {commonPorts.map(port => (
                        <button
                            key={port}
                            onClick={() => togglePort(port)}
                            className={`p-2 rounded text-sm transition-colors ${selectedPorts.includes(port)
                                    ? 'bg-cyber-blue text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {port}
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={() => handleSimulate({ ports: selectedPorts })}
                disabled={loading || selectedPorts.length === 0}
                className="cyber-button w-full disabled:opacity-50"
            >
                {loading ? 'Scanning...' : 'Scan Ports'}
            </button>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                    <strong>Info:</strong> Scanning more than 5 ports triggers detection
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
                        <div className="text-6xl mb-4">🔍</div>
                        <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Ports Scanned:</span>
                                <span className="text-white font-bold">{result.details?.portCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Threshold:</span>
                                <span className="text-white font-bold">{result.details?.threshold}</span>
                            </div>
                            <div className="mt-4">
                                <div className="text-xs text-gray-400 mb-2">Scanned Ports:</div>
                                <div className="flex flex-wrap gap-1">
                                    {result.details?.portsScanned?.map(port => (
                                        <span key={port} className="bg-cyber-blue/20 text-cyber-blue px-2 py-1 rounded text-xs">
                                            {port}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-sm">Select ports and start scanning</p>
                </div>
            )}
        </div>
    );

    return (
        <AttackSimulator
            attackType="port-scan"
            attackData={attackInfo['port-scan']}
            renderInputs={renderInputs}
            renderVisualization={renderVisualization}
        />
    );
};

export default PortScanPage;
