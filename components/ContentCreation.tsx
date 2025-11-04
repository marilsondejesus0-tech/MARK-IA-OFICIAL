import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { generateGenericContent, generateViralCampaign } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { ViralCampaign } from '../types';
import Input from './ui/Input';

type Tool = 'viral' | 'script' | 'thumbnail';

const ContentCreation: React.FC = () => {
    const { getActiveProfile } = useApp();
    const activeProfile = getActiveProfile();
    const [activeTool, setActiveTool] = useState<Tool>('viral');
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<string | ViralCampaign | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const toolConfig = {
        viral: { title: 'Gerador de Campanha Viral', placeholder: 'Ex: Lançar um novo e-book de receitas' },
        script: { title: 'Gerador de Roteiros para Reels', placeholder: 'Ex: Como fazer o melhor café em casa' },
        thumbnail: { title: 'Gerador de Ideias para Thumbnails', placeholder: 'Ex: Review do novo iPhone' },
    };
    
    const handleGenerate = async () => {
        if (!prompt || !activeProfile) return;
        setIsLoading(true);
        setResult(null);
        try {
            if (activeTool === 'viral') {
                const campaign = await generateViralCampaign(activeProfile.niche, prompt);
                setResult(campaign);
            } else {
                const content = await generateGenericContent(activeTool, prompt);
                setResult(content);
            }
        } catch (error) {
            console.error(error);
            setResult('Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderResult = () => {
        if (!result) return null;
        if (typeof result === 'string') {
            return (
                <div className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-md max-h-96 overflow-y-auto">
                    {result}
                </div>
            )
        }
        
        const campaign = result as ViralCampaign;
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-300">{campaign.title}</h3>
                <div>
                    <h4 className="font-semibold text-white">Roteiro do Reel:</h4>
                    <div className="bg-black/20 p-3 rounded-md mt-1 text-sm text-gray-300">
                        <p><strong>Gancho (3s):</strong> {campaign.script.hook}</p>
                        <p><strong>Conteúdo:</strong> {campaign.script.content}</p>
                        <p><strong>CTA:</strong> {campaign.script.cta}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Legenda:</h4>
                    <p className="bg-black/20 p-3 rounded-md mt-1 text-sm text-gray-300">{campaign.caption}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-white">Hashtags:</h4>
                    <p className="bg-black/20 p-3 rounded-md mt-1 text-sm text-blue-400 italic">{campaign.hashtags}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Música em Alta:</h4>
                    <p className="bg-black/20 p-3 rounded-md mt-1 text-sm text-gray-300">{campaign.trendingMusic}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-white">Ideia de Thumbnail:</h4>
                    <p className="bg-black/20 p-3 rounded-md mt-1 text-sm text-gray-300">{campaign.thumbnailIdea}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Criação de Conteúdo Autônoma</h1>
                <p className="text-blue-300 mt-1">Gere campanhas virais completas, roteiros e mais em segundos.</p>
            </header>

            <Card>
                <div className="flex border-b border-blue-800/50 mb-6">
                    <button onClick={() => setActiveTool('viral')} className={`py-2 px-4 font-medium transition-colors ${activeTool === 'viral' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Campanha Viral</button>
                    <button onClick={() => setActiveTool('script')} className={`py-2 px-4 text-sm font-medium transition-colors ${activeTool === 'script' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Roteiros</button>
                    <button onClick={() => setActiveTool('thumbnail')} className={`py-2 px-4 text-sm font-medium transition-colors ${activeTool === 'thumbnail' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Thumbnails</button>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">{toolConfig[activeTool].title}</h2>
                    <Input
                        label={activeTool === 'viral' ? "Objetivo da Campanha" : "Descreva sua ideia"}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={toolConfig[activeTool].placeholder}
                    />
                    <Button onClick={handleGenerate} isLoading={isLoading} className="mt-4" disabled={!activeProfile}>
                        Gerar Conteúdo
                    </Button>
                     {!activeProfile && <p className="text-yellow-400 text-sm mt-2">Crie ou selecione um perfil para usar esta ferramenta.</p>}
                </div>
            </Card>

            {(isLoading || result) && (
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Resultado da IA</h2>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full py-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                    ) : (
                        renderResult()
                    )}
                </Card>
            )}
        </div>
    );
};

export default ContentCreation;