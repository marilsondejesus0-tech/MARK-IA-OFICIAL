import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LockScreen from './components/LockScreen';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import ProfileAnalysis from './components/ProfileAnalysis';
import ContentCreation from './components/ContentCreation';
import Tools from './components/Tools';
import Settings from './components/Settings';
import MentorChat from './components/MentorChat';

export type Page = 'dashboard' | 'analysis' | 'creation' | 'tools' | 'settings' | 'mentor';

const MainApp: React.FC = () => {
    const { isAuthenticated } = useApp();
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    if (!isAuthenticated) {
        return <LockScreen />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'analysis':
                return <ProfileAnalysis />;
            case 'creation':
                return <ContentCreation />;
            case 'tools':
                return <Tools />;
            case 'settings':
                return <Settings />;
            case 'mentor':
                return <MentorChat />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderPage()}
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;