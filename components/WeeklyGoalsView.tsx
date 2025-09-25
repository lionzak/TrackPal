import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react';
import AddWeeklyGoalModal from './AddWeeklyGoalModal';
import EditWeeklyGoalModal from './EditWeeklyGoalModal';
import { WeeklyGoal } from '@/types';
import { generateQuote, getThisWeekRange } from '@/utils/HelperFunc';
import WeeklyProgressBar from './WeeklyProgressBar';
import WeeklyGoalsCards from './WeeklyGoalsCards';
import { WeeklyStreak } from './WeeklyStreak';

const WeeklyGoalsView: React.FC = () => {
    const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
    const [quote, setQuote] = useState("");

    const fetchWeeklyGoals = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { start, end } = getThisWeekRange();

        const { data, error } = await supabase
            .from("weekly_goals")
            .select(
                `
      id,
      title,
      state,
      created_at,
      priority,
      deadline,
      tasks:weekly_goal_tasks(
        id,
        goal_id,
        title,
        completed
      )
    `
            )
            .eq("user_id", user.id)
            .gte("created_at", start)
            .lte("created_at", end)
            .order("created_at", { ascending: false }).order("priority", { ascending: false });
        ;

        if (error) {
            console.error("Error fetching weekly goals:", error);
            return;
        }

        if (data) setWeeklyGoals(data as WeeklyGoal[]);
    };

    useEffect(() => {
        fetchWeeklyGoals();
        setQuote(generateQuote());
    }, []);

    const handleSaveGoal = async (goal: {
        title: string;
        state: string;
        tasks: { title: string; completed: boolean }[];
        priority: "low" | "medium" | "high";
        deadline: string | null;
    }) => {
        // Insert goal
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: insertedGoal, error } = await supabase
            .from('weekly_goals')
            .insert([{ user_id: user.id, title: goal.title, state: goal.state, priority: goal.priority, deadline: goal.deadline }])
            .select('*')
            .single();

        if (error || !insertedGoal) {
            console.error('Error inserting goal:', error);
            return;
        }

        // Insert tasks 
        let insertedTasks: typeof goal.tasks = [];
        if (goal.tasks.length > 0) {
            const { data: tasksData, error: tasksError } = await supabase
                .from('weekly_goal_tasks')
                .insert(
                    goal.tasks.map((t) => ({
                        goal_id: insertedGoal.id,
                        title: t.title,
                        completed: t.completed,
                    }))
                )
                .select('*');

            if (tasksError) {
                console.error('Error inserting tasks:', tasksError);
                return;
            }

            insertedTasks = tasksData || [];
        }

        // Refetch goals to ensure consistency
        await fetchWeeklyGoals();
    };

    const handleUpdateGoal = async (updatedGoal: WeeklyGoal) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            console.log("Updating goal:", updatedGoal);

            // 1. Update goal title/state
            const { error: goalError } = await supabase
                .from('weekly_goals')
                .update({ title: updatedGoal.title, state: updatedGoal.state, priority: updatedGoal.priority, deadline: updatedGoal.deadline })
                .eq('id', updatedGoal.id)
                .eq('user_id', user.id);

            if (goalError) {
                console.error('Error updating goal:', goalError);
                return;
            }
            console.log("Goal updated successfully");

            // 2. Fetch existing tasks from DB
            const { data: existingTasks, error: fetchTasksError } = await supabase
                .from('weekly_goal_tasks')
                .select('*')
                .eq('goal_id', updatedGoal.id);

            if (fetchTasksError) {
                console.error('Error fetching existing tasks:', fetchTasksError);
                return;
            }

            // 3. Handle insert/update
            for (const task of updatedGoal.tasks) {
                if (task.id < 0) {
                    // New task (temporary negative ID)
                    const { error: insertError } = await supabase
                        .from('weekly_goal_tasks')
                        .insert({
                            goal_id: updatedGoal.id,
                            title: task.title,
                            completed: task.completed,
                        });
                    if (insertError) console.error('Error inserting new task:', insertError);
                } else {
                    // Existing task - update
                    const { error: updateError } = await supabase
                        .from('weekly_goal_tasks')
                        .update({
                            title: task.title,
                            completed: task.completed,
                        })
                        .eq('id', task.id)
                        .eq('goal_id', updatedGoal.id);

                    if (updateError) console.error('Error updating task:', updateError);
                }
            }

            // 4. Handle deletion
            const updatedTaskIds = updatedGoal.tasks.filter(t => t.id > 0).map(t => t.id);
            const tasksToDelete = existingTasks?.filter(t => !updatedTaskIds.includes(t.id)) || [];

            for (const task of tasksToDelete) {
                const { error: deleteError } = await supabase
                    .from('weekly_goal_tasks')
                    .delete()
                    .eq('id', task.id);

                if (deleteError) console.error('Error deleting task:', deleteError);
                else console.log('Deleted task:', task.id);
            }

            // 5. Refresh UI
            await fetchWeeklyGoals();
            console.log("Goals refreshed after update");

        } catch (err) {
            console.error("Unexpected error in handleUpdateGoal:", err);
        }
    };

    const handleToggleTask = async (taskId: number, completed: boolean) => {
        try {
            // 1. Update the task state
            const { data: updatedTask, error: taskError } = await supabase
                .rpc("update_weekly_goal_task_state", {
                    p_task_id: taskId,
                    p_completed: completed,
                });

            if (taskError) {
                console.error("Error updating task state:", taskError);
                return;
            }

            // 2. Get the goal_id for this task
            const { data: taskData, error: fetchTaskError } = await supabase
                .from("weekly_goal_tasks")
                .select("goal_id")
                .eq("id", taskId)
                .single();

            if (fetchTaskError || !taskData) {
                console.error("Error fetching task goal_id:", fetchTaskError);
                return;
            }

            const goalId = taskData.goal_id;

            // 3. Get all tasks of this goal
            const { data: tasks, error: tasksError } = await supabase
                .from("weekly_goal_tasks")
                .select("id, completed")
                .eq("goal_id", goalId);

            if (tasksError || !tasks) {
                console.error("Error fetching tasks:", tasksError);
                return;
            }

            // 4. Determine new goal state
            const total = tasks.length;
            const completedCount = tasks.filter((t) => t.completed).length;

            let newState = "not-started";
            if (completedCount === total) {
                newState = "done";
            } else if (completedCount > 0) {
                newState = "in-progress";
            }

            // 5. Update the goal state
            const { error: goalError } = await supabase
                .from("weekly_goals")
                .update({ state: newState })
                .eq("id", goalId);

            if (goalError) {
                console.error("Error updating goal state:", goalError);
            }

            // 6. Refetch goals for UI consistency
            await fetchWeeklyGoals();
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    const handleDeleteGoal = async (goalId: number) => {
        const { error } = await supabase.from('weekly_goals').delete().eq('id', goalId);
        if (error) {
            console.error('Error deleting goal:', error);
            return;
        }

        // Refetch goals to ensure consistency
        await fetchWeeklyGoals();
    };


    return (
        <div className="space-y-4 sm:space-y-6 text-black">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-x-2 text-center self-center w-full">
            <div className="flex flex-col sm:flex-row w-full justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                Weekly Goals 🎯
                </h1>
                <p className="text-gray-600 mb-2 sm:mb-0 sm:mx-4 w-full sm:w-auto text-center sm:text-left">
                Quote of the day: &quot;{quote}&quot;
                </p>
                <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                >
                Add Goal
                </button>
            </div>
            </div>

            <div className='mb-10'>
            <WeeklyProgressBar goals={weeklyGoals} />
            </div>

            {/* Streak */}
            <WeeklyStreak />

            <WeeklyGoalsCards weeklyGoals={weeklyGoals} setEditingGoal={setEditingGoal} handleDeleteGoal={handleDeleteGoal} handleToggleTask={handleToggleTask} />

            {/* Modals */}
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