import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { unparse } from "papaparse";
import { startOfWeek, endOfWeek } from "date-fns";

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

export // utils/calcPercentages.ts
function calcPercentages({
  income,
  savings,
  spending,
  balance,
}: {
  income: number;
  savings: number;
  spending: number;
  balance: number;
}) {
  const safeDivide = (a: number, b: number) => (b === 0 ? 0 : (a / b) * 100);

  // Percentages relative to Income
  const savingsPct = safeDivide(savings, income);
  const spendingPct = safeDivide(spending, income);
  const balancePct = safeDivide(balance, income);

  // Percentages relative to all values combined
  const totalAll = income + savings + spending + balance;
  const incomePctAll = safeDivide(income, totalAll);
  const savingsPctAll = safeDivide(savings, totalAll);
  const spendingPctAll = safeDivide(spending, totalAll);
  const balancePctAll = safeDivide(balance, totalAll);

  return {
    // raw values
    income,
    savings,
    spending,
    balance,

    // % of income
    savingsPct,
    spendingPct,
    balancePct,

    // % of all
    incomePctAll,
    savingsPctAll,
    spendingPctAll,
    balancePctAll,
  };
}

export const getThisWeekRange = () => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday = 1
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return {
    start: weekStart.toISOString(),
    end: weekEnd.toISOString(),
  };
};

export const generateQuote = () => {
  const quotes = [
    "Stay focused and never give up!",
    "Every small step counts towards your goal.",
    "Consistency is the key to success.",
    "Believe in yourself and all that you are.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not final; failure is not fatal: it is the courage to continue that counts.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your time is limited, don't waste it living someone else's life.",
    "Success is the sum of small efforts repeated daily.",
    "Dream big, start small, but most importantly, start.",
    "Your future is created by what you do today, not tomorrow.",
    "Courage doesn’t mean you don’t get afraid, it means you don’t let fear stop you.",
    "Discipline is choosing between what you want now and what you want most.",
    "The best way to predict the future is to create it.",
    "Growth begins at the end of your comfort zone.",
    "Don’t count the days, make the days count.",
    "Consistency beats intensity over the long run.",
    "Opportunities don’t happen, you create them.",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export async function getWeeklyProgress() {
  const { start, end } = getThisWeekRange();

  const { data, error } = await supabase
    .from("weekly_goals")
    .select("id, tasks:weekly_goal_tasks(completed)")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) {
    console.error("Error fetching weekly progress:", error);
    return { completed: 0, total: 0 };
  }

  let completed = 0;
  let total = 0;

  data.forEach((goal) => {
    goal.tasks.forEach((task) => {
      total++;
      if (task.completed) completed++;
    });
  });

  return { completed, total };
}
