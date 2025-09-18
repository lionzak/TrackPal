import React from 'react'
import BudgetDistributionPieChart from './BudgetDistributionPieChart';

const BudgetOverviewTab = ({ budget, budgetTotals, setIsAddCategoryModalOpen, spendingDistributionData }: { budget: { category: string; budget: number }[]; budgetTotals: Record<string, number>; setIsAddCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>; spendingDistributionData: { name: string; value: number }[]; }) => {
    return (
        <div className="mt-4 text-gray-700">
            <div className="shadow-md">
                <div className="flex justify-between items-center p-4 bg-white rounded-t-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Progress</h3>
                    <button onClick={() => setIsAddCategoryModalOpen(true)} className=" bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors hover:cursor-pointer">
                        + Add Category
                    </button>


                </div>

                <div className="flex flex-col sm:flex-row w-full">
                    <div className="sm:w-1/2 max-h-96 overflow-y-auto min-w-0">
                        {budget.map((item) => {
                            const totalSpent = budgetTotals[item.category] || 0;
                            const percentage = Math.min((totalSpent / item.budget) * 100, 100);
                            return (
                                <div key={item.category} className="m-5 mb-4">
                                    <div className="flex justify-between">
                                        <span className=" text-xl font-bold">{item.category}</span>
                                        <div>
                                            <span className="font-medium text-black">${totalSpent}</span>
                                            <span> / </span>
                                            <span className="font-medium text-black">${item.budget}</span>
                                            <div className="text-end text-gray-500 text-sm"><span>{percentage.toFixed(0)}%</span></div>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex h-2 mb-4 rounded bg-gray-200">
                                            <div
                                                className={`flex h-2 rounded ${percentage >= 90 ? "bg-red-600" : percentage >= 75 ? "bg-yellow-500" : "bg-green-500"}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full sm:w-1/2 max-h-96 flex flex-col mt-8 sm:mt-0">
                        {/* Title aligned left */}
                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">
                            Spending Distribution
                        </h3>
                        {/* Chart centered */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full h-64">
                                <BudgetDistributionPieChart
                                    spendingDistributionData={spendingDistributionData}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default BudgetOverviewTab
