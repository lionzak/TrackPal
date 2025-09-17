import { useEffect, useState } from "react";
import { DollarSign, PiggyBank, Wallet, WalletCards } from "lucide-react";
import TransactionDropdown from "./TransactionDropdown";
import TransactionTable from "./TransactionTable";
import DoughnutChart from "./DoughnutChart";
import { formatDate, getSumByCategory, getTotalBalance, Transaction } from "@/utils/HelperFunc";
import { supabase } from "@/lib/supabaseClient";
import TransactionFilter from "./TransactionFilter";

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

        // get the logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user logged in:", userError);
            return;
        }

        const { data, error } = await supabase
            .from("transactions")
            .insert([
                { ...formData, user_id: user.id } // now user.id is a real uuid, not a promise
            ]);

        if (error) {
            console.error("Error inserting transaction:", error);
        } else {
            console.log("Transaction inserted:", data);
            setTransactions((prev) => [...prev, formData]);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Total Balance */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <DollarSign color="white" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white truncate">Total Balance</div>
                            <div className="text-lg sm:text-2xl font-bold text-white">
                                ${totalBalance.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total income */}
                <div className="bg-gradient-to-r from-orange-400 to-amber-600 rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <Wallet color="white" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white truncate">Total Income</div>
                            <div className="text-lg sm:text-2xl font-bold text-white">
                                ${income.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Savings */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <PiggyBank color="white" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white truncate">Savings</div>
                            <div className="text-lg sm:text-2xl font-bold text-white">
                                ${savings.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spendings */}
                <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <Wallet color="white" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white truncate">Spending</div>
                            <div className="text-lg sm:text-2xl font-bold text-white">
                                ${spendings.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Transaction Form */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6 text-black">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add Transaction</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                        />
                        <input
                            type="text"
                            name="source"
                            placeholder="Source"
                            value={formData.source}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                        />
                        <TransactionDropdown
                            title="Select Transaction Type"
                            options={["Income", "Spending", "Saving", "Investing"]}
                            optionsValue={["Income", "Spending", "Saving", "Investing"]}
                            onChange={(value) => handleDropdownChange("category", value)}
                        />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full"
                        />
                        <input
                            type="text"
                            name="notes"
                            placeholder="Notes (optional)"
                            value={formData.notes}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full sm:col-span-2"
                        />
                        <button
                            type="button"
                            onClick={handleAddTransaction}
                            className="bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 hover:cursor-pointer"
                        >
                            + Add Transaction
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <TransactionFilter filters={filters} setFilters={setFilters} />
            

            {/* Recent Transactions */}
            <TransactionTable transactions={filteredTransactions} />

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
        </div>
    );
};

export default FinanceView;
