// @/types.ts
export interface WeeklyGoalTask {
  id: number; // allow temporary string IDs
  goal_id: number;
  title: string;
  completed: boolean;
}

export interface WeeklyGoal {
  id: number;
  title: string;
  state: "not-started" | "in-progress" | "done";
  tasks: WeeklyGoalTask[];
  created_at: string;
  priority: "low" | "medium" | "high"; // new
}
