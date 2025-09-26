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
  deadline: string | null; // new
}

export interface DailyRoutineTask {
  id: number; // allow temporary string IDs
  title: string;
  category: "growth" | "health" | "core" | "leisure";
  completed: boolean;
  created_at: string;
  start_time: string | null; // new
}