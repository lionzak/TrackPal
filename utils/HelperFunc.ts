import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { unparse } from "papaparse";

export interface Transaction {
  date: string;
  source: string;
  category: "Income" | "Spending" | "Saving" | "Investing";
  amount: number;
  notes: string;
}

// Sample data that matches your screenshot
export const sampleTransactions: Transaction[] = [
  {
    date: "2025-09-01",
    source: "Allowance",
    category: "Income",
    amount: 50,
    notes: "Weekly allowance",
  },
  {
    date: "2025-09-01",
    source: "Business",
    category: "Spending",
    amount: 15,
    notes: "Domain registration",
  },
  {
    date: "2025-08-30",
    source: "Gift",
    category: "Saving",
    amount: 25,
    notes: "Birthday money",
  },
  {
    date: "2025-08-31",
    source: "Salary",
    category: "Investing",
    amount: 25,
    notes: "Bought some stocks in TSLA",
  },
];

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount}`;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // 👈 use dashes, not slashes
};

// Helper function to get category styling
export const getCategoryStyles = (category: Transaction["category"]) => {
  const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";

  switch (category) {
    case "Income":
      return `${baseStyles} bg-green-100 text-green-800`;
    case "Spending":
      return `${baseStyles} bg-red-100 text-red-800`;
    case "Saving":
      return `${baseStyles} bg-blue-100 text-blue-800`;
    case "Investing":
      return `${baseStyles} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-800`;
  }
};

// Helper function to get amount styling
export const getAmountStyles = (category: Transaction["category"]) => {
  switch (category) {
    case "Income":
    case "Saving":
      return "text-green-600 font-semibold";
    case "Spending":
      return "text-red-600 font-semibold";
    case "Investing":
      return "text-green-600 font-semibold";
    default:
      return "text-gray-900 font-semibold";
  }
};

export const getSumByCategory = (
  transactions: Transaction[],
  category: string
) =>
  transactions
    .filter((t) => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);

export const getTotalBalance = (
  income: number,
  spendings: number,
  savings: number,
  investing: number
) => income - spendings + savings + investing;

export const exportCSV = (transactions: Transaction[]) => {
  // Convert array of objects → CSV string
  const csv = unparse(transactions);

  // Create a blob
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("TrackPal - Transactions Report", 14, 20);

  // Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Table rows
  const tableColumn = ["Date", "Source", "Category", "Amount", "Notes"];
  const tableRows: any[] = [];

  transactions.forEach((t) => {
    tableRows.push([
      t.date,
      t.source,
      t.category,
      `$${t.amount}`,
      t.notes || "",
    ]);
  });

  // ✅ Now autoTable works
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
  });

  // Save file
  doc.save(`transactions_${new Date().toISOString().slice(0, 10)}.pdf`);
};
