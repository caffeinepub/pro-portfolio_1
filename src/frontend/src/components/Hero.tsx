import { useEffect, useRef, useState } from "react";
import type { PortfolioData } from "../types/portfolio";

interface HeroProps {
  data: PortfolioData;
  isAdmin: boolean;
  onUpdate: (patch: Partial<PortfolioData>) => void;
}

export function Hero({ data, isAdmin, onUpdate }: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Cycle through titles with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTitleIndex((i) => (i + 1) % 3);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function startEditName() {
    if (!isAdmin) return;
    setEditingName(true);
    setTimeout(() => nameRef.current?.focus(), 20);
  }

  function commitName() {
    setEditingName(false);
    const val = nameRef.current?.textContent?.trim() || "";
    if (val) onUpdate({ name: val });
  }

  function startEditTitle(idx: number) {
    if (!isAdmin) return;
    setEditingTitle(idx);
    setTimeout(() => titleRefs.current[idx]?.focus(), 20);
  }

  function commitTitle(idx: number) {
    setEditingTitle(null);
    const val = titleRefs.current[idx]?.textContent?.trim() || "";
    if (val) {
      const newTitles = [...data.titles] as [string, string, string];
      newTitles[idx] = val;
      onUpdate({ titles: newTitles });
    }
  }

  return (
    <section
      id="home"
      className="relative flex flex-col items-start justify-center min-h-screen px-6 md:px-16 lg:px-24"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(20,184,177,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(20,184,177,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        {/* Greeting + Name */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4">
          <span style={{ color: "var(--text-primary)" }}>Hi, I&apos;m </span>
          <span
            ref={nameRef}
            style={{
              color: "var(--accent)",
              outline: isAdmin ? "1px dashed var(--accent)" : "none",
              outlineOffset: "4px",
              borderRadius: "4px",
              cursor: isAdmin ? "text" : "default",
            }}
            contentEditable={editingName}
            suppressContentEditableWarning
            onClick={startEditName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitName();
              }
            }}
            onBlur={commitName}
            title={isAdmin ? "Click to edit name" : undefined}
            data-ocid="hero.name.input"
          >
            {data.name}
          </span>
        </h1>

        {/* Animated subtitle */}
        <div className="h-10 mb-6">
          <p
            className="text-lg md:text-2xl font-medium transition-opacity duration-400"
            style={{ color: "var(--text-secondary)", opacity: visible ? 1 : 0 }}
          >
            {data.titles[titleIndex]}
          </p>
        </div>

        {/* All 3 titles (editable in admin) */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2 mb-6">
            {data.titles.map((title, idx) => (
              <span
                key={title}
                ref={(el) => {
                  titleRefs.current[idx] = el;
                }}
                contentEditable={editingTitle === idx}
                suppressContentEditableWarning
                onClick={() => startEditTitle(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTitle(idx);
                  }
                }}
                onBlur={() => commitTitle(idx)}
                className="px-3 py-1 rounded-full text-sm border cursor-text"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--accent)",
                  color: "var(--text-secondary)",
                  outline:
                    editingTitle === idx ? "2px solid var(--accent)" : "none",
                }}
                title="Click to edit title"
                data-ocid={`hero.title.input.${idx + 1}`}
              >
                {title}
              </span>
            ))}
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)", alignSelf: "center" }}
            >
              ← click any pill to edit
            </span>
          </div>
        )}

        {/* Subtitle roles display (non-admin) */}
        {!isAdmin && (
          <p
            className="text-base md:text-lg mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            {data.titles.join(" | ")}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--accent), #0FA39C)",
              color: "#000",
            }}
            data-ocid="hero.view_work.button"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm border transition-all duration-200 hover:bg-white/5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            data-ocid="hero.contact.button"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
