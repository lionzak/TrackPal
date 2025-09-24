"use client";
import React, { useState, useEffect } from "react";
import { WeeklyGoal, WeeklyGoalTask } from "@/types";

interface EditWeeklyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: WeeklyGoal | null;
  onSave: (goal: WeeklyGoal) => void;
}


const EditWeeklyGoalModal: React.FC<EditWeeklyGoalModalProps> = ({
  isOpen,
  onClose,
  goal,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [state, setState] = useState<WeeklyGoal["state"]>("not-started");
  const [tasks, setTasks] = useState<WeeklyGoalTask[]>([]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(goal ? goal.priority : "medium");
  const [deadline, setDeadline] = useState<string | null>(goal ? goal.deadline : null);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setState(goal.state);
      setTasks([...goal.tasks]); // copy tasks to local state
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  let tempTaskIdCounter = -1;

  const handleAddTask = () => {
    const newTask: WeeklyGoalTask = {
      id: tempTaskIdCounter--,
      goal_id: goal!.id,
      title: "",
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };



  const handleTaskTitleChange = (taskId: number, newTitle: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: newTitle } : t));
  };

  const handleTaskCompletedChange = (taskId: number, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Goal title is required");
      return;
    }

    const validTasks = tasks.filter(t => t.title.trim() !== "");

    onSave({
      ...goal,
      title: title.trim(),
      state,
      tasks: validTasks,
      priority,
      deadline,
    });

    onClose();
  };

  const handleCancel = () => {
    if (goal) {
      setTitle(goal.title);
      setState(goal.state);
      setTasks([...goal.tasks]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter goal title"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as WeeklyGoal["state"])}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {/* Deadline */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Deadline</label>
          <input
            type="date"
            value={deadline || ""}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tasks */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">Tasks</label>
            <button
              onClick={handleAddTask}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm hover:cursor-pointer transition"
            >
              + Add Task
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No tasks yet. Click &quot;Add Task&quot; to get started.</p>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded flex-wrap"
                >
                  <label className="flex items-center space-x-2 cursor-pointer flex-1 min-w-0">
                    {/* Hidden native checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleTaskCompletedChange(task.id, e.target.checked)}
                      className="hidden"
                    />

                    {/* Custom checkbox */}
                    <span
                      className={`w-6 h-6 flex-shrink-0 border-2 rounded-full flex items-center justify-center transition-colors
                        ${task.completed ? "bg-green-500 border-green-500" : "bg-gray-100 border-gray-400"}`}
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

                    {/* Task title input */}
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                      placeholder="Enter task title"
                      className="flex-1 border-0 outline-none bg-transparent text-gray-900 min-w-0"
                    />
                  </label>

                  <div className="flex-shrink-0 ml-2 sm:ml-0 sm:order-none order-2">
                    <button
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 hover:cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWeeklyGoalModal;
