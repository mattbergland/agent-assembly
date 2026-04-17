import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import ParticleField from "@/components/ParticleField";

export default function Waitlist() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased overflow-x-hidden flex flex-col">
      <WaitlistNav />
      <WaitlistHero />
      <WaitlistFooter />
    </div>
  );
}

function WaitlistNav() {
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-[15px] tracking-tight font-semibold">
            Agent Assembly
          </span>
        </a>
        <a
          href="/"
          className="text-sm text-ink-soft hover:text-ink transition-colors inline-flex items-center gap-2"
        >
          View the site
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="5" cy="5" r="1.4" fill="#111" />
      <circle cx="11" cy="5" r="1.4" fill="#111" />
      <circle cx="17" cy="5" r="1.4" fill="#111" />
      <circle cx="5" cy="11" r="1.4" fill="#111" />
      <circle cx="11" cy="11" r="1.8" fill="#8E7DBE" />
      <circle cx="17" cy="11" r="1.4" fill="#111" />
      <circle cx="5" cy="17" r="1.4" fill="#111" />
      <circle cx="11" cy="17" r="1.4" fill="#111" />
      <circle cx="17" cy="17" r="1.4" fill="#111" />
    </svg>
  );
}

function WaitlistHero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That email doesn't look right.");
      return;
    }
    // TODO: wire this form submission to an email provider
    //   (Formspree / Buttondown / ConvertKit / Resend + serverless fn).
    //   For now we just optimistically show the confirmation state.
    setError(null);
    setSubmitted(true);
  };

  return (
    <section className="relative flex-1 border-b border-ink/15">
      {/* Ambient particle backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField
          gradient="diffuse"
          count={420}
          color="#111111"
          maxSize={1.3}
          minOpacity={0.1}
          maxOpacity={0.35}
          interactive={false}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField
          gradient="radial-center"
          count={180}
          color="#8E7DBE"
          maxSize={1.5}
          minOpacity={0.2}
          maxOpacity={0.55}
          repelRadius={110}
          repelStrength={1.3}
          className="w-full h-full"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 md:px-10 py-20 md:py-32">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-ink-muted mb-10">
          <span className="h-px w-10 bg-ink-muted/70" />
          <span>Waitlist · Drop 001</span>
        </div>

        <h1 className="font-semibold tracking-tightest leading-[0.95] text-[44px] sm:text-6xl md:text-7xl lg:text-[88px]">
          Be first to the{" "}
          <span className="relative inline-block">
            <span className="relative z-10">toolkit</span>
            <span className="absolute left-0 right-0 bottom-1.5 md:bottom-2 h-3 md:h-4 bg-lavender/60 -z-0" />
          </span>
          .
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-ink-soft leading-snug">
          Agent Assembly's first Starter Kit ships this spring — five
          battle-tested workflows, the prompt pack, and the Event ROI
          Calculator.{" "}
          <span className="text-ink">
            Waitlist gets it before anyone else, free.
          </span>
        </p>

        {!submitted ? (
          <form
            onSubmit={onSubmit}
            className="mt-12 max-w-xl"
            aria-label="Join the waitlist"
          >
            <label
              htmlFor="waitlist-email"
              className="block text-xs uppercase tracking-[0.22em] text-ink-muted mb-3"
            >
              Reserve your spot
            </label>
            <div className="flex flex-col sm:flex-row border border-ink bg-paper">
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-4 py-4 bg-transparent text-[15px] outline-none"
              />
              <button
                type="submit"
                className="px-6 py-4 bg-ink text-paper text-[13px] uppercase tracking-[0.22em] hover:bg-lavender transition-colors inline-flex items-center justify-center gap-2"
              >
                Join the list
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error ? (
              <p className="mt-3 text-xs text-red-600">{error}</p>
            ) : (
              <p className="mt-3 text-xs text-ink-muted">
                One email when the kit drops. No drip campaigns.
              </p>
            )}
          </form>
        ) : (
          <div className="mt-12 max-w-xl border border-ink bg-paper p-6 md:p-8 flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-lavender/25 flex items-center justify-center">
              <Check className="w-5 h-5 text-ink" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                You're on the list
              </div>
              <p className="mt-2 text-[15px] leading-relaxed">
                We'll send the Starter Kit to{" "}
                <span className="font-medium">{email}</span> the moment
                Drop 001 goes live. Meantime, keep running good rooms.
              </p>
            </div>
          </div>
        )}

        <div className="mt-20 md:mt-28 border-t border-ink/20 pt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
              What lands in your inbox
            </div>
            <ul className="space-y-4 text-[15px] text-ink-soft">
              <li className="flex gap-3">
                <span className="text-lavender mt-1.5">◆</span>
                <span>
                  <span className="text-ink font-medium">
                    Five plug-and-play workflows
                  </span>{" "}
                  — exec dinner, developer summit, booth, field day,
                  post-event debrief.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lavender mt-1.5">◆</span>
                <span>
                  <span className="text-ink font-medium">The prompt pack</span>{" "}
                  — invites, guest targeting, content repurposing, follow-up.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lavender mt-1.5">◆</span>
                <span>
                  <span className="text-ink font-medium">
                    Event ROI Calculator
                  </span>{" "}
                  — the read-out your CFO will actually accept.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lavender mt-1.5">◆</span>
                <span>
                  <span className="text-ink font-medium">
                    An invite to the first Build Night
                  </span>{" "}
                  — plan a $25K event live, together.
                </span>
              </li>
            </ul>
          </div>
          <div className="md:border-l md:border-ink/15 md:pl-16">
            <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
              Who it's for
            </div>
            <p className="text-[15px] text-ink-soft leading-relaxed">
              Event marketers, field marketers, community builders, developer
              advocates, conference producers, founders who host, chiefs of
              staff, program managers — anyone whose job is measured in rooms,
              pipeline, and the follow-up on Monday morning.
            </p>
            <p className="mt-6 text-[15px] text-ink-soft leading-relaxed">
              If that's you, you're early. That's the point.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistFooter() {
  return (
    <footer className="relative bg-paper">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-ink-muted">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span>Agent Assembly · Est. 2026</span>
        </div>
        <div>Built for event marketers using AI.</div>
      </div>
    </footer>
  );
}
