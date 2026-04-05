import { useCallback, useEffect, useState } from "react";
import type { PortfolioData } from "../types/portfolio";

const STORAGE_KEY = "portfolio_data";
const ADMIN_SESSION_KEY = "portfolio_admin";

const DEFAULT_DATA: PortfolioData = {
  name: "Your Name",
  titles: ["Full-Stack Developer", "UI/UX Designer", "Creative Technologist"],
  bio: "I build beautiful, functional digital experiences. Passionate about clean code, thoughtful design, and solving real problems with technology.",
  email: "hello@yourname.com",
  phone: "",
  profilePhoto: "",
  resumeUrl: "#",
  accentColor: "#14B8B1",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "",
    website: "",
  },
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "UI/UX Design",
    "AI Integration",
    "Tailwind CSS",
  ],
  projects: [
    {
      id: "1",
      title: "Project One",
      description: "A brief description of this project and what it achieves.",
      techStack: ["React", "TypeScript"],
      projectUrl: "#",
      image: "",
    },
    {
      id: "2",
      title: "Project Two",
      description: "Another amazing project showcasing your skills.",
      techStack: ["Node.js", "API Design"],
      projectUrl: "#",
      image: "",
    },
  ],
  services: [
    {
      id: "1",
      icon: "💻",
      title: "Web Development",
      description:
        "Modern, responsive websites and web applications built with cutting-edge technologies.",
    },
    {
      id: "2",
      icon: "🎨",
      title: "UI/UX Design",
      description:
        "Beautiful, user-centered designs that convert visitors into customers.",
    },
    {
      id: "3",
      icon: "🤖",
      title: "AI Integration",
      description:
        "Integrate AI capabilities into your products to automate and enhance user experiences.",
    },
  ],
};

function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_DATA, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_DATA;
}

function saveData(data: PortfolioData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(loadData);
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );

  // Sync accent color CSS var
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", data.accentColor);
  }, [data.accentColor]);

  const update = useCallback((patch: Partial<PortfolioData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveData(next);
      return next;
    });
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === "admin123") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return { data, update, isAdmin, login, logout };
}
