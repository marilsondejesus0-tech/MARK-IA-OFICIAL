import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { generateGenericContent } from '../services/geminiService';

type Tool = 'persuasive' | 'ad' | 'hashtag' | 'bio' | 'nicheExplosion' | 'contract' | 'infiltrate';

const Tools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool>('persuasive');
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toolConfig = {
        persuasive: { title: 'Gerador de Textos Persuasivos (Copy)', placeholder: 'Descreva seu produto ou serviço. Ex: um curso online de marketing digital para iniciantes.' },
        ad: { title: 'Assistente de Anúncios', placeholder: 'Descreva o produto e o objetivo do anúncio. Ex: Vender e-book de receitas saudáveis.' },
        hashtag: { title: 'Gerador de Hashtags', placeholder: 'Digite o tema principal do seu post. Ex: viagem para a Itália' },
        bio: { title: 'Gerador de Bio Profissional', placeholder: 'Descreva seu perfil ou negócio. Ex: Sou personal trainer focado em emagrecimento.' },
        nicheExplosion: { title: 'Explosão de Nicho', placeholder: 'Forneça 1 palavra-chave principal do seu nicho. Ex: meditação guiada' },
        contract: { title: 'Gerador de Contratos', placeholder: 'Descreva o serviço a ser prestado. Ex: 4 posts por mês para a marca X por R$1000.' },
        infiltrate: { title: 'Modo Infiltrar', placeholder: 'Digite o nicho para encontrar colaboradores. Ex: Culinária vegana' },
    };
    
    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            const content = await generateGenericContent(activeTool, prompt);
            setResult(content);
        } catch (error) {
            console.error(error);
            setResult('Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabClick = (tool: Tool) => {
        setActiveTool(tool);
        setPrompt('');
        setResult('');
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Ferramentas de Marketing de Elite</h1>
                <p className="text-blue-300 mt-1">Use a suíte completa de ferramentas da sua agência de IA.</p>
            </header>

            <Card>
                <div className="flex border-b border-blue-800/50 mb-6 flex-wrap">
                    {Object.keys(toolConfig).map((toolKey) => (
                         <button 
                            key={toolKey}
                            onClick={() => handleTabClick(toolKey as Tool)}
                            className={`py-2 px-4 text-sm font-medium transition-colors ${activeTool === toolKey ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {toolConfig[toolKey as Tool].title.split('(')[0].trim()}
                        </button>
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">{toolConfig[activeTool].title}</h2>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={toolConfig[activeTool].placeholder}
                        className="w-full bg-[#0a101f] border border-blue-800/70 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading} className="mt-4">
                        Gerar
                    </Button>
                </div>
            </Card>

            {(isLoading || result) && (
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Resultado</h2>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-md max-h-[500px] overflow-y-auto">
                            {result}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default Tools;