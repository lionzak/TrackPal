import { BarChart3 } from "lucide-react";

const FinanceView: React.FC = () => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Finance Tracker 💰</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Expense
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-bold text-lg">+</span>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Income
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-green-600">
                                $4,250
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold text-lg">-</span>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Expenses
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-red-600">
                                $2,180
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">=</span>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-500 truncate">
                                Balance
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-blue-600">
                                $2,070
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="text-center text-gray-500 py-8">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                        <p className="text-gray-500 mb-4">Start tracking your finances by adding your first transaction.</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Add Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceView;