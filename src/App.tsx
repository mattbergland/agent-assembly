import OrbConstellation from "@/components/OrbConstellation";
import "./App.css";

export default function App() {
  return (
    <div className="h-screen bg-paper text-ink font-sans antialiased flex flex-col overflow-hidden">
      <Nav />
      <Main />
      <Footer />
    </div>
  );
}

/* ── Nav ──────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 flex-none">
      <a href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-sm tracking-tight font-medium">
          Agent Assembly
        </span>
      </a>
      <a
        href="mailto:hello@agentassembly.com"
        className="text-sm text-ink-muted hover:text-ink transition-colors"
      >
        Contact
      </a>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 22 22"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="5" cy="5" r="1.4" fill="currentColor" />
      <circle cx="11" cy="5" r="1.4" fill="currentColor" />
      <circle cx="17" cy="5" r="1.4" fill="currentColor" />
      <circle cx="5" cy="11" r="1.4" fill="currentColor" />
      <circle cx="11" cy="11" r="1.8" fill="#8E7DBE" />
      <circle cx="17" cy="11" r="1.4" fill="currentColor" />
      <circle cx="5" cy="17" r="1.4" fill="currentColor" />
      <circle cx="11" cy="17" r="1.4" fill="currentColor" />
      <circle cx="17" cy="17" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* ── Main ─────────────────────────────────────────────────── */

function Main() {
  return (
    <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-6 md:gap-16">
      {/* Left: Fasces constellation */}
      <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] shrink-0 relative">
        <OrbConstellation className="w-full h-full" />
      </div>

      {/* Right: Copy block */}
      <div className="flex flex-col items-center md:items-start max-w-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight text-center md:text-left">
          AI for people who bring people together.
        </h1>
        <p className="text-sm md:text-base text-ink-muted mt-3 leading-relaxed text-center md:text-left">
          The toolkit and playbooks for event marketers — with AI doing the
          chores.
        </p>

        <nav className="flex items-center gap-3 mt-6 text-sm">
          <a
            href="#toolkit"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            Toolkit
          </a>
          <span className="text-ink-muted/40">/</span>
          <a
            href="#field"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            Field Notes
          </a>
          <span className="text-ink-muted/40">/</span>
          <a
            href="#join"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            Join
          </a>
        </nav>
      </div>
    </main>
  );
}

/* ── Footer ───────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 md:px-10 py-5 flex-none text-xs text-ink-muted">
      <span>© 2026 Agent Assembly</span>
      <div className="flex items-center gap-4">
        <a
          href="https://x.com"
          aria-label="X"
          className="hover:text-ink transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          aria-label="LinkedIn"
          className="hover:text-ink transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href="https://substack.com"
          aria-label="Substack"
          className="hover:text-ink transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16M4 8h16M4 12l8 6 8-6" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
