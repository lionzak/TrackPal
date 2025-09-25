import { useTab } from "@/hooks/TabContext";
import { supabase } from "@/lib/supabaseClient";
import { DailyRoutineTask, WeeklyGoal } from "@/types";
import { getCurrentUser, getMonthlyBudget, getSumByCategory, getThisWeekRange, getTotalBalance, Transaction } from "@/utils/HelperFunc";
import { set } from "date-fns";
import { useEffect, useState } from "react";

interface AppProps {
    displayName: string;
}

const DashboardView: React.FC<AppProps> = ({ displayName }) => {
    const [dailyTasks, setDailyTasks] = useState<DailyRoutineTask[]>([]);
    const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [budgetTotals, setBudgetTotals] = useState<Record<string, number>>({});
    const [budget, setBudget] = useState<{ category: string; budget: number }[]>([]);




    const { setActiveTab } = useTab();

    // --- Derived totals ---
    const income = getSumByCategory(transactions, "Income");
    const spendings = getSumByCategory(transactions, "Spending");
    const savings = getSumByCategory(transactions, "Saving");
    const investing = getSumByCategory(transactions, "Investing");
    const totalBalance = getTotalBalance(income, spendings, savings, investing);

    const fetchDailyTasks = async () => {
        const userId = await supabase.auth
            .getUser()
            .then(({ data: { user } }) => user?.id);

        if (!userId) return;

        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from("daily_routine_tasks")
            .select("*")
            .order("created_at", { ascending: false })
            .eq("user_id", userId)
            .gte("created_at", startOfDay.toISOString())
            .lte("created_at", endOfDay.toISOString());

        if (error) {
            console.error("Error fetching tasks:", error.message);
            return;
        }

        setDailyTasks(data as DailyRoutineTask[]);
    };

    const fetchWeeklyGoals = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { start, end } = getThisWeekRange();

        const { data, error } = await supabase
            .from("weekly_goals")
            .select(
                `
          id,
          state,
          tasks:weekly_goal_tasks(
            id,
            goal_id,
            title,
            completed
          )
        `
            )
            .eq("user_id", user.id)
            .gte("created_at", start)
            .lte("created_at", end)
            .order("created_at", { ascending: false })
            .order("priority", { ascending: false });

        if (error) {
            console.error("Error fetching weekly goals:", error);
            return;
        }

        if (data) setWeeklyGoals(data as WeeklyGoal[]);
    };

    const fetchTransactions = async () => {
        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id);

        if (error) console.error(error);
        else if (data) setTransactions(data);
    };

    const fetchMonthlyBudget = async () => {
        const user = await getCurrentUser();
        if (!user) return;
        const monthlyBudgetValue = await getMonthlyBudget(user.id);
        setMonthlyBudget(monthlyBudgetValue);
    };

    const fetchBudget = async () => {
        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("budgets")
            .select("*")
            .eq("user_id", user.id)

        if (error) console.error(error);
        else if (data) setBudget(data);
    };

    const fetchBudgetTotals = () => {
        const totals: Record<string, number> = {};
        for (const item of budget) {
            totals[item.category] = transactions
                .filter(
                    t =>
                        t.source.trim().toLowerCase() === item.category.trim().toLowerCase() &&
                        t.category === "Spending" && t.date.startsWith(new Date().toISOString().slice(0, 7)) // current month
                )
                .reduce((sum, t) => sum + t.amount, 0);
        }
        setBudgetTotals(totals);
    };

    useEffect(() => {
        fetchTransactions();
        fetchBudget();
        fetchMonthlyBudget();
        fetchDailyTasks();
        fetchWeeklyGoals();
    }, []);

    useEffect(() => {
        if (transactions.length && budget.length) {
            fetchBudgetTotals();
        }
    }, [transactions, budget]);


    const monthlySpending = [
        { month: "Sep", amount: 150.75 },
        { month: "Aug", amount: 300.50 },
        { month: "Jul", amount: 250.25 },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="text-white bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                    {(() => {
                        const hour = new Date().getHours();
                        let greeting = "Welcome back";
                        if (hour >= 5 && hour < 12) greeting = "Good morning";
                        else if (hour >= 12 && hour < 18) greeting = "Good afternoon";
                        else greeting = "Good evening";
                        return `${greeting}, ${displayName.split(" ")[0]}!`;
                    })()}
                </h1>
                <p className="text-sm sm:text-base">
                    Ready to crush today&apos;s goals?
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-5 bg-white shadow-lg w-full rounded-lg">
                    <p className="text-lg font-semibold text-black">Progress</p>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{
                                    width: `${dailyTasks.length > 0
                                        ? (dailyTasks.filter(task => task.completed).length / dailyTasks.length) * 100
                                        : 0
                                        }%`
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {`${dailyTasks.filter(task => task.completed).length} of ${dailyTasks.length} daily tasks completed`}
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{
                                    width: `${weeklyGoals.length > 0
                                        ? (weeklyGoals.filter(goal => goal.state === "done").length / weeklyGoals.length) * 100
                                        : 0
                                        }%`
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {weeklyGoals.length > 0
                                ? `${((weeklyGoals.filter(goal => goal.state === "done").length / weeklyGoals.length) * 100).toFixed(0)}% of your weekly tasks completed`
                                : "0% of your weekly tasks completed"}
                        </p>
                    </div>
                </div>
                <div className="p-5 bg-white shadow-lg w-full rounded-lg">
                    <p className="text-lg font-semibold text-black">Today&apos;s Focus</p>
                    <div className="mt-4 space-y-2">
                        {dailyTasks.length > 0 ? dailyTasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center space-x-3">
                                <input type="checkbox" checked={task.completed} readOnly className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <div className="flex justify-between items-center w-full">
                                    <label className={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</label>
                                    <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">{task.category.toLocaleUpperCase()} - {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )) : <p className="text-sm text-gray-600">No tasks for today, add in your tasks</p>}
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Financial Overview */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>

                    {/* Balance summary */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Current Balance</p>
                            <p className="text-lg font-semibold text-gray-900">${totalBalance}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">This Month&apos;s Budget</p>
                            <p className="text-lg font-semibold text-gray-900">${monthlyBudget}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 col-span-2">
                            <p className="text-xs text-gray-500">Total Spending</p>
                            <p className="text-lg font-semibold text-gray-900">${spendings}</p>
                        </div>
                    </div>

                    {/* Budget progress */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Spending Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full"
                                style={{ width: `${Math.floor((Object.values(budgetTotals).reduce((sum, val) => sum + val, 0) / monthlyBudget) * 100) || 0}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Math.floor((Object.values(budgetTotals).reduce((sum, val) => sum + val, 0) / monthlyBudget) * 100) || 0}% of budget used</p>
                    </div>

                </div>

                {/* Quick Actions*/}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 h-fit">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer"
                            onClick={() => {
                                setActiveTab("Routine");
                            }}
                        >
                            Add Task
                        </button>
                        <button
                            className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer"
                            onClick={() => {
                                setActiveTab("Finance");
                            }}
                        >
                            Log Expense
                        </button>
                        <button
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer col-span-2"
                            onClick={() => {
                                setActiveTab("Goals");
                            }}
                        >
                            Set Goal
                        </button>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default DashboardView;