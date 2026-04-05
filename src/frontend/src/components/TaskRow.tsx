import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { memo } from "react";
import type { Task } from "../types/task";
import { PriorityBadge } from "./PriorityBadge";

interface TaskRowProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(dateStr: string): string {
  // Parse as local date to avoid timezone shift
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDueDateStatus(
  dueDate: string | undefined,
  completed: boolean,
): "overdue" | "warning" | "normal" | "none" {
  if (!dueDate) return "none";
  if (completed) return "normal";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "overdue";
  if (diffDays <= 2) return "warning";
  return "normal";
}

export const TaskRow = memo(function TaskRow({
  task,
  index,
  onToggle,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);

  const dueDateClass =
    dueDateStatus === "overdue"
      ? "text-destructive font-medium"
      : dueDateStatus === "warning"
        ? "text-amber-500 font-medium"
        : "text-muted-foreground";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 group transition-colors ${
        task.completed ? "bg-muted/30" : "hover:bg-accent/30"
      }`}
      data-ocid={`task.item.${index}`}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        className="flex-shrink-0"
        style={
          task.completed ? undefined : { borderColor: "oklch(var(--primary))" }
        }
        data-ocid={`task.checkbox.${index}`}
      />

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            task.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {task.description}
          </p>
        )}
      </div>

      {/* Priority badge */}
      <div className="flex-shrink-0 w-20 flex justify-center">
        <PriorityBadge priority={task.priority} completed={task.completed} />
      </div>

      {/* Due date */}
      <div
        className={`flex-shrink-0 w-28 text-xs hidden sm:block ${dueDateClass}`}
      >
        {task.dueDate ? (
          formatDueDate(task.dueDate)
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          data-ocid={`task.edit_button.${index}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          data-ocid={`task.delete_button.${index}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
});
