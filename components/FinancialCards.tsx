import { DollarSign, Wallet, PiggyBank } from 'lucide-react'
import React from 'react'

const FinancialCards = ({ totalBalance, income, spendings, savings }: { totalBalance: number; income: number; spendings: number; savings: number; }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Total Balance */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <DollarSign color="white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-white truncate">Total Balance</div>
                        <div className="text-lg sm:text-2xl font-bold text-white">
                            ${totalBalance.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Total income */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-600 rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Wallet color="white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-white truncate">Total Income</div>
                        <div className="text-lg sm:text-2xl font-bold text-white">
                            ${income.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Savings */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <PiggyBank color="white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-white truncate">Savings</div>
                        <div className="text-lg sm:text-2xl font-bold text-white">
                            ${savings.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Spendings */}
            <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Wallet color="white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-white truncate">Spending</div>
                        <div className="text-lg sm:text-2xl font-bold text-white">
                            ${spendings.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinancialCards
