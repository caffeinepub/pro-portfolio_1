export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  dueDate?: string; // ISO date string "YYYY-MM-DD", optional
}
