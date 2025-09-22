import React, { SetStateAction } from 'react'
import TransactionDropdown from './TransactionDropdown'
import { Transaction } from '@/utils/HelperFunc'

const TransactionEditingModal = ({ formData, setIsEditModalOpen, handleChange, handleDropdownChange, handleUpdateTransaction }: {formData: {
        date: string,
        source: string,
        amount: number,
        category: string,
        notes: string,
    }, setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleDropdownChange: (name: string, value: string) => void, handleUpdateTransaction: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50  text-black flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Transaction</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                    />
                    <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        value={formData.source}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                    />
                    <TransactionDropdown
                        title="Transaction Type"
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
                        className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                    />
                    <input
                        type="text"
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg py-2 px-3 w-full placeholder-gray-500"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            className="bg-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-400 hover:cursor-pointer"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 hover:cursor-pointer"
                            onClick={handleUpdateTransaction}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default TransactionEditingModal
