"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  savings: number;
  spendings: number;
  investing: number;
  balance: number;
}

export default function DoughnutChart({ savings, spendings, investing, balance }: DoughnutChartProps) {
  const data = {
    labels: ["Savings", "Spendings", "Investing", "Balance"],
    datasets: [
      {
        label: "Money Breakdown",
        data: [savings, spendings, investing, balance],
        backgroundColor: [
          "rgb(219,234,254)",   // savings - blue
          "rgba(255, 99, 132, 0.6)",   // spendings - red
          "rgba(255, 206, 86, 0.6)",   // investing - yellow
          "rgba(75, 192, 192, 0.6)",   // balance - green
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <div className="w-full h-72">
    <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>;
}
