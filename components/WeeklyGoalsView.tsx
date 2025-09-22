import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react';
import AddWeeklyGoalModal from './AddWeeklyGoalModal';
import EditWeeklyGoalModal from './EditWeeklyGoalModal';
import { WeeklyGoal } from '@/types';


const WeeklyGoalsView: React.FC = () => {
    const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);

    const fetchWeeklyGoals = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.rpc("get_weekly_goals_with_tasks", {
            p_user_id: user?.id,
        });

        if (!error) {
            setWeeklyGoals(data as WeeklyGoal[]);
        } else {
            console.error("Error fetching weekly goals:", error);
        }
    };

    const handleSaveGoal = async (goal: {
        title: string;
        state: string;
        tasks: { title: string; completed: boolean }[];
    }) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        await supabase.rpc("insert_weekly_goal_with_tasks", {
            user_id: user?.id,
            title: goal.title,
            state: goal.state,
            tasks: goal.tasks,
        });

        fetchWeeklyGoals();
    };

    const handleToggleTask = async (taskId: number, completed: boolean) => {
        const { data, error } = await supabase.rpc("update_weekly_goal_task_state", {
            p_task_id: taskId,
            p_completed: completed,
        });

        if (error) {
            console.error("Error updating task state:", error);
            return;
        }

        if (data) {
            setWeeklyGoals((prev) =>
                prev.map((goal) => ({
                    ...goal,
                    tasks: goal.tasks.map((task) =>
                        task.id === taskId ? { ...task, completed: data.completed } : task
                    ),
                }))
            );
        }
    };

    const handleUpdateGoal = async (goal: WeeklyGoal) => {
        console.log("Updating goal:", goal);
        
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("User not found");
            return;
        }

        const { data, error } = await supabase.rpc("update_weekly_goal_with_tasks", {
            p_goal_id: goal.id,
            p_user_id: user?.id,
            p_title: goal.title,
            p_state_text: goal.state, // pass string here
            p_tasks: goal.tasks,      // array of task objects (jsonb)
        });

        if (error) {
            console.error("Error updating goal:", error);
            return;
        }

        fetchWeeklyGoals();
    };




    useEffect(() => {
        fetchWeeklyGoals();
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6 text-black">
            {/* Header Section */}
            <div className="flex items-center gap-x-2 text-center self-center">
                <div className='flex w-full justify-between items-center '>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                        Weekly Goals 🎯
                    </h1>
                    <button
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Goal
                    </button>
                </div>
            </div>

            {/* Goals List */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* Not Started */}
                <div className='p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold text-gray-700 mb-5 text-center">Not Started</h2>
                    <div className="space-y-2">
                        {weeklyGoals.filter(goal => goal.state === 'not-started').length > 0 ? (
                            weeklyGoals.filter(goal => goal.state === 'not-started').map(goal => (
                                <div key={goal.id} className="p-4 border rounded-lg shadow-sm bg-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                        <button
                                            className='text-blue-500 hover:underline hover:cursor-pointer'
                                            onClick={() => setEditingGoal(goal)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {goal.tasks.map((t) => (
                                            <li key={t.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={t.completed}
                                                    onChange={(e) => handleToggleTask(t.id, e.target.checked)}
                                                />
                                                <span className={t.completed ? "line-through text-gray-400" : ""}>
                                                    {t.title}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No goals in this category.</p>
                        )}
                    </div>
                </div>

                {/* In Progress */}
                <div className='p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold mb-5 text-center text-amber-500">In Progress</h2>
                    <div className="space-y-4">
                        {weeklyGoals.filter(goal => goal.state === 'in-progress').length > 0 ? (
                            weeklyGoals.filter(goal => goal.state === 'in-progress').map(goal => (
                                <div key={goal.id} className="p-4 border-2 border-yellow-200 rounded-lg shadow-sm bg-yellow-50">
                                    <div className='flex justify-between items-center mb-4'>
                                        <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                        <button
                                            className='text-blue-500 hover:underline hover:cursor-pointer'
                                            onClick={() => setEditingGoal(goal)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {goal.tasks.map((t) => (
                                            <li key={t.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={t.completed}
                                                    onChange={(e) => handleToggleTask(t.id, e.target.checked)}
                                                />
                                                <span className={t.completed ? "line-through text-gray-400" : ""}>
                                                    {t.title}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No goals in this category.</p>
                        )}
                    </div>
                </div>

                {/* Done */}
                <div className='p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold text-green-500 mb-5 text-center">Done</h2>
                    <div className="space-y-4">
                        {weeklyGoals.filter(goal => goal.state === 'done').length > 0 ? (
                            weeklyGoals.filter(goal => goal.state === 'done').map(goal => (
                                <div key={goal.id} className="p-4 border-2 border-green-200 rounded-lg shadow-sm bg-green-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                        <button
                                            className='text-blue-500 hover:underline hover:cursor-pointer'
                                            onClick={() => setEditingGoal(goal)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {goal.tasks.map((t) => (
                                            <li key={t.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={t.completed}
                                                    onChange={(e) => handleToggleTask(t.id, e.target.checked)}
                                                />
                                                <span className={t.completed ? "line-through text-gray-400" : ""}>
                                                    {t.title}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No goals in this category.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add & Edit Modals */}
            <AddWeeklyGoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveGoal}
            />

            {editingGoal && (
                <EditWeeklyGoalModal
                    isOpen={!!editingGoal}
                    onClose={() => setEditingGoal(null)}
                    goal={editingGoal}
                    onSave={handleUpdateGoal}
                />
            )}

        </div>
    );
};

export default WeeklyGoalsView;
