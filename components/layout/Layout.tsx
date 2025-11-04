
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Page } from '../../App';
import { MenuIcon } from '../icons/EditorIcons';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a101f] text-gray-200">
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="md:hidden flex justify-between items-center p-4 bg-[#10182c] border-b border-blue-900/50">
          <span className="text-xl font-bold text-blue-400">M.A.R.K.</span>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
      
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" />}
    </div>
  );
};

export default Layout;
