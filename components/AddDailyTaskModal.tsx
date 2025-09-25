"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DailyRoutineTask } from "@/types";
import { toast } from "sonner";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskAdded: (task: DailyRoutineTask) => void;
}

const categories = ["growth", "health", "core", "leisure"];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onTaskAdded }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("growth");
    const [loading, setLoading] = useState(false);

    const handleAddTask = async () => {
        if (!title.trim()) return;

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("daily_routine_tasks")
            .insert([
                {
                    title,
                    category,
                    user_id: user.id,
                    completed: false,
                },
            ])
            .select()
            .single();

        setLoading(false);


        if (error) {
            console.error("Error adding task:", error.message);
            return;
        }

        if (data) {
            onTaskAdded(data as DailyRoutineTask);
            setTitle("");
            setCategory("growth");
            onClose();
        }
        toast.success("Task added successfully!");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-black placeholder:text-black">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>

                <div className="space-y-4">
                    {/* Title input */}
                    <input
                        type="text"
                        placeholder="Task title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Category select */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c} className="capitalize">
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddTask}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 hover:cursor-pointer"
                    >
                        {loading ? "Adding..." : "Add Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
