import { Lock, Menu, Pencil, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PortfolioData } from "../types/portfolio";

interface NavProps {
  data: PortfolioData;
  isAdmin: boolean;
  onLogin: (pw: string) => boolean;
  onLogout: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ data, isAdmin, onLogin, onLogout }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const pwRef = useRef<HTMLInputElement>(null);

  const initials =
    data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "YN";

  useEffect(() => {
    if (showPasswordInput) {
      setTimeout(() => pwRef.current?.focus(), 50);
    }
  }, [showPasswordInput]);

  const handleAdminClick = useCallback(() => {
    if (isAdmin) {
      onLogout();
    } else {
      setShowPasswordInput((v) => !v);
      setPwError(false);
      setPassword("");
    }
  }, [isAdmin, onLogout]);

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const ok = onLogin(password);
      if (ok) {
        setShowPasswordInput(false);
        setPassword("");
        setPwError(false);
      } else {
        setPwError(true);
      }
    },
    [onLogin, password],
  );

  return (
    <>
      {/* Desktop nav */}
      <header
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
        data-ocid="nav.section"
      >
        <nav
          className="flex items-center gap-3 px-4 py-2.5 rounded-full border"
          style={{
            background: "rgba(14,20,26,0.75)",
            borderColor: "var(--border)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            maxWidth: "860px",
            width: "100%",
          }}
        >
          {/* Monogram + Name */}
          <a
            href="#home"
            className="flex items-center gap-2 mr-2 flex-shrink-0"
            data-ocid="nav.home.link"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "var(--accent)" }}
            >
              {initials}
            </div>
            <span
              className="hidden sm:block font-semibold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {data.name}
            </span>
          </a>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 hover:text-white"
                style={{ color: "var(--text-secondary)" }}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--text-secondary)";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Resume + Admin */}
          <div className="flex items-center gap-2 ml-auto">
            {data.resumeUrl && data.resumeUrl !== "#" ? (
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
                style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                data-ocid="nav.resume.button"
              >
                Resume
              </a>
            ) : (
              <span
                className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                Resume
              </span>
            )}

            {/* Admin toggle */}
            <button
              type="button"
              onClick={handleAdminClick}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{
                background: isAdmin
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.06)",
                color: isAdmin ? "#000" : "var(--text-muted)",
              }}
              title={isAdmin ? "Exit admin mode" : "Enter admin mode"}
              data-ocid="nav.admin.toggle"
            >
              {isAdmin ? (
                <Pencil className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--text-secondary)",
              }}
              onClick={() => setMenuOpen(true)}
              data-ocid="nav.menu.button"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Password input dropdown */}
        {showPasswordInput && !isAdmin && (
          <form
            onSubmit={handlePasswordSubmit}
            className="absolute top-16 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 flex gap-2 p-3 rounded-xl border"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
            data-ocid="nav.admin.dialog"
          >
            <input
              ref={pwRef}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm border outline-none"
              style={{
                background: "var(--bg-surface-2)",
                borderColor: pwError ? "#ef4444" : "var(--border)",
                color: "var(--text-primary)",
                width: "160px",
              }}
              data-ocid="nav.admin.input"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-black"
              style={{ background: "var(--accent)" }}
              data-ocid="nav.admin.submit_button"
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordInput(false)}
              className="px-2 py-1.5 rounded-lg text-sm"
              style={{ color: "var(--text-muted)" }}
              data-ocid="nav.admin.cancel_button"
            >
              ✕
            </button>
          </form>
        )}
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "rgba(11,15,18,0.97)" }}
          data-ocid="nav.mobile.modal"
        >
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "var(--bg-surface-2)",
              color: "var(--text-secondary)",
            }}
            data-ocid="nav.mobile.close_button"
          >
            <X className="w-5 h-5" />
          </button>
          <nav className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-3xl font-semibold transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setMenuOpen(false)}
                data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
