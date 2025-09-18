'use client';   
import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Target, Plus, Edit3, Lightbulb } from 'lucide-react';

const BudgetTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Sample budget data
  const [budgetData, setBudgetData] = useState([
    { category: 'Food', budget: 800, spent: 650, color: '#FF6B6B', icon: '🍽️' },
    { category: 'Transport', budget: 300, spent: 320, color: '#4ECDC4', icon: '🚗' },
    { category: 'Entertainment', budget: 200, spent: 180, color: '#45B7D1', icon: '🎬' },
    { category: 'Shopping', budget: 400, spent: 250, color: '#96CEB4', icon: '🛍️' },
    { category: 'Bills', budget: 1200, spent: 1200, color: '#FECA57', icon: '📄' },
    { category: 'Savings', budget: 500, spent: 500, color: '#6C5CE7', icon: '💰' },
  ]);

  // Trend data for line chart
  const trendData = [
    { month: 'Jan', budget: 3400, spent: 3100 },
    { month: 'Feb', budget: 3400, spent: 3300 },
    { month: 'Mar', budget: 3400, spent: 3500 },
    { month: 'Apr', budget: 3400, spent: 3200 },
    { month: 'May', budget: 3400, spent: 3400 },
    { month: 'Jun', budget: 3400, spent: 3100 },
  ];

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 85) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getTotalBudget = () => budgetData.reduce((sum, item) => sum + item.budget, 0);
  const getTotalSpent = () => budgetData.reduce((sum, item) => sum + item.spent, 0);

  const getAlerts = () => {
    return budgetData.filter(item => (item.spent / item.budget) >= 0.85).map(item => ({
      category: item.category,
      percentage: Math.round((item.spent / item.budget) * 100),
      isOverBudget: item.spent > item.budget
    }));
  };

  const getTips = () => {
    const tips = [];
    const overBudgetCategories = budgetData.filter(item => item.spent > item.budget);
    const underBudgetCategories = budgetData.filter(item => (item.spent / item.budget) < 0.7);

    if (overBudgetCategories.length > 0) {
      tips.push(`You're over budget in ${overBudgetCategories[0].category}. Consider reducing expenses or adjusting your budget.`);
    }

    if (underBudgetCategories.length > 0) {
      tips.push(`Great job staying under budget in ${underBudgetCategories[0].category}! Consider reallocating some funds to savings.`);
    }

    const totalSpent = getTotalSpent();
    const totalBudget = getTotalBudget();
    if (totalSpent < totalBudget * 0.8) {
      tips.push('You\'re doing great with overall spending! Consider increasing your savings goal.');
    }

    return tips.length > 0 ? tips : ['Keep tracking your expenses to maintain good financial habits!'];
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className=" mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-blue-600" size={28} />
            Budget Tracker
          </h1>
          <p className="text-gray-600 mt-1">Manage your monthly spending goals</p>
        </div>
      </div>

      {/* Alert Banner */}
      {getAlerts().length > 0 && (
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500">
          <div className=" mx-auto px-4 py-3">
            <div className="flex items-center">
              <AlertTriangle className="text-orange-600" size={20} />
              <div className="ml-3">
                <p className="text-sm text-orange-800">
                  <span className="font-medium">Budget Alert:</span> You&apos;re approaching or exceeding limits in {getAlerts().length} categor{getAlerts().length === 1 ? 'y' : 'ies'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className=" mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">${getTotalBudget().toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${getTotalSpent().toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">${(getTotalBudget() - getTotalSpent()).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTotalSpent() < getTotalBudget() ? (
                    <TrendingDown className="text-green-500 mr-1" size={16} />
                  ) : (
                    <TrendingUp className="text-red-500 mr-1" size={16} />
                  )}
                  <span className={`text-sm ${getTotalSpent() < getTotalBudget() ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(((getTotalBudget() - getTotalSpent()) / getTotalBudget()) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {['overview', 'categories', 'trends', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
              
              <div className="space-y-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-gray-900">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.spent} / ${item.budget}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(getProgressPercentage(item.spent, item.budget))}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(item.spent, item.budget)}`}
                        style={{ width: `${getProgressPercentage(item.spent, item.budget)}%` }}
                      ></div>
                    </div>
                    
                    {item.spent > item.budget && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Over budget by ${item.spent - item.budget}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="spent"
                      label={(props) => `${props.category}: $${props.spent}`}
                      labelLine={false}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: NewType) => [`$${value}`, 'Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.category}</h3>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit3 size={16} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">${item.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-medium">${item.spent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className={`font-medium ${item.budget - item.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${item.budget - item.spent}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.spent, item.budget)}`}
                      style={{ width: `${getProgressPercentage(item.spent, item.budget)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center">
                    <span className={`text-sm font-medium ${getProgressPercentage(item.spent, item.budget) >= 100 ? 'text-red-600' : getProgressPercentage(item.spent, item.budget) >= 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {Math.round(getProgressPercentage(item.spent, item.budget))}% used
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData as { month: string; budget: number; spent: number }[]}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Budget"
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Actual Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Smart Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Lightbulb className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
              </div>
              
              <div className="space-y-3">
                {getTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Alerts */}
            {getAlerts().length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Alerts</h3>
                <div className="space-y-3">
                  {getAlerts().map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${alert.isOverBudget ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${alert.isOverBudget ? 'text-red-800' : 'text-yellow-800'}`}>
                            {alert.category}
                          </p>
                          <p className={`text-sm ${alert.isOverBudget ? 'text-red-600' : 'text-yellow-600'}`}>
                            {alert.isOverBudget ? 'Over budget' : 'Approaching limit'} - {alert.percentage}% used
                          </p>
                        </div>
                        <AlertTriangle className={alert.isOverBudget ? 'text-red-500' : 'text-yellow-500'} size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;