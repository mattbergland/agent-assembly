import { Link } from "react-router-dom";
import OrbConstellation from "@/components/OrbConstellation";
import { Nav, Footer } from "@/components/Layout";
import "../App.css";

export default function Home() {
  return (
    <div className="h-screen bg-paper text-ink font-sans antialiased overflow-hidden relative">
      <OrbConstellation className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <Nav />
        <Main />
        <Footer />
      </div>
    </div>
  );
}

function NavLink({ to, href, label, num }: { to?: string; href?: string; label: string; num: string }) {
  const cls = "group flex items-center gap-3 py-1.5 text-sm text-ink-muted hover:text-ink transition-all";
  const inner = (
    <>
      <span className="text-[11px] font-mono text-lavender opacity-60 group-hover:opacity-100 transition-opacity">
        {num}
      </span>
      <span className="h-px w-4 bg-ink-muted/25 group-hover:w-6 group-hover:bg-lavender transition-all" />
      <span className="group-hover:translate-x-0.5 transition-transform">
        {label}
      </span>
    </>
  );

  if (to) {
    return <Link to={to} className={cls}>{inner}</Link>;
  }
  const isExternal = href?.startsWith("http");
  return <a href={href} className={cls} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
}

function Main() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 md:px-16">
      <div className="w-full max-w-4xl flex justify-end">
        <div className="flex flex-col items-center md:items-start max-w-sm pointer-events-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight text-center md:text-left">
            AI for people who bring people together.
          </h1>
          <p className="text-sm md:text-base text-ink-muted mt-3 leading-relaxed text-center md:text-left">
            The toolkit and playbooks for event marketers — with AI doing the
            chores.
          </p>

          <nav className="flex flex-col gap-2 mt-6 w-full">
            <NavLink to="/toolkit" label="Toolkit" num="01" />
            <NavLink href="https://www.linkedin.com/in/mattbergland/recent-activity/articles/" label="Field Notes" num="02" />
            <NavLink href="https://partiful.com/u/ax6ah3XUs6POZMwuobP6" label="Join" num="03" />
          </nav>
        </div>
      </div>
    </main>
  );
}
