import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { useApp } from '../context/AppContext';
import { generateDashboardInsight, analyzeCompetitors } from '../services/geminiService';
import { RocketIcon, TargetIcon, TrendingUpIcon } from './icons/EditorIcons';
import { CompetitorAnalysis } from '../types';

const initialData = [
  { name: 'Sem 1', Engajamento: 2.5, Alcance: 4000 },
  { name: 'Sem 2', Engajamento: 2.8, Alcance: 4500 },
  { name: 'Sem 3', Engajamento: 3.5, Alcance: 5200 },
  { name: 'Sem 4', Engajamento: 3.2, Alcance: 6100 },
  { name: 'Sem 5', Engajamento: 4.1, Alcance: 7000 },
  { name: 'Sem 6', Engajamento: 4.5, Alcance: 7800 },
];

const MetricCard: React.FC<{ title: string; value: string; trend: string; Icon: React.ElementType }> = ({ title, value, trend, Icon }) => (
    <Card className="flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm font-medium">{title}</span>
            <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <p className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{trend}</p>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    const { getActiveProfile } = useApp();
    const activeProfile = getActiveProfile();
    const [insight, setInsight] = useState<string>('Gerando insight diário...');
    const [isLoadingInsight, setIsLoadingInsight] = useState(true);
    const [competitors, setCompetitors] = useState('');
    const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[] | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const projectedData = useMemo(() => {
        const last = initialData[initialData.length - 1].Engajamento;
        const secondLast = initialData[initialData.length - 2].Engajamento;
        const trend = last - secondLast;
        const projection = [
            { name: 'Sem 7', Engajamento: Math.max(0, parseFloat((last + trend).toFixed(1))) },
            { name: 'Sem 8', Engajamento: Math.max(0, parseFloat((last + trend * 2).toFixed(1))) },
        ];
        return [...initialData, ...projection];
    }, []);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoadingInsight(true);
            try {
                const result = await generateDashboardInsight();
                setInsight(result);
            } catch (error) {
                setInsight("Não foi possível carregar o insight diário.");
            } finally {
                setIsLoadingInsight(false);
            }
        };
        fetchInsight();
    }, []);

    const handleAnalyzeCompetitors = async () => {
        if (!competitors) return;
        setIsLoadingAnalysis(true);
        setCompetitorAnalysis(null);
        try {
            const competitorList = competitors.split(',').map(c => c.trim()).filter(Boolean);
            if(competitorList.length > 0) {
                const result = await analyzeCompetitors(competitorList);
                setCompetitorAnalysis(result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingAnalysis(false);
        }
    }

    if (!activeProfile) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="text-center">
                    <h2 className="text-2xl font-bold text-white">Nenhum Perfil Ativo</h2>
                    <p className="mt-2 text-gray-400">Por favor, selecione ou crie um perfil nas Configurações para ver o dashboard.</p>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Dashboard para {activeProfile.name}</h1>
                <p className="text-blue-300 mt-1">Aqui está um resumo preditivo do seu desempenho.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Engajamento" value="4.5%" trend="+0.4% vs semana passada" Icon={TargetIcon} />
                <MetricCard title="Alcance" value="7.8K" trend="+12% vs semana passada" Icon={RocketIcon} />
                <MetricCard title="Crescimento" value="+152" trend="+5% vs semana passada" Icon={TrendingUpIcon} />
                <MetricCard title="CTR" value="2.1%" trend="-0.2% vs semana passada" Icon={TargetIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-semibold text-white mb-4">Projeção de Engajamento</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/><stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#10182c', border: '1px solid #1e3a8a' }} />
                                <Area type="monotone" dataKey="Engajamento" stroke="#3b82f6" fill="url(#colorEngagement)" strokeWidth={2} />
                                <ReferenceLine x={initialData[initialData.length - 1].name} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-semibold text-white mb-4">Resumo Estratégico</h3>
                    {isLoadingInsight ? (
                        <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                    ) : (
                        <div className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-md h-full">{insight}</div>
                    )}
                </Card>
            </div>
            <Card>
                <h3 className="font-semibold text-white mb-4">Análise de Concorrência</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <Input label="Perfis Concorrentes" id="competitors" value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="@concorrente1, @concorrente2" />
                    </div>
                    <Button onClick={handleAnalyzeCompetitors} isLoading={isLoadingAnalysis}>Analisar</Button>
                </div>
                {isLoadingAnalysis && <div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}
                {competitorAnalysis && (
                    <div className="mt-6 space-y-4">
                        {competitorAnalysis.map(analysis => (
                            <div key={analysis.competitor} className="p-4 border border-blue-800/50 rounded-lg bg-black/20">
                                <h4 className="font-bold text-lg text-blue-300">@{analysis.competitor}</h4>
                                <p className="text-sm mt-2"><strong>Pontos Fortes:</strong> {analysis.strengths}</p>
                                <p className="text-sm mt-1"><strong>Pontos Fracos:</strong> {analysis.weaknesses}</p>
                                <p className="text-sm mt-1 text-amber-300"><strong>Estratégia para Superar:</strong> {analysis.strategyToOutperform}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;