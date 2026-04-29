"use client";

import { useCheckins, getEventConfig } from "@/lib/store";

function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <circle cx="20" cy="4" r="2" fill="currentColor" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="#8E7DBE" />
      <circle cx="20" cy="12" r="2" fill="currentColor" />
      <circle cx="4" cy="20" r="2" fill="currentColor" />
      <circle cx="12" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  const checkins = useCheckins();
  const config = getEventConfig();
  const eventName = config.eventName;
  const count = checkins.length;

  const navItems = [
    { num: "01", label: "Check-In Kiosk", href: "/checkin", desc: "iPad-ready check-in flow" },
    { num: "02", label: "Live Slides", href: "/slides", desc: "Display at the event" },
    { num: "03", label: "Admin", href: "/admin", desc: "Settings & badge printing" },
  ];

  return (
    <div className="min-h-dvh bg-paper text-ink flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm font-medium tracking-tight">event check-in</span>
        </div>
        {count > 0 && (
          <span className="text-xs text-ink-muted font-light">
            {count} attendee{count !== 1 ? "s" : ""} checked in
          </span>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="max-w-4xl w-full">
          <div className="space-y-3 mb-16">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight text-ink">
              {eventName}
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-light">
              Check in, connect, and make every introduction count.
            </p>
          </div>

          {/* Numbered navigation links */}
          <nav className="space-y-0">
            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className="group flex items-center gap-4 py-5 border-t border-rule/10 last:border-b transition-all"
              >
                <span className="text-sm font-mono text-lavender group-hover:text-lavender-soft transition-colors w-8">
                  {item.num}
                </span>
                <span className="h-px bg-rule/15 group-hover:bg-lavender group-hover:w-12 w-6 transition-all duration-300" />
                <div className="group-hover:translate-x-1 transition-transform duration-200">
                  <span className="text-lg font-medium tracking-tight text-ink-soft group-hover:text-ink transition-colors">
                    {item.label}
                  </span>
                  <p className="text-sm text-ink-muted font-light">{item.desc}</p>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-6 text-xs text-ink-muted font-light">
        <span>&copy; {new Date().getFullYear()}</span>
        <span>event check-in</span>
      </footer>
    </div>
  );
}
