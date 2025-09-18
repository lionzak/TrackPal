import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { unparse } from "papaparse";

export interface Transaction {
  id?: number;
  date: string;
  source: string;
  category: "Income" | "Spending" | "Saving" | "Investing";
  amount: number;
  notes: string;
}

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

//Example function to summarize monthly totals
export const getMonthlySummary = (transactions: Transaction[]) => {
  const summary: Record<
    string,
    { income: number; spending: number; savings: number; investing: number }
  > = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toISOString().slice(0, 7); // "YYYY-MM"
    if (!summary[month])
      summary[month] = { income: 0, spending: 0, savings: 0, investing: 0 };

    if (t.category === "Income") summary[month].income += t.amount;
    else if (t.category === "Spending") summary[month].spending += t.amount;
    else if (t.category === "Saving") summary[month].savings += t.amount;
    else if (t.category === "Investing") summary[month].investing += t.amount;
  });

  return summary;
};

export const getTotalSpendingBySource = async (source: string) => {
  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("No user logged in:", userError);
    return 0;
  }

  // Query the sum of spending for this source
  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("category", "Spending") // only spendings
    .eq("source", source);

  if (error) {
    console.error("Error fetching total:", error);
    return 0;
  }

  // Calculate total
  const total = data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  return total;
};

export const setMonthlyBudgetSupabase = async (
  userId: string,
  amount: number
) => {
  const monthYear = new Date().toISOString().slice(0, 7); // "2025-09"

  const { data, error } = await supabase
    .from("monthly_budgets")
    .upsert(
      { user_id: userId, amount, month_year: monthYear },
      { onConflict: "user_id,month_year" }
    )
    .select();

  if (error) {
    console.error("Error setting monthly budget:", error);
    return null;
  }
  return data?.[0] ?? null;
};

export const getMonthlyBudget = async (userId: string) => {
  const monthYear = new Date().toISOString().slice(0, 7);

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("amount, user_id, month_year")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .maybeSingle();

  console.log("Fetched monthly budget:", data, error);
  console.log("Saving budget:", userId, monthYear, data?.amount);

  if (error) {
    console.error("Error fetching monthly budget:", error);
    return null;
  }

  return data?.amount ?? 0;
};

export async function getMonthlyBudgets(userId: string) {
  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("month_year, amount")
    .eq("user_id", userId)
    .order("month_year");

  if (error) {
    console.error("Error fetching monthly budgets:", error);
    return [];
  }
  return data; // [{ month_year: "2025-05", amount: 3400 }, ...]
}


export const fetchTrendData = async (userId: string, transactions: any[]) => {
  // 1. Get monthly budgets
  const budgets = await getMonthlyBudgets(userId);

  // 2. Match each budget with spending
  const trend = budgets.map((b) => {
    const spent = transactions
      .filter(
        (t) => t.category === "Spending" && t.date.startsWith(b.month_year) // matches YYYY-MM
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const monthLabel = new Date(b.month_year + "-01").toLocaleString(
      "default",
      {
        month: "short",
      }
    );

    return {
      month: monthLabel,
      budget: b.amount,
      spent,
    };
  });

  return trend;
};
