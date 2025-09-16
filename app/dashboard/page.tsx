'use client'
import React, { useState } from 'react';
import { BarChart3, ChartBarStacked } from 'lucide-react';
import DashboardView from '@/components/DashboardView';
import DailyRoutineView from '@/components/DailyRoutineView';
import WeeklyGoalsView from '@/components/WeeklyGoalsView';
import FinanceView from '@/components/FinanceView';
import Navbar from '@/components/Navbar';
import LogoutButton from '@/components/LogoutButton';

const BrainstormApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                                <ChartBarStacked size={24} />
                            </div>
                            <span className="text-xl font-bold text-gray-800">Brainstorm</span>
                        </div>

                        <Navbar activeSection={activeTab} setActiveSection={setActiveTab} />

                        <div className="flex items-center space-x-2">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'Dashboard' && (
                    <DashboardView />
                )}
                {activeTab === 'Routine' && (
                    <DailyRoutineView />
                )}
                {activeTab === 'Goals' && (
                    <WeeklyGoalsView />
                )}
                {activeTab === 'Finance' && (
                    <FinanceView />
                )}
            </main>
        </div>
    );
};

export default BrainstormApp;