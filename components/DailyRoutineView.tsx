import { DailyRoutineTask } from "@/types";
import { generateQuote } from "@/utils/HelperFunc";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import AddDailyTaskModal from "./AddDailyTaskModal";
import StreakTooltip from "./StreakTooltip";
import { Typography } from "@mui/material";
import { Info, Trash } from "lucide-react";
import { toast } from "sonner";

// Main component for displaying daily routine tasks
const DailyRoutineView: React.FC = () => {
    // Define task categories and their emojis
    const categories = ["growth", "health", "core", "leisure"];
    const categoryEmojis: Record<string, string> = {
        growth: "🔵",
        health: "🟢",
        core: "🟡",
        leisure: "🟣",
    };

    // Info text for each category
    const categoryInfo: Record<string, string> = {
        growth: "Activities that help you learn, improve, and expand your skills — reading, studying, building projects, or learning something new.",
        health: "Tasks that support your physical and mental well-being — exercise, healthy meals, meditation, sleep, or self-care.",
        core: "The essential everyday responsibilities — work, school, chores, or must-do personal commitments.",
        leisure: "Fun and relaxing activities for rest, creativity, and enjoyment — hobbies, games, socializing, or downtime.",
    };

    // State for tasks, quote, and modal visibility
    const [tasks, setTasks] = useState<DailyRoutineTask[]>([]);
    const [quote, setQuote] = useState("");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);


    // Fetch today's tasks from Supabase
    const fetchTasks = async () => {
        const userId = await supabase.auth
            .getUser()
            .then(({ data: { user } }) => user?.id);

        if (!userId) return;

        // Get today's date boundaries
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Query tasks for today
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

        setTasks(data as DailyRoutineTask[]);
    };

    // Toggle completion status for a task
    const handleTaskCompletionToggle = async (taskId: number, completed: boolean) => {
        const { error } = await supabase
            .from("daily_routine_tasks")
            .update({ completed })
            .eq("id", taskId);

        if (error) {
            console.error("Error updating task:", error.message);
            return;
        }

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, completed } : task
            )
        );
    };

    // Delete a task
    const handleTaskDelete = async (taskId: number) => {
        const { error } = await supabase
            .from("daily_routine_tasks")
            .delete()
            .eq("id", taskId);
        if (error) {
            console.error("Error deleting task:", error.message);
            return;
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        toast.success("Task deleted successfully!");
    };

    // On mount, set quote and fetch tasks
    useEffect(() => {
        setQuote(generateQuote());
        fetchTasks();
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-x-2 text-center self-center w-full">
                <div className="flex flex-col sm:flex-row w-full justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                        Daily Routine 📅
                    </h1>
                    <p className="text-gray-600 mb-2 sm:mb-0 sm:mx-4 w-full sm:w-auto text-center sm:text-left">
                        Quote of the day: &quot;{quote}&quot;
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer" onClick={() => setIsAddTaskModalOpen(true)}>
                        Add Task
                    </button>
                </div>
            </div>

            {/* Progress Bar for all tasks */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(tasks.filter((task) => task.completed).length / tasks.length) * 100}%` }} />
                <p className="text-start text-gray-500 mb-2">
                    {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed (
                    {tasks.length > 0
                        ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
                        : 0
                    }%)
                </p>
            </div>

            {/* Routine List */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                {/* Header for the day */}
                <h2 className="text-lg font-semibold text-black mb-4">
                    Today -{" "}
                    {new Date().toLocaleString("en-US", { month: "long" })}{" "}
                    {new Date().getDate()}, {new Date().getFullYear()}
                </h2>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className="p-6 rounded-lg shadow-md bg-gray-100 hover:shadow-lg transition"
                        >
                            {/* Category header with info tooltip and "complete all" checkbox */}
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-md font-semibold text-gray-800 mb-2 capitalize flex items-center">
                                    {categoryEmojis[category]} {category}
                                    <StreakTooltip
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">{category.toUpperCase()}</Typography>
                                                <p style={{ marginTop: "4px", maxWidth: "220px" }}>
                                                    {categoryInfo[category]}
                                                </p>
                                            </React.Fragment>
                                        }
                                    >
                                        <Info size={18} className="cursor-pointer text-gray-500 ml-2" />
                                    </StreakTooltip>
                                </h3>
                                {/* Checkbox for marking all tasks in the category */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={
                                            tasks.filter((task) => task.category === category).length > 0 &&
                                            tasks.filter((task) => task.category === category).every((task) => task.completed)
                                        }
                                        onChange={() => {
                                            const allCompleted = tasks
                                                .filter((task) => task.category === category)
                                                .every((task) => task.completed);
                                            tasks
                                                .filter((task) => task.category === category)
                                                .forEach((task) => {
                                                    handleTaskCompletionToggle(task.id, !allCompleted);
                                                });
                                        }}
                                        className="hidden"
                                    />
                                    <span
                                        className={`w-6 h-6 flex-shrink-0 border-2 rounded-full flex items-center justify-center transition-colors
                                            ${tasks.filter((task) => task.category === category).length > 0 &&
                                                tasks.filter((task) => task.category === category).every((task) => task.completed)
                                                ? "bg-green-500 border-green-500"
                                                : "bg-gray-100 border-gray-400"
                                            }`}
                                    >
                                        {tasks.filter((task) => task.category === category).length > 0 &&
                                            tasks.filter((task) => task.category === category).every((task) => task.completed) && (
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                    </span>
                                </label>
                            </div>

                            {/* Task List for this category */}
                            <ul
                                className={`space-y-2 ${tasks.filter((task) => task.category === category).length > 3
                                    ? "max-h-60 overflow-y-auto"
                                    : ""
                                    }`}
                            >
                                {tasks
                                    .filter((task) => task.category === category)
                                    .map((task) => (
                                        <li
                                            key={task.id}
                                            className="flex items-center gap-x-2 p-2 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
                                        >
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                {/* Hidden native checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() =>
                                                        handleTaskCompletionToggle(task.id, !task.completed)
                                                    }
                                                    className="hidden"
                                                />

                                                {/* Custom checkbox */}
                                                <span
                                                    className={`w-5 h-5 flex-shrink-0 border-2 rounded-full flex items-center justify-center transition-colors
              ${task.completed
                                                            ? "bg-green-500 border-green-500"
                                                            : "bg-gray-100 border-gray-400"
                                                        }`}
                                                >
                                                    {task.completed && (
                                                        <svg
                                                            className="w-3 h-3 text-white"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </label>
                                            <div className="flex w-full justify-between">
                                                <span
                                                    className={`text-md ${task.completed
                                                        ? "line-through text-gray-400"
                                                        : "text-gray-800"
                                                        }`}
                                                >
                                                    {task.title}
                                                </span>
                                                <div className="flex items-center">
                                                    {/* Task creation time */}
                                                    <span className="text-xs text-gray-400 ml-4">
                                                        <span className="mr-1">Created:</span>
                                                        {new Date(task.created_at).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                    {task.start_time && (
                                                        <span className="text-xs text-blue-400 ml-4">
                                                            <span className="mr-1">Start:</span>
                                                            {new Date(`1970-01-01T${task.start_time}`).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    )}
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleTaskDelete(task.id)}
                                                        className="text-sm text-red-500 ml-4 hover:text-red-700 transition hover:cursor-pointer"
                                                    >
                                                        <Trash />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                {/* Show message if no tasks in category */}
                                {tasks.filter((task) => task.category === category).length === 0 && (
                                    <li className="text-gray-500 italic">No tasks in this category.</li>
                                )}
                            </ul>

                            {/* Progress bar for this category */}
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${((tasks.filter(
                                                (t) => t.category === category && t.completed
                                            ).length /
                                                tasks.filter((t) => t.category === category).length) *
                                                100) || 0
                                                }%`,
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {tasks.filter((t) => t.category === category && t.completed)
                                        .length || 0}{" "}/{" "}
                                    {tasks.filter((t) => t.category === category).length || 0}{" "}
                                    tasks completed
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddTaskModalOpen && (
                <AddDailyTaskModal
                    isOpen={isAddTaskModalOpen}
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onTaskAdded={(task) => {
                        setTasks((prevTasks) => [...prevTasks, task]);
                    }}
                />
            )}
        </div>
    );
};

export default DailyRoutineView;