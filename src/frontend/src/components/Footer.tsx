import { Github, Globe, Instagram, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData } from "../types/portfolio";

interface FooterProps {
  data: PortfolioData;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_ICONS = [
  { key: "github" as const, Icon: Github },
  { key: "linkedin" as const, Icon: Linkedin },
  { key: "twitter" as const, Icon: Twitter },
  { key: "instagram" as const, Icon: Instagram },
  { key: "website" as const, Icon: Globe },
];

export function Footer({ data }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const initials =
    data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "YN";

  return (
    <footer
      className="pt-16 pb-8 px-6 md:px-16 lg:px-24"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
      }}
      data-ocid="footer.section"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-12">
          {/* Left: Name + tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{ background: "var(--accent)" }}
              >
                {initials}
              </div>
              <span
                className="font-bold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {data.name}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {data.titles[0]} · {data.titles[1]}
            </p>
          </div>

          {/* Center: Nav links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: "var(--text-secondary)" }}
                    data-ocid={`footer.${link.label.toLowerCase()}.link`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Social icons */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Social
            </h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_ICONS.map(({ key, Icon }) => {
                const url = data.socialLinks[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 hover:opacity-75"
                    style={{ background: "var(--bg-surface-2)" }}
                    data-ocid={`footer.social.${key}.link`}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <p>
            &copy; {year} {data.name}. All rights reserved.
          </p>
          <p>
            Built with <span style={{ color: "#ef4444" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-75"
              style={{ color: "var(--accent)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
