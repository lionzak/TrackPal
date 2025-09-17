import React from 'react'

const TransactionFilter = ({ filters, setFilters }: {
    filters: {
        category: string,
        source: string,
        date: string,
    }; setFilters: React.Dispatch<React.SetStateAction<any>>;
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Category filter */}
            <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                value={filters.category}
                onChange={(e) => setFilters((prev: typeof filters) => ({ ...prev, category: e.target.value }))}
            >
                <option value="">All Categories</option>
                <option value="Income">Income</option>
                <option value="Spending">Spending</option>
                <option value="Saving">Saving</option>
                <option value="Investing">Investing</option>
            </select>

            {/* Source filter */}
            <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 placeholder-grey-500 text-black"
                placeholder="Filter by source"
                value={filters.source}
                onChange={(e) => setFilters((prev: typeof filters) => ({ ...prev, source: e.target.value }))}
            />

            {/* Date filter */}
            <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                value={filters.date}
                onChange={(e) => {setFilters((prev: typeof filters) => ({ ...prev, date: e.target.value }))
        }}
            />
        </div>
    )
}

export default TransactionFilter
