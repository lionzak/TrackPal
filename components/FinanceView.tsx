import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import DoughnutChart from "./DoughnutChart";
import { fetchTrendData, formatDate, getMonthlyBudget, getSumByCategory, getTotalBalance, Transaction } from "@/utils/HelperFunc";
import TransactionFilter from "./TransactionFilter";
import TransactionEditingModal from "./TransactionEditingModal";
import FinancialCards from "./FinancialCards";
import TransactionForm from "./TransactionForm";
import AddBudgetCategoryModal from "./AddBudgetCategoryModal";
import Image from "next/image";
import FinanceBudgetingSection from "./FinanceBudgetingSection";

const FinanceView: React.FC = () => {
    // State for transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState("overview");

    // Form state
    const [formData, setFormData] = useState<Transaction>({
        date: "",
        source: "",
        amount: 0,
        category: "Income",
        notes: "",
    });

    // Transaction filters
    const [filters, setFilters] = useState({
        category: "",
        source: "",
        date: "",
    });

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ category: "", budget: 0 });

    // Budget state
    const [budget, setBudget] = useState<{ category: string; budget: number }[]>([]);
    const [budgetTotals, setBudgetTotals] = useState<Record<string, number>>({});

    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [monthlyBudgetInput, setMonthlyBudgetInput] = useState<string>("");   // ✅ input field


    // --- Helper to get current user ---
    const getCurrentUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error(error);
            return null;
        }
        return user;
    };

    // --- Fetch transactions from Supabase ---
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

    // --- Fetch budget from Supabase ---
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

    useEffect(() => {
        fetchTransactions();
        fetchBudget();
    }, []);

    // --- Calculate budget totals ---
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
        fetchBudgetTotals();
        const fetchMonthlyBudget = async () => {
            const user = await getCurrentUser();
            if (!user) return;
            const monthlyBudgetValue = await getMonthlyBudget(user.id);
            setMonthlyBudget(monthlyBudgetValue);
        };
        fetchMonthlyBudget();
    }, [budget, transactions]);

    // --- Transaction form handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTransaction = async () => {
        if (!formData.date || !formData.source || !formData.category || !formData.amount) {
            alert("Please fill all required fields");
            return;
        }

        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("transactions")
            .insert([{ ...formData, user_id: user.id }])
            .select();

        if (error) console.error(error);
        else if (data && data.length > 0) {
            setTransactions((prev) => [...prev, data[0]]);
            setFormData({ date: "", source: "", category: "Income", amount: 0, notes: "" });
        }
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormData(transaction);
        setIsEditModalOpen(true);
    };

    const handleUpdateTransaction = async () => {
        if (!editingTransaction) return;

        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("transactions")
            .update({ ...formData })
            .eq("id", editingTransaction.id)
            .select();

        if (error) console.error(error);
        else if (data && data.length > 0) {
            setTransactions((prev) =>
                prev.map((t) => (t.id === data[0].id ? data[0] : t))
            );
            setIsEditModalOpen(false);
            setEditingTransaction(null);
        }
    };

    const deleteTransaction = async (transactionId: number) => {
        const user = await getCurrentUser();
        if (!user) return;

        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", transactionId);

        if (error) console.error(error);
        else setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    };

    // --- Budget category handlers ---
    const handleAddCategory = async () => {
        if (!newCategory.category || newCategory.budget <= 0) return;

        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("budgets")
            .insert([{ ...newCategory, user_id: user.id }])
            .select();

        if (error) console.error(error);
        else if (data) setBudget((prev) => [...prev, ...data]);

        setNewCategory({ category: "", budget: 0 });
        setIsAddCategoryModalOpen(false);
    };

    // Prepare data for PieChart
    const spendingDistributionData = budget.map((item) => ({
        name: item.category,
        value: Math.floor((budgetTotals[item.category] / item.budget * 100) || 0),
    }));

    // --- Derived totals ---
    const income = getSumByCategory(transactions, "Income");
    const spendings = getSumByCategory(transactions, "Spending");
    const savings = getSumByCategory(transactions, "Saving");
    const investing = getSumByCategory(transactions, "Investing");
    const totalBalance = getTotalBalance(income, spendings, savings, investing);

    // --- Filtered transactions ---
    const filteredTransactions = transactions.filter((t) => {
        const matchCategory = filters.category ? t.category === filters.category : true;
        const matchSource = filters.source
            ? t.source.toLowerCase().includes(filters.source.toLowerCase())
            : true;
        const matchDate = filters.date ? formatDate(t.date) === filters.date : true;
        return matchCategory && matchSource && matchDate;
    });

    //trends
    const [trendData, setTrendData] = useState<
        { month: string; budget: number; spent: number }[]
    >([]);

    useEffect(() => {
        const loadTrend = async () => {
            const user = await getCurrentUser();
            if (!user) return;

            const trend = await fetchTrendData(user.id, transactions);
            setTrendData(trend);
        };

        if (transactions.length > 0) {
            loadTrend();
        }
    }, [transactions]);



    return (
        <div className="space-y-4 sm:space-y-6 ">
            <div className="flex items-center gap-x-2 text-center self-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                    Finance Tracker
                </h1>
                <Image src="/wallet.svg" alt="Finance Tracker" width={40} height={40} />
            </div>

            {/* Cards */}
            <FinancialCards
                totalBalance={totalBalance}
                income={income}
                spendings={spendings}
                savings={savings}
            />

            {/* Add Transaction Form */}
            <TransactionForm
                formData={formData}
                handleChange={handleChange}
                handleDropdownChange={handleDropdownChange}
                handleAddTransaction={handleAddTransaction}
            />

            {/* Filters */}
            <TransactionFilter filters={filters} setFilters={setFilters} />


            {/* Recent Transactions */}
            <TransactionTable transactions={filteredTransactions} onEditTransaction={handleEditTransaction} deleteTransaction={deleteTransaction} />


            {/* Financial Overview */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6 text-black">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h3>
                    <DoughnutChart
                        savings={savings}
                        spendings={spendings}
                        investing={investing}
                        balance={totalBalance}
                    />
                </div>
            </div>

            {/* Budgeting */}
            <FinanceBudgetingSection
                monthlyBudget={monthlyBudget}
                setMonthlyBudget={setMonthlyBudget}
                budgetTotals={budgetTotals}
                getCurrentUser={getCurrentUser}
                monthlyBudgetInput={monthlyBudgetInput}
                setMonthlyBudgetInput={setMonthlyBudgetInput}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                budget={budget}
                trendData={trendData}
                spendingDistributionData={spendingDistributionData}
                setIsAddCategoryModalOpen={setIsAddCategoryModalOpen}
            />


            {isEditModalOpen && editingTransaction && (
                <TransactionEditingModal
                    formData={formData}                // use the form state
                    setFormData={setFormData}          // allow changes
                    setIsEditModalOpen={setIsEditModalOpen}
                    handleChange={handleChange}
                    handleDropdownChange={handleDropdownChange}
                    handleUpdateTransaction={handleUpdateTransaction}
                />)}

            {/* Add Category Modal */}
            {isAddCategoryModalOpen && <AddBudgetCategoryModal isAddCategoryModalOpen={isAddCategoryModalOpen} setIsAddCategoryModalOpen={setIsAddCategoryModalOpen} newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory} />}


        </div>
    );
};

export default FinanceView;