import { CheckCircle2, Clock, ListTodo } from "lucide-react";

interface SidebarProps {
  total: number;
  completed: number;
  pending: number;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({
  total,
  completed,
  pending,
  activeView,
  onViewChange,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-sidebar border-r border-border">
      {/* Navigation */}
      <nav className="p-4 space-y-1" aria-label="Main navigation">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Navigation
        </p>
        <button
          type="button"
          onClick={() => onViewChange("all")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === "all"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          data-ocid="nav.tasks.link"
        >
          <ListTodo className="h-4 w-4" />
          My Tasks
        </button>
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Stats section */}
      <div className="p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Overview
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ListTodo className="h-4 w-4" />
              Total
            </div>
            <span className="text-sm font-bold text-foreground">{total}</span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Done
            </div>
            <span className="text-sm font-bold text-foreground">
              {completed}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Pending
            </div>
            <span className="text-sm font-bold text-foreground">{pending}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
