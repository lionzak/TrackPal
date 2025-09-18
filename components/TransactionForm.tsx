import { Transaction } from '@/utils/HelperFunc'
import React from 'react'
import TransactionDropdown from './TransactionDropdown'

const TransactionForm = ({ formData, handleChange, handleDropdownChange, handleAddTransaction }: {formData: Transaction, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleDropdownChange: (name: string, value: string) => void, handleAddTransaction: () => void}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6 text-black">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add Transaction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                    />
                    <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        value={formData.source}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                    />
                    <TransactionDropdown
                        title="Select Transaction Type"
                        options={["Income", "Spending", "Saving", "Investing"]}
                        optionsValue={["Income", "Spending", "Saving", "Investing"]}
                        onChange={(value) => handleDropdownChange("category", value)}
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                    />
                    <input
                        type="text"
                        name="notes"
                        placeholder="Notes (optional)"
                        value={formData.notes}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-3 px-4 w-full sm:col-span-2"
                    />
                    <button
                        type="button"
                        onClick={handleAddTransaction}
                        className="bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 hover:cursor-pointer"
                    >
                        + Add Transaction
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionForm
