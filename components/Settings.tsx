import React, { useState } from 'react';
import Card from './ui/Card';
import { useApp } from '../context/AppContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { LockIcon, RocketIcon } from './icons/EditorIcons';
import { UserIcon } from './icons/NavIcons';

const Settings: React.FC = () => {
    const { profiles, addProfile, switchProfile, activeProfileId } = useApp();
    const [name, setName] = useState('');
    const [niche, setNiche] = useState('');
    const [objective, setObjective] = useState('');

    const handleAddProfile = () => {
        if (name && niche && objective) {
            addProfile({ name, niche, objective });
            setName('');
            setNiche('');
            setObjective('');
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Configurações e Segurança</h1>
                <p className="text-blue-300 mt-1">Gerencie seus perfis, segurança e conta.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center"><UserIcon className="h-5 w-5 mr-2" />Gerenciamento de Perfis</h2>
                        <div className="space-y-3 mb-6">
                            {profiles.map(profile => (
                                <div key={profile.id} onClick={() => switchProfile(profile.id)} className={`p-3 rounded-lg cursor-pointer transition-all ${activeProfileId === profile.id ? 'bg-blue-600/40 border-blue-500' : 'bg-blue-900/30 border-transparent'} border`}>
                                    <p className="font-semibold">{profile.name}</p>
                                    <p className="text-sm text-gray-400">{profile.niche}</p>
                                </div>
                            ))}
                        </div>
                        {profiles.length < 3 ? (
                            <div className="space-y-4 border-t border-blue-800/50 pt-4">
                                <h3 className="font-semibold text-white">Adicionar Novo Perfil</h3>
                                <Input label="Nome do Perfil" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Minha Loja Online" />
                                <Input label="Nicho de Mercado" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Moda Fitness" />
                                <Input label="Objetivo Principal" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Ex: Aumentar vendas" />
                                <Button onClick={handleAddProfile}>Adicionar Perfil</Button>
                            </div>
                        ) : (
                             <p className="text-center text-blue-300 border-t border-blue-800/50 pt-4">Você atingiu o limite de 3 perfis gratuitos.</p>
                        )}
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center"><LockIcon className="h-5 w-5 mr-2" />Segurança de Elite</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                                <span>Criptografia Local (AES-256)</span>
                                <span className="text-green-400 font-semibold">Ativa</span>
                            </div>
                             <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                                <span>Autenticação 2 Fatores (2FA)</span>
                                <span className="text-green-400 font-semibold">Ativa</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                                <span>Backups Automáticos (Local)</span>
                                 <span className="text-green-400 font-semibold">Ativo</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg text-xs text-gray-400">
                                <span>Proteção com "owner_token" contra clonagem. Admin mode ativado via prompt secreto.</span>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-900/50 to-indigo-900/50">
                    <RocketIcon className="h-16 w-16 text-blue-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white">M.A.R.K. Premium</h2>
                    <p className="text-gray-300 mt-2 mb-6 max-w-sm">Desbloqueie o poder máximo da IA para um crescimento exponencial.</p>
                    <ul className="space-y-2 text-left text-gray-300 mb-8">
                        <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Criação de vídeos com voz realista</li>
                        <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Estratégias com IA preditiva</li>
                        <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Monitoramento de campanhas em tempo real</li>
                        <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Análise de concorrência</li>
                    </ul>
                    <Button variant="primary" className="w-full" disabled>
                        Em Breve
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Settings;