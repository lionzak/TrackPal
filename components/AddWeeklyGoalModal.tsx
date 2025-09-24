import { useState } from "react";

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goal: {
        title: string;
        state: string;
        tasks: { title: string; completed: boolean }[];
        priority: "low" | "medium" | "high";
        deadline: string | null;
    }) => void;
}

export default function AddWeeklyGoalModal({ isOpen, onClose, onSave }: AddGoalModalProps) {
    const [title, setTitle] = useState("");
    const [state, setState] = useState("not-started");
    const [tasks, setTasks] = useState<{ title: string; completed: boolean }[]>([]);
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [deadline, setDeadline] = useState<string | null>(null);

    if (!isOpen) return null;

    const addTask = () => {
        setTasks([...tasks, { title: "", completed: false }]);
    };

    const updateTask = (index: number, value: string) => {
        const newTasks = [...tasks];
        newTasks[index].title = value;
        setTasks(newTasks);
    };

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert("Please enter a goal title");
            return;
        }
        onSave({ title, state, tasks, priority, deadline });
        setTitle("");
        setState("not-started");
        setTasks([]);
        setPriority("medium");
        setDeadline(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Goal</h2>

                {/* Goal Title */}
                <label className="block mb-2 text-sm font-medium">Goal Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                    placeholder="Enter goal title"
                />

                {/* Goal State */}
                <label className="block mb-2 text-sm font-medium">Goal State</label>
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4 hover:cursor-pointer"
                >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                {/* Goal Priority */}
                <label className="block mb-2 text-sm font-medium">Goal Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                    className="w-full border rounded-lg px-3 py-2 mb-4 hover:cursor-pointer"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                {/* Goal Deadline */}
                <label className="block mb-2 text-sm font-medium">Goal Deadline</label>
                <input
                    type="date"
                    value={deadline || ""}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                {/* Tasks */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Tasks</label>
                    {tasks.map((task, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={task.title}
                                onChange={(e) => updateTask(index, e.target.value)}
                                placeholder={`Task ${index + 1}`}
                                className="flex-1 border rounded-lg px-3 py-2"
                            />
                            <button
                                type="button"
                                onClick={() => removeTask(index)}
                                className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTask}
                        className="text-sm text-blue-600 hover:underline hover:cursor-pointer"
                    >
                        + Add Task
                    </button>
                </div>


                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    );
}
