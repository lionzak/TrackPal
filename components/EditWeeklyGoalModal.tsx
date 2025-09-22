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
  const [title, setTitle] = useState(goal?.title ?? "");
  const [state, setState] = useState<WeeklyGoal["state"]>(goal?.state ?? "not-started");
  const [tasks, setTasks] = useState<WeeklyGoalTask[]>(goal?.tasks ?? []);

  // Update state if goal changes
  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setState(goal.state);
      setTasks(goal.tasks);
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: 0, // 0 indicates new task, will be inserted in DB
        goal_id: goal.id,
        title: "",
        completed: false,
      },
    ]);
  };

  const handleTaskChange = (id: number, field: keyof WeeklyGoalTask, value: any) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const handleRemoveTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleSave = () => {
    const tasksToSend = tasks.map((task) => ({
      ...task,
      id: task.id > 0 ? task.id : 0, // 0 for new tasks
    }));

    const updatedGoal: WeeklyGoal = {
      ...goal,
      title,
      state,
      tasks: tasksToSend,
    };

    onSave(updatedGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal title"
          className="w-full border rounded p-2 mb-4"
        />

        {/* State */}
        <select
          value={state}
          onChange={(e) => setState(e.target.value as WeeklyGoal["state"])}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Tasks */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Tasks</h3>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTaskChange(task.id, "title", e.target.value)}
                className="flex-1 border rounded p-2"
              />
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => handleTaskChange(task.id, "completed", e.target.checked)}
              />
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddTask}
            className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Task
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWeeklyGoalModal;
