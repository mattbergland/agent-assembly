import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export function Nav() {
  const location = useLocation();
  const isToolkit = location.pathname.startsWith("/toolkit");

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 flex-none pointer-events-auto">
      <Link to="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-sm tracking-tight font-medium">
          Agent Assembly
        </span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/toolkit"
          className={`text-sm transition-colors ${
            isToolkit
              ? "text-ink font-medium"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Toolkit
        </Link>
        <a
          href="mailto:hello@agentassembly.com"
          className="text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export function LogoMark() {
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

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 md:px-10 py-5 flex-none text-xs text-ink-muted pointer-events-auto">
      <span>&copy; 2026 Agent Assembly</span>
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

interface ToolHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  headerRight?: ReactNode;
}

export function ToolHeader({
  title,
  backTo = "/toolkit",
  backLabel = "Back to Toolkit",
  headerRight,
}: ToolHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 flex-none">
      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
        >
          <LogoMark />
          <span className="text-sm tracking-tight font-medium">{title}</span>
        </Link>
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-lavender transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
      </div>
      {headerRight && (
        <div className="flex items-center gap-6">{headerRight}</div>
      )}
    </header>
  );
}

interface ToolLayoutProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  fullScreen?: boolean;
}

export function ToolLayout({
  title,
  backTo,
  backLabel,
  headerRight,
  children,
  fullScreen = false,
}: ToolLayoutProps) {
  return (
    <div
      className={`${
        fullScreen ? "h-screen overflow-hidden" : "min-h-screen"
      } bg-paper text-ink font-sans antialiased flex flex-col`}
    >
      <ToolHeader
        title={title}
        backTo={backTo}
        backLabel={backLabel}
        headerRight={headerRight}
      />
      {children}
    </div>
  );
}
