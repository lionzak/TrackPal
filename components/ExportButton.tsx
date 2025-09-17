import React from "react";
import {  exportPDF } from "@/utils/HelperFunc";

const ExportButton = ({ transactions }: { transactions: any[] }) => {
  return (
    <button
      onClick={() => exportPDF(transactions)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:cursor-pointer transition"
    >
      Export to PDF
    </button>
  );
};

export default ExportButton;
