import React, { Dispatch, SetStateAction } from 'react'
import BudgetTrendChart from './BudgetTrendChart';
import BudgetOverviewTab from './BudgetOverviewTab';
import { setMonthlyBudgetSupabase } from '@/utils/HelperFunc';
import BudgetNavTabs from './BudgetNavTabs';
import { User } from '@supabase/supabase-js';

const FinanceBudgetingSection = ({ monthlyBudget, setMonthlyBudget, budgetTotals, getCurrentUser, monthlyBudgetInput, setMonthlyBudgetInput, activeTab, setActiveTab, budget, trendData, spendingDistributionData, setIsAddCategoryModalOpen }: { monthlyBudget: number; setMonthlyBudget: (budget: number) => void; budgetTotals: Record<string, number>; getCurrentUser: () => Promise<User | null>; monthlyBudgetInput: string; setMonthlyBudgetInput: (input: string) => void; activeTab: string; setActiveTab: (tab: string) => void; budget: { category: string; budget: number }[]; trendData: { month: string; budget: number; spent: number }[]; spendingDistributionData: { name: string; value: number }[], setIsAddCategoryModalOpen: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6 text-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Budgeting For {new Date().toISOString().slice(0, 7)}</h3>
                {monthlyBudget <= 0 && (

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const user = await getCurrentUser();
                            if (!user) return;

                            const amount = Number(monthlyBudgetInput);
                            if (!amount || amount <= 0) {
                                alert("Enter a valid amount");
                                return;
                            }

                            const savedBudget = await setMonthlyBudgetSupabase(user.id, amount);
                            if (savedBudget) {
                                setMonthlyBudget(savedBudget.amount); // ✅ update saved budget
                                setMonthlyBudgetInput(""); // clear input
                            } else {
                                alert("Failed to set budget. Please try again.");
                            }
                        }}
                        className="flex gap-2 pb-4"
                    >
                        <input
                            type="number"
                            min={1}
                            value={monthlyBudgetInput}  // ✅ controlled input
                            onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                            placeholder="Enter monthly budget"
                            className="border rounded px-3 py-1 text-black"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 hover:cursor-pointer transition"
                        >
                            Set Budget
                        </button>
                    </form>

                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                        <h4 className="font-medium  ">Total Budget</h4>
                        <p className="text-lg font-bold">${monthlyBudget}</p>
                    </div>
                    <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-red-400 to-red-600">
                        <h4 className="font-medium">Total Spent</h4>
                        <p className="text-lg font-bold">
                            ${Object.values(budgetTotals).reduce((sum, val) => sum + val, 0)}
                        </p>
                    </div>
                    <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                        <h4 className="font-medium">Total Remaining</h4>
                        <p className="text-lg font-bold">${monthlyBudget - Object.values(budgetTotals).reduce((sum, val) => sum + val, 0)}</p>
                        <p className="text-sm font-md">{((monthlyBudget - Object.values(budgetTotals).reduce((sum, val) => sum + val, 0)) / monthlyBudget * 100).toFixed(0)}%</p>
                    </div>
                </div>
                {/* Navigation Tabs */}
                <BudgetNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === 'overview' && (
                    <BudgetOverviewTab budget={budget} budgetTotals={budgetTotals} setIsAddCategoryModalOpen={setIsAddCategoryModalOpen} spendingDistributionData={spendingDistributionData} />
                )}
                {activeTab === 'trends' && (
                    <BudgetTrendChart trendData={trendData} />
                )}
            </div>
        </div>
    )
}

export default FinanceBudgetingSection
