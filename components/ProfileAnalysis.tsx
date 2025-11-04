import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { useApp } from '../context/AppContext';
import { analyzeInstagramProfile } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { RocketIcon, CalendarIcon, UserIcon, DownloadIcon } from './icons/EditorIcons';

const ProfileAnalysis: React.FC = () => {
    const { getActiveProfile } = useApp();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const activeProfile = getActiveProfile();

    const handleAnalyze = async () => {
        if (!username || !activeProfile) {
            setError('Por favor, insira um @username e tenha um perfil ativo.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const analysis = await analyzeInstagramProfile(username, activeProfile.niche);
            setResult(analysis);
        } catch (e) {
            console.error(e);
            setError('Ocorreu um erro ao analisar o perfil. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    }

    return (
        <div className="space-y-8">
            <header className="no-print">
                <h1 className="text-3xl font-bold text-white">Análise de Perfil do Instagram</h1>
                <p className="text-blue-300 mt-1">Insira um @ de usuário para receber um plano de crescimento de 7 dias.</p>
            </header>
            
            <Card className="no-print">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <Input 
                            label="Instagram Username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="@seuusuario"
                        />
                    </div>
                    <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!activeProfile}>
                        Analisar Perfil
                    </Button>
                </div>
                {!activeProfile && <p className="text-yellow-400 text-sm mt-2">Crie ou selecione um perfil nas configurações para habilitar a análise.</p>}
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </Card>

            {isLoading && (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg text-blue-300">M.A.R.K. está analisando... Isso pode levar um momento.</p>
                </div>
            )}
            
            {result && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold text-white printable-title">Relatório de Análise para @{username}</h2>
                         <Button onClick={handlePrint} variant="secondary" className="no-print">
                             <DownloadIcon className="h-5 w-5 mr-2" />
                             Exportar Relatório
                         </Button>
                    </div>

                    <Card className="printable-card">
                        <h2 className="text-xl font-bold text-white mb-4">Diagnóstico Rápido</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-blue-900/50 p-4 rounded-lg">
                                <p className="text-sm text-blue-300">Últimos 12 Posts</p>
                                <p className="text-2xl font-bold">{result.summary.last12Posts}</p>
                            </div>
                            <div className="bg-blue-900/50 p-4 rounded-lg">
                                <p className="text-sm text-blue-300">Engajamento Médio</p>
                                <p className="text-2xl font-bold">{result.summary.avgEngagement}</p>
                            </div>
                             <div className="bg-blue-900/50 p-4 rounded-lg">
                                <p className="text-sm text-blue-300">Melhor Horário</p>
                                <p className="text-2xl font-bold">{result.summary.peakHours}</p>
                            </div>
                            <div className="bg-blue-900/50 p-4 rounded-lg">
                                <p className="text-sm text-blue-300">Melhor Conteúdo</p>
                                <p className="text-xl font-bold">{result.summary.topContent}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="printable-card">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center"><UserIcon className="h-5 w-5 mr-2" />Análise de Seguidores</h2>
                        <div className="bg-blue-900/50 p-4 rounded-lg">
                            <p className="text-sm text-blue-300">Estimativa de Seguidores Reais</p>
                            <p className="text-2xl font-bold">{result.followerAnalysis.realFollowerEstimation}</p>
                            <p className="text-sm text-gray-400 mt-2">{result.followerAnalysis.insights}</p>
                        </div>
                    </Card>

                    <Card className="printable-card">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center"><RocketIcon className="h-6 w-6 mr-2 text-blue-400"/>Plano Estratégico de 7 Dias</h2>
                        <div className="space-y-4">
                            {result.sevenDayPlan.map(day => (
                                <div key={day.day} className="p-4 border border-blue-800/50 rounded-lg bg-black/20">
                                    <h3 className="font-bold text-lg text-blue-300 flex items-center"><CalendarIcon className="h-5 w-5 mr-2"/>Dia {day.day}</h3>
                                    <p className="mt-1 font-semibold">{day.action}</p>
                                    <p className="text-sm text-gray-400 mt-2"><strong>Legenda Sugerida:</strong> {day.caption}</p>
                                    {day.hashtags && <p className="text-sm text-blue-400 mt-1 italic">{day.hashtags}</p>}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ProfileAnalysis;