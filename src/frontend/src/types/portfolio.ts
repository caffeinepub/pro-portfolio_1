export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  image: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
}

export interface PortfolioData {
  name: string;
  titles: [string, string, string];
  bio: string;
  email: string;
  phone: string;
  profilePhoto: string;
  resumeUrl: string;
  accentColor: string;
  socialLinks: SocialLinks;
  skills: string[];
  projects: Project[];
  services: Service[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}
