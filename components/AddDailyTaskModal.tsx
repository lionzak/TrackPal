"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DailyRoutineTask } from "@/types";
import { toast } from "sonner";
// import { LocalNotifications } from '@capacitor/local-notifications'; // COMMENTED OUT

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskAdded: (task: DailyRoutineTask) => void;
}

const categories = ["growth", "health", "core", "leisure"];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onTaskAdded }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("growth");
    const [startTime, setStartTime] = useState("");
    const [loading, setLoading] = useState(false);

    // Request notification permissions on component mount
    useEffect(() => {
        /*
        const requestPermissions = async () => {
            const permStatus = await LocalNotifications.checkPermissions();
            if (permStatus.display !== 'granted') {
                const result = await LocalNotifications.requestPermissions();
                if (result.display !== 'granted') {
                    toast.warning("Notification permissions denied. Reminders won't work.");
                }
            }
        };
        if (isOpen) {
            requestPermissions();
        }
        */
    }, [isOpen]);

    const handleAddTask = async () => {
        if (!title.trim()) {
            toast.error("Please enter a task title.");
            return;
        }

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("User not authenticated.");
            return;
        }

        const { data, error } = await supabase
            .from("daily_routine_tasks")
            .insert([
                {
                    title,
                    category,
                    user_id: user.id,
                    completed: false,
                    start_time: startTime || null,
                },
            ])
            .select()
            .single();

        setLoading(false);

        if (error) {
            console.error("Error adding task:", error.message);
            toast.error("Failed to add task.");
            return;
        }

        if (data) {
            onTaskAdded(data as DailyRoutineTask);
            setTitle("");
            setCategory("growth");
            setStartTime("");
            onClose();

            // Schedule notification if startTime is provided
            /*
            if (data.start_time) {
                const [hours, minutes] = data.start_time.split(':').map(Number);
                if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
                    console.error('Invalid start_time format:', data.start_time);
                    toast.error("Invalid start time format.");
                    return;
                }

                const now = new Date(); // e.g., Fri Sep 26 2025 16:08:00 EEST
                const scheduledDate = new Date(now);
                scheduledDate.setHours(hours, minutes, 0, 0);

                // If time is in the past, schedule for tomorrow
                if (scheduledDate <= now) {
                    scheduledDate.setDate(scheduledDate.getDate() + 1);
                }

                try {
                    await LocalNotifications.schedule({
                        notifications: [
                            {
                                id: data.id, // Use task ID as notification ID
                                title: `Trackpal Reminder: ${data.title}`,
                                body: `It's time for your ${data.category} task. Let's keep the consistency going!`,
                                schedule: { at: scheduledDate, allowWhileIdle: true },
                            }
                        ]
                    });
                    console.log(`Notification scheduled for task ${data.id} at ${scheduledDate.toLocaleString()}`);
                    toast.success("Task and reminder added successfully!");
                } catch (error) {
                    console.error('Scheduling failed:', error);
                    toast.error("Task added, but reminder failed to schedule. Check permissions.");
                }
            } else {
                toast.success("Task added successfully!");
            }
            */
            toast.success("Task added successfully!");
        }
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
                    {/* Start Time input */}
                    <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                        Start Time (optional)
                    </label> 
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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