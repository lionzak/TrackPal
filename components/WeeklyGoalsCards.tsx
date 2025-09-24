import { WeeklyGoal } from '@/types'
import React from 'react'

const WeeklyGoalsCards = ({ weeklyGoals, setEditingGoal , handleDeleteGoal, handleToggleTask}: {weeklyGoals: WeeklyGoal[], setEditingGoal: (goal: WeeklyGoal) => void, handleDeleteGoal: (goalId: number) => void, handleToggleTask: (taskId: number, completed: boolean) => void}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['not-started', 'in-progress', 'done'].map((state) => (
                <div key={state} className="p-6 rounded-lg shadow-xl bg-white">
                    <h2
                        className={`text-lg font-semibold mb-5 text-center ${state === 'not-started'
                            ? 'text-gray-700'
                            : state === 'in-progress'
                                ? 'text-amber-500'
                                : 'text-green-500'
                            }`}
                    >
                        {state === 'not-started'
                            ? 'Not Started'
                            : state === 'in-progress'
                                ? 'In Progress'
                                : 'Done'}
                    </h2>
                    <div className="space-y-4">
                        {weeklyGoals.filter((goal) => goal.state === state).length > 0 ? (

                            weeklyGoals
                                .filter((goal) => goal.state === state)
                                .map((goal) => (
                                    <div
                                        key={goal.id}
                                        className={`p-4 border-2 rounded-lg shadow-sm ${state === 'not-started'
                                            ? 'border-gray-200 bg-gray-100'
                                            : state === 'in-progress'
                                                ? 'border-yellow-200 bg-yellow-50'
                                                : 'border-green-200 bg-green-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className='flex items-center gap-2'>
                                                <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold
                                                            ${goal.priority === "high" ? "bg-red-100 text-red-600" : ""}
                                                            ${goal.priority === "medium" ? "bg-yellow-100 text-yellow-600" : ""}
                                                            ${goal.priority === "low" ? "bg-green-100 text-green-600" : ""}
                                                        `}
                                                >
                                                    {goal.priority.toUpperCase()}
                                                </span>

                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-500 hover:underline hover:cursor-pointer"
                                                    onClick={() => setEditingGoal(goal)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-500 hover:underline hover:cursor-pointer"
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <ul className="list-disc pl-1">
                                            {goal.tasks.map((t) => (
                                                <li key={t.id} className="flex items-center gap-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        {/* Hidden native checkbox */}
                                                        <input
                                                            type="checkbox"
                                                            checked={t.completed}
                                                            onChange={(e) => handleToggleTask(Number(t.id), e.target.checked)}
                                                            className="hidden"
                                                        />

                                                        {/* Custom checkbox */}
                                                        <span className={`w-5 h-5 flex-shrink-0 border-2 rounded-full flex items-center justify-center transition-colors
                                                                ${t.completed ? 'bg-green-500 border-green-500' : 'bg-gray-100 border-gray-400'}`}>
                                                            {t.completed && (
                                                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </span>


                                                    </label>

                                                    <span className={t.completed ? 'line-through text-gray-400' : ''}>
                                                        {t.title}
                                                    </span>
                                                </li>
                                            ))}

                                        </ul>
                                        <div className='flex'>
                                            {goal.deadline && (
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-2 text-right">
                                                Created at: {new Date(goal.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                ))
                        ) : (
                            <p className="text-gray-500 text-center">No goals in this category.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WeeklyGoalsCards
