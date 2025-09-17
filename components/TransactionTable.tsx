import { formatCurrency, formatDate, getAmountStyles, getCategoryStyles, sampleTransactions, Transaction } from '@/utils/HelperFunc';
import React from 'react';
import ExportMenu from './ExportMenu';


interface TransactionTableProps {
  transactions?: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions = sampleTransactions 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <ExportMenu transactions={transactions} />
      </div>
      
      {/* Table Container with horizontal scroll for mobile */}
      <div className="overflow-x-auto sm:overflow-x-a">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getCategoryStyles(transaction.category)}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={getAmountStyles(transaction.category)}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.notes}
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