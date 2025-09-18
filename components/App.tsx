'use client';

import React, { useState } from 'react';
import { BarChart3, Menu, X } from 'lucide-react';
import DashboardView from '@/components/DashboardView';
import DailyRoutineView from '@/components/DailyRoutineView';
import WeeklyGoalsView from '@/components/WeeklyGoalsView';
import FinanceView from '@/components/FinanceView';
import Navbar from '@/components/Navbar';
import LogoutButton from '@/components/LogoutButton';

interface AppProps {
  displayName: string;
}

const App: React.FC<AppProps> = ({ displayName }) => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <BarChart3 size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                TrackPal
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navbar activeSection={activeTab} setActiveSection={setActiveTab} />
            </div>

            {/* Desktop Logout Button */}
            <div className="hidden md:flex items-center space-x-2">
              <LogoutButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <Navbar
                  activeSection={activeTab}
                  setActiveSection={(section) => {
                    setActiveTab(section);
                    setIsMobileMenuOpen(false);
                  }}
                  isMobile={true}
                />
                <div className="pt-4 border-t border-gray-200">
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === 'Dashboard' && <DashboardView displayName={displayName} />}
        {activeTab === 'Routine' && <DailyRoutineView />}
        {activeTab === 'Goals' && <WeeklyGoalsView />}
        {activeTab === 'Finance' && <FinanceView />}
      </main>
    </div>
  );
};

export default App;
