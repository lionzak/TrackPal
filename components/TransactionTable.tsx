import { formatCurrency, formatDate, getAmountStyles, getCategoryStyles, Transaction } from '@/utils/HelperFunc';
import React from 'react';
import ExportMenu from './ExportMenu';
import { LucideEdit, Trash2 } from 'lucide-react'; // or any icon library

interface TransactionTableProps {
  transactions: Transaction[];
  onEditTransaction?: (transaction: Transaction) => void; // callback for editing
  deleteTransaction: (transactionId: number) => void; // callback for deleting
}


const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEditTransaction
  , deleteTransaction
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <ExportMenu transactions={transactions} />
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getCategoryStyles(transaction.category)}>{transaction.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={getAmountStyles(transaction.category)}>{formatCurrency(transaction.amount)}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{transaction.notes}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                    onClick={() => onEditTransaction && onEditTransaction(transaction)}
                  >
                    <LucideEdit size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                    onClick={() => transaction.id !== undefined && deleteTransaction(transaction.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
