import { useEffect, useState } from "react";
import { WalletCards } from "lucide-react";
import TransactionTable from "./TransactionTable";
import DoughnutChart from "./DoughnutChart";
import { formatDate, getSumByCategory, getTotalBalance, getTotalSpendingBySource, Transaction } from "@/utils/HelperFunc";
import { supabase } from "@/lib/supabaseClient";
import TransactionFilter from "./TransactionFilter";
import TransactionEditingModal from "./TransactionEditingModal";
import { SmartFinancialInsights } from "./SmartFinancialInsights";
import FinancialCards from "./FinancialCards";
import TransactionForm from "./TransactionForm";
import AddBudgetCategoryModal from "./AddBudgetCategoryModal";

const FinanceView: React.FC = () => {
    // State for transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState('overview');


    // State for form fields
    const [formData, setFormData] = useState<Transaction>({
        date: "",
        source: "",
        amount: 0,
        category: "Income",
        notes: "",
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    // Handle dropdowns
    const handleDropdownChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add transaction
    const handleAddTransaction = async () => {
        if (!formData.date || !formData.source || !formData.category || !formData.amount) {
            alert("Please fill all required fields");
            return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user logged in:", userError);
            return;
        }

        // Insert and return the generated row including id
        const { data, error } = await supabase
            .from("transactions")
            .insert([{ ...formData, user_id: user.id }])
            .select(); // important to get the inserted row with id

        if (error) {
            console.error("Error inserting transaction:", error);
        } else if (data && data.length > 0) {
            const newTransaction: Transaction = data[0]; // contains id
            setTransactions((prev) => [...prev, newTransaction]);
            setFormData({ date: "", source: "", category: "Income", amount: 0, notes: "" });
        }
    };

    const fetchTransactions = async () => {
        // get the logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user logged in:", userError);
            return;
        }

        const { data: transactions, error: fetchError } = await supabase
            .from("transactions")
            .select("*")
            .eq('user_id', user.id);

        if (fetchError) {
            console.error("Error fetching transactions:", fetchError);
        } else {
            console.log("data", transactions);
            setTransactions(transactions);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const [filters, setFilters] = useState({
        category: "",
        source: "",
        date: "",
    });

    const filteredTransactions = transactions.filter((t) => {
        const matchCategory = filters.category ? t.category === filters.category : true;
        const matchSource = filters.source ? t.source.toLowerCase().includes(filters.source.toLowerCase()) : true;
        const matchDate = filters.date ? formatDate(t.date) === filters.date : true;
        return matchCategory && matchSource && matchDate;
    });


    // State for modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", budget: 0 });

    const handleAddCategory = async () => {
        if (!newCategory.name || newCategory.budget <= 0) return;
        setBudget([...budget, { category: newCategory.name, budget: newCategory.budget }]);

        //add to supabase
        const { data, error } = await supabase
            .from("budgets")
            .insert([{ category: newCategory.name, budget: newCategory.budget, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) {
            console.error("Error adding budget category:", error);
        } else {
            if (data) {
                setBudget((prev) => [...prev, ...data]);
            }
        }
        setNewCategory({ name: "", budget: 0 });
        setIsAddCategoryModalOpen(false);
    };


    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormData(transaction); // fill the form
        setIsEditModalOpen(true);
    };


    const handleUpdateTransaction = async () => {
        if (!editingTransaction) return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user logged in:", userError);
            return;
        }

        const { data, error } = await supabase
            .from("transactions")
            .update({
                date: formData.date,
                source: formData.source,
                category: formData.category,
                amount: formData.amount,
                notes: formData.notes
            })
            .eq("id", editingTransaction.id) // use the id to update
            .select(); // return updated row

        if (error) {
            console.error("Error updating transaction:", error);
        } else if (data && data.length > 0) {
            const updatedTransaction: Transaction = data[0];
            setTransactions((prev) =>
                prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
            );
            setIsEditModalOpen(false);
            setEditingTransaction(null);
        }
    };

    const deleteTransaction = async (transactionId: number) => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user logged in:", userError);
            return;
        }

        const { data, error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", transactionId)
            .select();

        if (error) {
            console.error("Error deleting transaction:", error);
        } else if (data && data.length > 0) {
            setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
        }
    };

    const income = getSumByCategory(transactions, "Income");
    const spendings = getSumByCategory(transactions, "Spending");
    const savings = getSumByCategory(transactions, "Saving");
    const investing = getSumByCategory(transactions, "Investing");
    const totalBalance = getTotalBalance(income, spendings, savings, investing);

    const [budgetTotals, setBudgetTotals] = useState<Record<string, number>>({});




    // Sample budget data
    const [budget, setBudget] = useState([
        { category: 'Food', budget: 800, },
        { category: 'Transport', budget: 300 },
        { category: 'Entertainment', budget: 200 },
        { category: 'Shopping', budget: 400 },
        { category: 'Bills', budget: 1200 },
        { category: 'Savings', budget: 500 },
    ]);

    useEffect(() => {
        const fetchBudget = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error("No user logged in:", userError);
                return;
            }

            const { data, error } = await supabase
                .from("budgets")
                .select("*")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching budget:", error);
            } else if (data) {
                setBudget(data);
            }
        };

        fetchBudget();
    }, []);

    const fetchBudgetTotals = async () => {
        const totals: Record<string, number> = {};
        for (const item of budget) {
            totals[item.category] = await getTotalSpendingBySource(item.category);
        }
        setBudgetTotals(totals);
    };

    useEffect(() => {
        fetchBudgetTotals();
    }, [budget, transactions]);

    return (
        <div className="space-y-4 sm:space-y-6 ">
            <div className="flex items-center gap-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                    Finance Tracker
                </h1>
                <WalletCards color="green" />
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6 text-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Budgeting</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                            <h4 className="font-medium  ">Total Budget</h4>
                            <p className="text-lg font-bold">$asd</p>
                        </div>
                        <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-red-400 to-red-600">
                            <h4 className="font-medium">Total Spent</h4>
                            <p className="text-lg font-bold">$asds</p>
                        </div>
                        <div className="shadow-md p-5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                            <h4 className="font-medium">Total Remaining</h4>
                            <p className="text-lg font-bold">$asds</p>
                        </div>
                    </div>
                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mt-8">
                        {['overview', 'categories', 'trends', 'insights'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-400'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'overview' && (
                        <div className="mt-4 text-gray-700">
                            <div className="shadow-md">
                                <div className="flex justify-between items-center p-4 bg-white rounded-t-lg">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Progress</h3>
                                    <button onClick={() => setIsAddCategoryModalOpen(true)} className=" bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors hover:cursor-pointer">
                                        + Add Category
                                    </button>


                                </div>

                                <div className="flex w-full">
                                    <div className="w-1/2 max-h-96 overflow-y-auto min-w-0">
                                        {budget.map((item) => {
                                            const totalSpent = budgetTotals[item.category] || 0;
                                            const percentage = Math.min((totalSpent / item.budget) * 100, 100);
                                            return (
                                                <div key={item.category} className="m-5 mb-4">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">{item.category}</span>
                                                        <div>
                                                            <span className="font-medium text-black">${totalSpent}</span>
                                                            <span> / </span>
                                                            <span className="font-medium text-black">${item.budget}</span>
                                                            <div className="text-end text-gray-500 text-sm"><span>{percentage.toFixed(0)}%</span></div>
                                                        </div>

                                                    </div>
                                                    <div className="relative pt-1">

                                                        <div className="flex h-2 mb-4 rounded bg-gray-200">
                                                            <div
                                                                className={`flex h-2 rounded ${percentage >= 90 ? "bg-red-600" : percentage >= 75 ? "bg-yellow-500" : "bg-green-500"}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="w-1/2 max-h-96 overflow-y-auto min-w-0">
                                        {budget.map((item) => {
                                            const totalSpent = budgetTotals[item.category] || 0;
                                            const percentage = Math.min((totalSpent / item.budget) * 100, 100);
                                            return (
                                                <div key={item.category} className="m-5 mb-4">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">{item.category}</span>
                                                        <div>
                                                            <span className="font-medium text-black">${totalSpent}</span>
                                                            <span> / </span>
                                                            <span className="font-medium text-black">${item.budget}</span>
                                                            <div className="text-end text-gray-500 text-sm"><span>{percentage.toFixed(0)}%</span></div>
                                                        </div>

                                                    </div>
                                                    <div className="relative pt-1">

                                                        <div className="flex h-2 mb-4 rounded bg-gray-200">
                                                            <div
                                                                className={`flex h-2 rounded ${percentage >= 90 ? "bg-red-600" : percentage >= 75 ? "bg-yellow-500" : "bg-green-500"}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>


                            </div>
                        </div>)}
                </div>
            </div>

            <SmartFinancialInsights transactions={transactions} />

            {isEditModalOpen && editingTransaction && (
                <TransactionEditingModal
                    formData={formData}                // use the form state
                    setFormData={setFormData}          // allow changes
                    setIsEditModalOpen={setIsEditModalOpen}
                    handleChange={handleChange}
                    handleDropdownChange={handleDropdownChange}
                    handleUpdateTransaction={handleUpdateTransaction}
                />
            )}

            {/* Add Category Modal */}
            {isAddCategoryModalOpen && <AddBudgetCategoryModal isAddCategoryModalOpen={isAddCategoryModalOpen} setIsAddCategoryModalOpen={setIsAddCategoryModalOpen} newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory} />} // add all props


        </div>
    );
};

export default FinanceView;
