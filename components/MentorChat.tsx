import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToMentor, startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';
import Logo from './ui/Logo';

const MentorChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        startChat();
        setMessages([{ role: 'model', content: 'Olá! Sou M.A.R.K., seu mentor de marketing pessoal. Como posso te ajudar a dominar seu nicho hoje?' }]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessageToMentor(input);
            const modelMessage: ChatMessage = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'model', content: 'Desculpe, estou com problemas para me conectar. Tente novamente em alguns instantes.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white">Mentor IA 24/7</h1>
                <p className="text-blue-300 mt-1">Converse com M.A.R.K. para obter estratégias e insights.</p>
            </header>
            <div className="flex-1 bg-[#10182c]/80 backdrop-blur-sm border border-blue-800/50 rounded-lg shadow-lg shadow-blue-500/10 p-4 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <Logo className="h-8 w-8 flex-shrink-0 mt-1" />}
                            <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'model' ? 'bg-blue-900/50' : 'bg-blue-600'}`}>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                            <Logo className="h-8 w-8 flex-shrink-0 mt-1" />
                            <div className="max-w-lg p-3 rounded-lg bg-blue-900/50 flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2 delay-150"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 border-t border-blue-800/50 pt-4">
                    <div className="flex gap-4">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite sua pergunta..."
                            className="flex-1"
                        />
                        <Button onClick={handleSend} isLoading={isLoading}>
                            Enviar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorChat;
