import React from 'react'

const BudgetNavTabs = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void; }) => {
    return (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mt-8">
            {['overview', 'trends'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`hover:cursor-pointer flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-400'
                        }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    )
}

export default BudgetNavTabs
