import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4444", "#AA00FF", "#FF00AA", "#FF8800"]; //add more colors

const BudgetDistributionPieChart = ({
  spendingDistributionData,
}: {
  spendingDistributionData: { name: string; value: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={spendingDistributionData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={(props) => `${props.name}: ${props.value}%`}
          labelLine={true}
        >
          {spendingDistributionData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`$${value}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetDistributionPieChart;
