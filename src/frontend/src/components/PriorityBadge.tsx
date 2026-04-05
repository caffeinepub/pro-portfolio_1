import type { Priority } from "../types/task";

const PRIORITY_STYLES: Record<
  Priority,
  { bg: string; color: string; label: string }
> = {
  high: { bg: "#FCE7E7", color: "#B91C1C", label: "High" },
  medium: { bg: "#FDEBD3", color: "#B45309", label: "Medium" },
  low: { bg: "#DBEAFE", color: "#1D4ED8", label: "Low" },
};

const DONE_STYLE = { bg: "#E5E7EB", color: "#6B7280", label: "Done" };

interface PriorityBadgeProps {
  priority: Priority;
  completed?: boolean;
}

export function PriorityBadge({ priority, completed }: PriorityBadgeProps) {
  const style = completed ? DONE_STYLE : PRIORITY_STYLES[priority];

  return (
    <span
      style={{ backgroundColor: style.bg, color: style.color }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap"
    >
      {completed ? "Done" : style.label}
    </span>
  );
}
