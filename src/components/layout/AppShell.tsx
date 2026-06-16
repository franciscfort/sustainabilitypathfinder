import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Leaf, Menu, X, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/assessment", label: "Take Assessment" },
  { to: "/careers", label: "Explore Career Paths" },
  { to: "/skills", label: "Skills Library" },
  { to: "/certifications", label: "Certifications" },
  { to: "/resources", label: "Learning Resources" },
  { to: "/roadmaps", label: "Career Roadmaps" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">Sustainability Pathfinder</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="px-4 py-3 grid gap-1">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      isActive ? "text-primary bg-primary/10" : "text-foreground/80 hover:bg-muted"
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm">
          <div>
            <div className="flex items-center gap-2 font-bold mb-2">
              <Leaf className="w-5 h-5 text-primary" />
              Sustainability Pathfinder
            </div>
            <p className="text-muted-foreground">
              Helping people discover, learn and grow into the world's most impactful careers.
            </p>
          </div>
          <FooterCol title="Discover" links={[
            { to: "/assessment", label: "Take the Assessment" },
            { to: "/careers", label: "Career Paths" },
            { to: "/roadmaps", label: "Roadmaps" },
          ]} />
          <FooterCol title="Learn" links={[
            { to: "/skills", label: "Skills Library" },
            { to: "/certifications", label: "Certifications" },
            { to: "/resources", label: "Resources" },
          ]} />
          <FooterCol title="More" links={[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/about", label: "About" },
            { to: "/reach", label: "Global Reach" },
          ]} />
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sustainability Career Pathfinder
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="font-semibold mb-2">{title}</div>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
