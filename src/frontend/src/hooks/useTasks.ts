import { useCallback, useState } from "react";
import type { Priority, Task } from "../types/task";

const STORAGE_KEY = "task-dashboard-tasks";

// Helper to get YYYY-MM-DD offset by N days from today
function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const SAMPLE_TASKS: Task[] = [
  {
    id: "sample-1",
    title: "Design system audit",
    description:
      "Review all UI components for consistency and accessibility compliance across the dashboard.",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    dueDate: offsetDate(-1), // yesterday — overdue
  },
  {
    id: "sample-2",
    title: "Update API documentation",
    description:
      "Add missing endpoint descriptions and request/response examples to the developer docs.",
    priority: "medium",
    completed: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    dueDate: offsetDate(2), // due in 2 days — upcoming
  },
  {
    id: "sample-3",
    title: "Set up weekly team sync",
    description:
      "Schedule a recurring 30-minute meeting for Friday afternoons to align on sprint progress.",
    priority: "low",
    completed: false,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    // no dueDate
  },
];

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SAMPLE_TASKS;
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_TASKS;
  } catch {
    return SAMPLE_TASKS;
  }
}

function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // silently fail if storage is unavailable
  }
}

export function useTasks() {
  const [tasks, setTasksState] = useState<Task[]>(loadTasks);

  const setTasks = useCallback(
    (updater: Task[] | ((prev: Task[]) => Task[])) => {
      setTasksState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveTasks(next);
        return next;
      });
    },
    [],
  );

  const addTask = useCallback(
    (input: {
      title: string;
      description: string;
      priority: Priority;
      dueDate?: string;
    }) => {
      const newTask: Task = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: input.title.trim(),
        description: input.description.trim(),
        priority: input.priority,
        completed: false,
        createdAt: Date.now(),
        dueDate: input.dueDate || undefined,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (
      id: string,
      input: {
        title: string;
        description: string;
        priority: Priority;
        dueDate?: string;
      },
    ) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: input.title.trim(),
                description: input.description.trim(),
                priority: input.priority,
                dueDate: input.dueDate || undefined,
              }
            : t,
        ),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    },
    [setTasks],
  );

  return { tasks, addTask, updateTask, deleteTask, toggleComplete };
}
