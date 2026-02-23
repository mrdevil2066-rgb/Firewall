import { Link } from 'react-router-dom';

const AttackCard = ({ attack, path }) => {
    return (
        <Link to={path}>
            <div className="glass-card-hover p-6 h-full transform transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="text-5xl">{attack.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{attack.name}</h3>
                        <span className={`threat-badge threat-${attack.severity} mt-2 inline-block`}>
                            {attack.severity}
                        </span>
                    </div>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">{attack.description}</p>
                <div className="mt-4 flex items-center text-cyber-blue text-sm font-semibold">
                    Learn More <span className="ml-2">→</span>
                </div>
            </div>
        </Link>
    );
};

export default AttackCard;
