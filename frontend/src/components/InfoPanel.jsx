const InfoPanel = ({ attack }) => {
    return (
        <div className="glass-card p-6 space-y-6">
            <div>
                <h3 className="text-xl font-bold gradient-text mb-3">What is {attack.name}?</h3>
                <p className="text-gray-300">{attack.description}</p>
            </div>

            <div>
                <h3 className="text-xl font-bold gradient-text mb-3">How Does It Work?</h3>
                <p className="text-gray-300">{attack.howItWorks}</p>
            </div>

            <div>
                <h3 className="text-xl font-bold gradient-text mb-3">Real-World Example</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm">{attack.realWorldExample}</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold gradient-text mb-3">Prevention Techniques</h3>
                <ul className="space-y-2">
                    {attack.prevention.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="text-gray-300 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold gradient-text mb-3">Detection Methods</h3>
                <ul className="space-y-2">
                    {attack.detection.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <span className="text-cyber-blue mt-1">•</span>
                            <span className="text-gray-300 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {attack.codeExample && (
                <div>
                    <h3 className="text-xl font-bold gradient-text mb-3">Code Example</h3>
                    <pre className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-green-400">{attack.codeExample}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default InfoPanel;
