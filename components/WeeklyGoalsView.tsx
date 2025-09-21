import React from 'react';

interface WeeklyGoal {
    id: number;
    title: string;
    state: 'not-started' | 'in-progress' | 'done';
    tasks: WeeklyGoalTask[];
}

interface WeeklyGoalTask {
    id: number;
    goalId: number;
    title: string;
    completed: boolean;
}

const WeeklyGoalsView: React.FC = () => {

    //add some mock data for now
    const [mockGoals, setMockGoals] = React.useState<WeeklyGoal[]>([
        {
            id: 1,
            title: 'Goal 1',
            state: 'not-started',
            tasks: [
                { id: 1, goalId: 1, title: 'Task 1', completed: false },
                { id: 2, goalId: 1, title: 'Task 2', completed: false },
            ],
        },
        {
            id: 2,
            title: 'Goal 2',
            state: 'in-progress',
            tasks: [
                { id: 3, goalId: 2, title: 'Task 3', completed: true },
                { id: 4, goalId: 2, title: 'Task 4', completed: false },
            ],
        },
        {
            id: 3,
            title: 'Goal 3',
            state: 'in-progress',
            tasks: [
                { id: 5, goalId: 3, title: 'Task 5', completed: true },
                { id: 6, goalId: 3, title: 'Task 6', completed: false },
            ],
        },
        {
            id: 4,
            title: 'Goal 4',
            state: 'done',
            tasks: [
                { id: 7, goalId: 4, title: 'Task 7', completed: true },
                { id: 8, goalId: 4, title: 'Task 8', completed: true },
            ],
        },
    ]);

    return (
        <div className="space-y-4 sm:space-y-6 text-black">
            {/* Header Section */}
            <div className="flex items-center gap-x-2 text-center self-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                    Weekly Goals 🎯
                </h1>
            </div>

            {/* Goals List */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* In Progress Goals */}
                <div className=' p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold text-gray-700 mb-5 text-center">Not Started</h2>
                    <div className="space-y-2">
                        {mockGoals.filter(goal => goal.state === 'not-started').map(goal => (

                            <div key={goal.id} className="p-4 border rounded-lg shadow-sm bg-white">
                                <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                <ul className="list-disc list-inside space-y-3 mb-5">
                                    {goal.tasks.map(task => (
                                        <li key={task.id} className={`flex text-xl items-center ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => { }}
                                                className="mr-2"
                                            />
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                                {/* Progress Bar */}
                                <div className="flex h-2 mb-4 rounded bg-gray-200">
                                    <div
                                        className={`flex h-2 rounded`}
                                        style={{ width: `${(goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    0% Complete
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* In Progress Goals */}
                <div className=' p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold mb-5 text-center text-amber-500">In Progress</h2>
                    <div className="space-y-4">
                        {mockGoals.filter(goal => goal.state === 'in-progress').map(goal => (
                            <div key={goal.id} className="p-4 border-2 border-yellow-200 rounded-lg shadow-sm bg-yellow-50">
                                <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                <ul className="list-disc list-inside space-y-3 mb-5">
                                    {goal.tasks.map(task => (
                                        <li key={task.id} className={`flex text-xl items-center ${task.completed ? 'line-through text-green-400' : 'text-gray-600'}`}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => { }}
                                                className="mr-2"
                                            />
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                                {/* Progress Bar */}
                                <div className="flex h-2 mb-2 rounded bg-gray-200">
                                    <div
                                        className={`flex h-2 rounded bg-yellow-500`}
                                        style={{ width: `${(goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {((goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100).toFixed(0)}% Complete
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completed Goals */}
                <div className=' p-6 rounded-lg shadow-xl bg-white'>
                    <h2 className="text-lg font-semibold text-green-500 mb-5 text-center">Done</h2>
                    <div className="space-y-4">
                        {mockGoals.filter(goal => goal.state === 'done').map(goal => (
                            <div key={goal.id} className="p-4 border-2 border-green-200 rounded-lg shadow-sm bg-green-50">
                                <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                                <ul className="list-disc list-inside space-y-3 mb-5">
                                    {goal.tasks.map(task => (
                                        <li key={task.id} className={`flex text-xl items-center ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => { }}
                                                className="mr-2"
                                            />
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                                {/* Progress Bar */}
                                <div className="flex h-2 mb-2 rounded bg-gray-200">
                                    <div
                                        className={`flex h-2 rounded bg-green-500`}
                                        style={{ width: `${(goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {((goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100).toFixed(0)}% Complete
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeeklyGoalsView;