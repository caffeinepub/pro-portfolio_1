import { Toaster } from "@/components/ui/sonner";
import { About } from "./components/About";
import { AdminBar } from "./components/AdminBar";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { usePortfolio } from "./hooks/usePortfolio";

export default function App() {
  const { data, update, isAdmin, login, logout } = usePortfolio();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <Nav data={data} isAdmin={isAdmin} onLogin={login} onLogout={logout} />

      <main>
        <Hero data={data} isAdmin={isAdmin} onUpdate={update} />
        <About data={data} isAdmin={isAdmin} onUpdate={update} />
        <Projects data={data} isAdmin={isAdmin} onUpdate={update} />
        <Services data={data} isAdmin={isAdmin} onUpdate={update} />
        <Contact data={data} isAdmin={isAdmin} onUpdate={update} />
      </main>

      <Footer data={data} />

      {isAdmin && <AdminBar data={data} onUpdate={update} onLogout={logout} />}

      <Toaster />
    </div>
  );
}
