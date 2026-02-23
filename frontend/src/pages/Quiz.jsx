import { useState } from 'react';

const quizQuestions = [
    {
        question: 'What is SQL Injection?',
        options: [
            'A technique to inject malicious SQL code into database queries',
            'A method to improve database performance',
            'A way to backup databases',
            'A database encryption technique'
        ],
        correct: 0,
        explanation: 'SQL Injection is a code injection technique that exploits security vulnerabilities in an application\'s database layer by inserting malicious SQL statements.'
    },
    {
        question: 'Which of the following is the best defense against XSS attacks?',
        options: [
            'Disable JavaScript',
            'Input validation and output encoding',
            'Use only GET requests',
            'Disable cookies'
        ],
        correct: 1,
        explanation: 'Input validation and output encoding are the primary defenses against XSS. They ensure that user input is sanitized before being rendered in the browser.'
    },
    {
        question: 'What does DDoS stand for?',
        options: [
            'Direct Denial of Service',
            'Distributed Denial of Service',
            'Database Denial of Service',
            'Dynamic Denial of Service'
        ],
        correct: 1,
        explanation: 'DDoS stands for Distributed Denial of Service, where multiple compromised systems attack a target simultaneously.'
    },
    {
        question: 'What is the primary purpose of CSRF tokens?',
        options: [
            'To encrypt data',
            'To verify that requests come from legitimate users',
            'To speed up page loading',
            'To store user preferences'
        ],
        correct: 1,
        explanation: 'CSRF tokens verify that state-changing requests originate from the legitimate user and not from a malicious third party.'
    },
    {
        question: 'Which protocol helps prevent MITM attacks?',
        options: [
            'HTTP',
            'FTP',
            'HTTPS/TLS',
            'SMTP'
        ],
        correct: 2,
        explanation: 'HTTPS/TLS encrypts communications between client and server, making it much harder for attackers to intercept and modify data.'
    },
    {
        question: 'What is a common indicator of a brute force attack?',
        options: [
            'Slow website performance',
            'Multiple failed login attempts in a short time',
            'Large file uploads',
            'Frequent page refreshes'
        ],
        correct: 1,
        explanation: 'Brute force attacks are characterized by numerous failed login attempts as the attacker tries different password combinations.'
    },
    {
        question: 'Path traversal attacks typically use which character sequence?',
        options: [
            '***',
            '../',
            '///',
            '<<<'
        ],
        correct: 1,
        explanation: 'Path traversal attacks commonly use "../" to navigate up directory structures and access files outside the intended directory.'
    },
    {
        question: 'What is the main purpose of port scanning?',
        options: [
            'To improve network speed',
            'To discover open ports and services on a network',
            'To encrypt network traffic',
            'To backup network configurations'
        ],
        correct: 1,
        explanation: 'Port scanning is a reconnaissance technique used to identify open ports and running services, which can reveal potential attack vectors.'
    }
];

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        setShowExplanation(true);
        if (index === quizQuestions[currentQuestion].correct) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizComplete(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setQuizComplete(false);
    };

    if (quizComplete) {
        const percentage = (score / quizQuestions.length) * 100;
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card p-8 text-center">
                        <div className="text-6xl mb-6">
                            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
                        </div>
                        <h2 className="text-3xl font-bold gradient-text mb-4">Quiz Complete!</h2>
                        <div className="text-5xl font-bold mb-4">
                            <span className="gradient-text">{score}</span>
                            <span className="text-gray-400"> / {quizQuestions.length}</span>
                        </div>
                        <p className="text-xl text-gray-300 mb-8">
                            You scored {percentage.toFixed(0)}%
                        </p>
                        <div className="mb-8">
                            {percentage >= 80 && (
                                <p className="text-green-400">Excellent! You have a strong understanding of cybersecurity concepts.</p>
                            )}
                            {percentage >= 60 && percentage < 80 && (
                                <p className="text-yellow-400">Good job! Review the topics you missed to improve further.</p>
                            )}
                            {percentage < 60 && (
                                <p className="text-red-400">Keep learning! Review the attack simulations and try again.</p>
                            )}
                        </div>
                        <button onClick={restartQuiz} className="cyber-button">
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = quizQuestions[currentQuestion];

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Cybersecurity Quiz</h1>
                    <p className="text-gray-400">Test your knowledge of cyber attacks and defense mechanisms</p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">{question.question}</h2>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => !showExplanation && handleAnswer(index)}
                                disabled={showExplanation}
                                className={`w-full p-4 rounded-lg text-left transition-all ${showExplanation
                                        ? index === question.correct
                                            ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                            : index === selectedAnswer
                                                ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                                                : 'bg-gray-800/50 border border-gray-700 text-gray-400'
                                        : 'bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700/50 hover:border-cyber-blue'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{option}</span>
                                    {showExplanation && index === question.correct && (
                                        <span className="ml-auto text-green-400">✓</span>
                                    )}
                                    {showExplanation && index === selectedAnswer && index !== question.correct && (
                                        <span className="ml-auto text-red-400">✗</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {showExplanation && (
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <strong>Explanation:</strong> {question.explanation}
                            </p>
                        </div>
                    )}

                    {showExplanation && (
                        <button onClick={nextQuestion} className="cyber-button w-full mt-6">
                            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
