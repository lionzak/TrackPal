export interface WeeklyGoalTask {
    id: number;
    goal_id: number;
    title: string;
    completed: boolean;
}

export interface WeeklyGoal {
    id: number;
    title: string;
    state: 'not-started' | 'in-progress' | 'done';
    tasks: WeeklyGoalTask[];
}
