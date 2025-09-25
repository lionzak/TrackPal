import { DistributionData, exportCSV, exportPDF, MonthlySummary, Transaction, TrendData } from "@/utils/HelperFunc";
import { useState } from "react";

const ExportMenu = ({ transactions, monthlySummary, trendData, distributionData }: { transactions: Transaction[], monthlySummary: Record<string, MonthlySummary>, trendData: TrendData[], distributionData: DistributionData[] }) => {
  const [format, setFormat] = useState("");

  const handleExport = () => {
    if (format === "csv") {
      exportCSV(transactions);
    } else if (format === "pdf") {
      exportPDF(transactions, monthlySummary, trendData, distributionData);
    } else {
      alert("Please select a format first!");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="border px-3 py-2 rounded-lg bg-gray-600 text-white hover:cursor-pointer"
      >
        <option value="" disabled>Choose format</option>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:cursor-pointer transition "
      >
        Export
      </button>
    </div>
  );
};

export default ExportMenu;