import { useEffect, useState } from "react";
import { DollarSign, PiggyBank, Wallet, WalletCards } from "lucide-react";
import TransactionDropdown from "./TransactionDropdown";
import TransactionTable from "./TransactionTable";
import DoughnutChart from "./DoughnutChart";
import { formatDate, getSumByCategory, getTotalBalance, Transaction } from "@/utils/HelperFunc";
import { supabase } from "@/lib/supabaseClient";
import TransactionFilter from "./TransactionFilter";
import TransactionEditingModal from "./TransactionEditingModal";
import { SmartFinancialInsights } from "./SmartFinancialInsights";
import FinancialCards from "./FinancialCards";
import TransactionForm from "./TransactionForm";

const FinanceView: React.FC = () => {
    // State for transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);

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

    return (
        <div className="space-y-4 sm:space-y-6">
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


        </div>
    );
};

export default FinanceView;
