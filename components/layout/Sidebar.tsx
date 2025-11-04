import React from 'react';
import { Page } from '../../App';
import Logo from '../ui/Logo';
import { DashboardIcon, AnalysisIcon, ContentIcon, ToolsIcon, SettingsIcon, MentorIcon } from '../icons/NavIcons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'analysis', label: 'Análise de Perfil', icon: AnalysisIcon },
    { id: 'creation', label: 'Criação de Conteúdo', icon: ContentIcon },
    { id: 'tools', label: 'Ferramentas', icon: ToolsIcon },
    { id: 'mentor', label: 'Mentor IA', icon: MentorIcon },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 h-full bg-[#10182c] border-r border-blue-900/50 flex flex-col p-4 no-print">
      <div className="flex items-center justify-center py-6 mb-8">
        <Logo className="h-12 w-12" />
        <h1 className="text-2xl font-bold ml-3 text-white tracking-wider">M.A.R.K.</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.id}
            onClick={() => setCurrentPage(item.id as Page)}
          />
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>M.A.R.K. Resource Kit v2.0</p>
        <p>&copy; {new Date().getFullYear()} - Autonomous Marketing</p>
      </div>
    </aside>
  );
};

export default Sidebar;