import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BudgetTrendChart = ({ trendData }: { trendData: { month: string; budget: number; spent: number }[] }) => {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
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
  )
}

export default BudgetTrendChart
