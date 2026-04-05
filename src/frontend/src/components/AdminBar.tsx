import { LogOut } from "lucide-react";
import type { PortfolioData } from "../types/portfolio";

interface AdminBarProps {
  data: PortfolioData;
  onUpdate: (patch: Partial<PortfolioData>) => void;
  onLogout: () => void;
}

export function AdminBar({ data, onUpdate, onLogout }: AdminBarProps) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-5 py-3 rounded-full border shadow-2xl"
      style={{
        background: "rgba(14,20,26,0.95)",
        borderColor: "var(--accent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 30px rgba(20,184,177,0.2)",
      }}
      data-ocid="admin.panel"
    >
      {/* Status badge */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "rgba(20,184,177,0.15)", color: "var(--accent)" }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        Edit Mode: ON
      </div>

      {/* Accent color picker */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Accent:
        </span>
        <label className="relative cursor-pointer">
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
            style={{ padding: 0 }}
            title="Pick accent color"
            data-ocid="admin.accent.input"
          />
        </label>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {data.accentColor}
        </span>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70"
        style={{
          background: "var(--bg-surface-2)",
          color: "var(--text-secondary)",
        }}
        data-ocid="admin.logout.button"
      >
        <LogOut className="w-3.5 h-3.5" />
        Logout
      </button>
    </div>
  );
}
