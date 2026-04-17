import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import ParticleField from "@/components/ParticleField";
import Waitlist from "./Waitlist";
import "./App.css";

const audiences = [
  "Event marketers",
  "Field marketers",
  "Community builders",
  "Developer advocates",
  "Conference producers",
  "Founders who host",
  "Chiefs of staff",
  "Program managers",
];

const toolkit = [
  {
    label: "01",
    title: "Workflows",
    description:
      "Battle-tested playbooks for planning dinners, summits, and field days — outreach, confirms, comms, run-of-show.",
    meta: "17 workflows",
  },
  {
    label: "02",
    title: "Templates",
    description:
      "Prompt packs and Notion templates for invites, guest targeting, venue briefs, and post-event debriefs.",
    meta: "42 templates",
  },
  {
    label: "03",
    title: "Tools",
    description:
      "Small, sharp micro-tools that do one thing well — Event ROI Calculator, Exec Dinner Builder, Pipeline Tracker.",
    meta: "9 tools",
  },
  {
    label: "04",
    title: "Build Nights",
    description:
      "Members-only live sessions where we all build the same thing together — an exec dinner, a booth, an outreach campaign.",
    meta: "Weekly, online",
  },
];

const stories = [
  {
    dateline: "Brooklyn · Dispatch 004",
    title: "A 60-guest dinner, one operator, zero spreadsheets",
    excerpt:
      "How one founding team used the toolkit to plan, confirm, and debrief a closed-door fintech dinner in under four hours of human time — and sourced $2.4M in pipeline.",
    read: "6 min read",
  },
  {
    dateline: "San Francisco · Dispatch 003",
    title: "The pre-event week, compressed",
    excerpt:
      "We tore apart the 14-day runway before a developer summit and mapped exactly where agents earn their keep — and where the event marketer still has to lead.",
    read: "9 min read",
  },
  {
    dateline: "Remote · Dispatch 002",
    title: "Proving ROI on events your CFO can actually feel",
    excerpt:
      "A working note on attribution, the limits of the CRM, and the simple pipeline-multiple read-out that's saved more than one event budget this quarter.",
    read: "5 min read",
  },
];

export default function App() {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const isWaitlist = path === "/waitlist" || path === "/waitlist/";

  if (isWaitlist) {
    return <Waitlist />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased overflow-x-hidden">
      <Nav />
      <Hero />
      <AudienceSection />
      <ToolkitGrid />
      <FeaturedTool />
      <FieldNotes />
      <Footer />
    </div>
  );
}

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-[15px] tracking-tight font-semibold">
            Agent Assembly
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-soft">
          <a className="hover:text-ink transition-colors" href="#toolkit">
            Toolkit
          </a>
          <a className="hover:text-ink transition-colors" href="#featured">
            Tools
          </a>
          <a className="hover:text-ink transition-colors" href="#field">
            From the field
          </a>
          <a className="hover:text-ink transition-colors" href="#join">
            Join
          </a>
        </nav>
        <a
          href="#join"
          className="hidden md:inline-flex items-center gap-2 text-sm border border-ink/80 px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
        >
          Get the Starter Kit
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

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative border-b border-ink/15">
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-14 md:pt-24 pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT / TEXT */}
        <div className="lg:col-span-7 relative z-10">
          <h1 className="font-semibold tracking-tightest leading-[0.92] text-[56px] sm:text-7xl md:text-8xl lg:text-[104px]">
            AI for people
            <br />
            who bring
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">people</span>
              <span className="absolute left-0 right-0 bottom-2 md:bottom-3 h-3 md:h-4 bg-lavender/60 -z-0" />
            </span>{" "}
            together.
          </h1>

          <p className="mt-10 max-w-xl text-lg md:text-xl text-ink-soft leading-snug">
            Automate the chores.
            <br className="hidden sm:block" />
            <span className="text-ink"> Run the moment.</span>
          </p>

          <p className="mt-6 max-w-md text-[15px] text-ink-muted leading-relaxed">
            The toolkit, playbooks, and prompts event marketers are using to
            plan, fill, and prove ROI on every event — with AI doing the
            chores.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href="#featured"
              className="group inline-flex items-center gap-3 bg-ink text-paper px-6 py-4 text-[15px] tracking-tight hover:bg-lavender hover:text-paper transition-colors"
            >
              Explore the toolkit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#field"
              className="text-sm text-ink-soft border-b border-ink/40 pb-1 hover:text-ink hover:border-ink transition-colors"
            >
              Read from the field →
            </a>
          </div>
        </div>

        {/* RIGHT / VISUAL */}
        <div className="lg:col-span-5 relative h-[420px] sm:h-[520px] lg:h-[640px]">
          <div className="absolute inset-0">
            <ParticleField
              gradient="top-right"
              count={520}
              color="#111111"
              maxSize={1.8}
              minOpacity={0.18}
              maxOpacity={0.85}
              repelRadius={90}
              repelStrength={1.6}
              className="w-full h-full"
            />
          </div>

          {/* Lavender accent cluster */}
          <div className="absolute top-6 right-6 w-44 h-44 pointer-events-none">
            <ParticleField
              gradient="radial-center"
              count={140}
              color="#8E7DBE"
              maxSize={1.4}
              minOpacity={0.35}
              maxOpacity={0.95}
              repelRadius={60}
              repelStrength={1.2}
              interactive={false}
              className="w-full h-full"
            />
          </div>

          {/* Editorial caption */}
          <div className="absolute bottom-0 right-0 text-right max-w-[220px]">
            <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-2">
              Fig. 01
            </div>
            <div className="text-sm text-ink-soft leading-snug">
              A room of people, rendered as structured noise. The cluster
              drifts, disperses, re-assembles.
            </div>
          </div>
        </div>
      </div>

      {/* Thin divider particle band between hero and next section */}
      <div className="h-10 relative overflow-hidden">
        <ParticleField
          gradient="transition"
          count={160}
          color="#111111"
          maxSize={1}
          minOpacity={0.15}
          maxOpacity={0.5}
          interactive={false}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}

/* ---------- Audience ---------- */

function AudienceSection() {
  return (
    <section className="border-b border-ink/15">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
            01 — Who it's for
          </div>
          <h2 className="font-semibold tracking-tightest leading-[0.95] text-4xl md:text-5xl">
            The people holding the calendar, the room, and the group chat.
          </h2>
          <p className="mt-6 text-ink-soft leading-relaxed max-w-md">
            Agent Assembly is for event marketers — the people who still,
            against all odds, believe in showing up. We ship the workflows,
            prompts, and tools that actually moved pipeline, and we run
            Build Nights so you're not figuring it out alone.
          </p>
        </div>

        <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-ink/10 border-t border-ink/20">
          {audiences.map((a, i) => (
            <li
              key={a}
              className={[
                "flex items-baseline gap-6 py-6 sm:py-7",
                i % 2 === 0 ? "sm:border-r sm:border-ink/10 sm:pr-6" : "sm:pl-6",
                i >= 2 ? "sm:border-t sm:border-ink/10" : "",
              ].join(" ")}
            >
              <span className="text-xs tabular-nums text-ink-muted tracking-[0.2em] w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl md:text-[28px] font-medium tracking-tight">
                {a}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Toolkit grid ---------- */

function ToolkitGrid() {
  return (
    <section id="toolkit" className="border-b border-ink/15 relative">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
              02 — The toolkit
            </div>
            <h2 className="font-semibold tracking-tightest leading-[0.95] text-4xl md:text-6xl max-w-3xl">
              Four layers.{" "}
              <span className="text-lavender">Battle-tested</span> by the room.
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft leading-relaxed">
            Every workflow, prompt, and micro-tool is stress-tested at real
            dinners, summits, and field days before we ship it. Priced so one
            saved event pays for all of them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/20">
          {toolkit.map((t) => (
            <article
              key={t.title}
              className="border-r border-b border-ink/20 p-8 md:p-10 flex flex-col min-h-[320px] group hover:bg-ink hover:text-paper transition-colors duration-300"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-ink-muted group-hover:text-paper/60">
                <span>{t.label}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="mt-10 text-3xl md:text-4xl font-semibold tracking-tight">
                {t.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft group-hover:text-paper/80">
                {t.description}
              </p>
              <div className="mt-auto pt-10 text-xs uppercase tracking-[0.22em] text-ink-muted group-hover:text-paper/60">
                {t.meta}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 border-t border-ink/20 pt-10 md:pt-14">
          <div className="md:pr-10 md:border-r md:border-ink/15">
            <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.22em] text-ink-muted">
              <span>Starter Kit</span>
              <span className="h-px flex-1 bg-ink/15" />
              <span className="font-mono text-ink">$49</span>
            </div>
            <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
              Five plug-and-play workflows, the prompt pack, the Event ROI
              Calculator, and an invite to the next Build Night. One-time.
              No subscription.
            </p>
            <a
              href="#join"
              className="mt-6 inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] tracking-tight hover:bg-lavender transition-colors"
            >
              Get the Starter Kit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="md:pl-10">
            <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.22em] text-ink-muted">
              <span>Pro</span>
              <span className="h-px flex-1 bg-ink/15" />
              <span className="font-mono text-ink">$15 / mo</span>
            </div>
            <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
              New workflows every month, every Build Night, the full back
              catalogue of field notes, and a shared room with the rest of
              the operators figuring this out in real time.
            </p>
            <a
              href="#join"
              className="mt-6 inline-flex items-center gap-2 text-[14px] border-b border-ink pb-1 hover:text-lavender hover:border-lavender transition-colors"
            >
              Join Pro
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Featured tool: ROI calculator ---------- */

function FeaturedTool() {
  return (
    <section id="featured" className="border-b border-ink/15 relative">
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <ParticleField
          gradient="left-fade"
          count={260}
          color="#111111"
          maxSize={1.1}
          minOpacity={0.12}
          maxOpacity={0.4}
          interactive={false}
          className="w-full h-full"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
            03 — Featured tool
          </div>
          <h2 className="font-semibold tracking-tightest leading-[0.95] text-4xl md:text-6xl">
            Event ROI Calculator
          </h2>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
            The question every CFO asks and most event teams can't answer.
            Punch in the spend, the guests, the pipeline. Get the multiple,
            the read-out, and the line your team can actually send to
            finance.
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-ink-soft">
            <li className="flex gap-3">
              <span className="text-lavender">◆</span>
              Pipeline multiple + cost-per-qualified-conversation
            </li>
            <li className="flex gap-3">
              <span className="text-lavender">◆</span>
              Benchmarks by event type (dinner, summit, field day)
            </li>
            <li className="flex gap-3">
              <span className="text-lavender">◆</span>
              Shareable read-out for the team Slack — and your CFO
            </li>
          </ul>
          <a
            href="#"
            className="mt-10 inline-flex items-center gap-2 text-[15px] border-b border-ink pb-1 hover:text-lavender hover:border-lavender transition-colors"
          >
            Open the calculator
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="lg:col-span-7">
          <ROICard />
        </div>
      </div>
    </section>
  );
}

function ROICard() {
  const [spend, setSpend] = useState(18000);
  const [guests, setGuests] = useState(60);
  const [pipeline, setPipeline] = useState(240000);

  const { multiple, cpq, label } = useMemo(() => {
    const m = pipeline / Math.max(1, spend);
    const c = spend / Math.max(1, guests);
    let l = "Solid event";
    if (m >= 6) l = "Breakout event";
    else if (m >= 3) l = "Strong event";
    else if (m >= 1.5) l = "Solid event";
    else l = "Needs a second look";
    return { multiple: m, cpq: c, label: l };
  }, [spend, guests, pipeline]);

  return (
    <div className="border border-ink bg-paper/90 backdrop-blur-[1px] p-6 md:p-10">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-ink-muted">
        <span>Event ROI · Interactive</span>
        <span>v0.3</span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <NumberField
          label="Total spend"
          prefix="$"
          value={spend}
          step={500}
          min={0}
          onChange={setSpend}
        />
        <NumberField
          label="Guests attended"
          value={guests}
          step={5}
          min={0}
          onChange={setGuests}
        />
        <NumberField
          label="Pipeline sourced"
          prefix="$"
          value={pipeline}
          step={5000}
          min={0}
          onChange={setPipeline}
        />
      </div>

      <div className="mt-10 border-t border-ink/20 pt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
        <Metric k={`${multiple.toFixed(1)}x`} v="Pipeline multiple" accent />
        <Metric k={`$${Math.round(cpq).toLocaleString()}`} v="Cost per guest" />
        <Metric k={label} v="Read-out" small />
      </div>

      <div className="mt-10 pt-6 border-t border-ink/20 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-ink-muted">
          Draft read-out
        </span>
        <button className="inline-flex items-center gap-2 text-[13px] border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors">
          Copy to Slack
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </span>
      <div className="mt-3 flex items-center border border-ink/30 bg-paper">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="px-3 py-3 text-ink-muted hover:text-ink hover:bg-ink/5"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 flex items-center px-2 py-3">
          {prefix && <span className="text-ink-muted mr-1">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            step={step}
            onChange={(e) => {
              const n = Number(e.target.value);
              onChange(Number.isFinite(n) ? Math.max(min, n) : 0);
            }}
            className="w-full bg-transparent text-lg font-medium tracking-tight outline-none tabular-nums"
          />
        </div>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="px-3 py-3 text-ink-muted hover:text-ink hover:bg-ink/5"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </label>
  );
}

function Metric({
  k,
  v,
  accent,
  small,
}: {
  k: string;
  v: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div>
      <div
        className={[
          "font-semibold tracking-tight",
          small ? "text-xl md:text-2xl" : "text-3xl md:text-4xl",
          accent ? "text-lavender" : "text-ink",
        ].join(" ")}
      >
        {k}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.22em] text-ink-muted">
        {v}
      </div>
    </div>
  );
}

/* ---------- From the field ---------- */

function FieldNotes() {
  return (
    <section id="field" className="border-b border-ink/15">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-6">
              04 — From the field
            </div>
            <h2 className="font-semibold tracking-tightest leading-[0.95] text-4xl md:text-6xl max-w-3xl">
              Dispatches from rooms where the work actually happened.
            </h2>
          </div>
          <a
            href="#"
            className="text-sm border-b border-ink pb-1 hover:text-lavender hover:border-lavender transition-colors whitespace-nowrap"
          >
            Browse all dispatches →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {stories.map((s, i) => (
            <article
              key={s.title}
              className="bg-paper p-8 md:p-10 flex flex-col group"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                {s.dateline}
              </div>
              <h3 className="mt-8 text-2xl md:text-[28px] font-semibold tracking-tight leading-tight">
                {s.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {s.excerpt}
              </p>
              <div className="mt-auto pt-10 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-ink-muted">
                <span>{s.read}</span>
                <span className="font-mono text-[11px]">
                  № {String(i + 1).padStart(3, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer id="join" className="relative bg-paper overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField
          gradient="bottom-up"
          count={900}
          color="#111111"
          maxSize={1.6}
          minOpacity={0.18}
          maxOpacity={0.85}
          repelRadius={70}
          repelStrength={1.1}
          className="w-full h-full"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 pt-24 md:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          <div className="lg:col-span-7">
            <h2 className="font-semibold tracking-tightest leading-[0.95] text-4xl md:text-6xl max-w-2xl">
              You bring the room.
              <br />
              We'll bring{" "}
              <span className="text-lavender">the machinery</span>.
            </h2>
            <p className="mt-8 max-w-md text-ink-soft leading-relaxed">
              Drop your email. You'll get a free workflow from the Starter
              Kit, an invite to the next Build Night, and one dispatch a
              month from the field. No drip campaigns.
            </p>
          </div>

          <form
            className="lg:col-span-5 flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="text-xs uppercase tracking-[0.22em] text-ink-muted">
              Get the free workflow + invite
            </label>
            <div className="flex border border-ink bg-paper">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 px-4 py-4 bg-transparent text-[15px] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-4 bg-ink text-paper text-[13px] uppercase tracking-[0.22em] hover:bg-lavender transition-colors inline-flex items-center gap-2"
              >
                Send it
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-ink-muted">
              Prefer the full Starter Kit? $49, one-time — no subscription.
            </p>
          </form>
        </div>

        <div className="border-t border-ink/30 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <FooterCol
            title="Product"
            items={["Workflows", "Templates", "Tools", "Systems"]}
          />
          <FooterCol
            title="Writing"
            items={["From the field", "Playbooks", "Glossary"]}
          />
          <FooterCol
            title="Shop"
            items={["Starter Kit · $49", "Pro · $15/mo", "Build Nights", "Contact"]}
          />
          <FooterCol
            title="Elsewhere"
            items={["Twitter / X", "LinkedIn", "Substack"]}
          />
        </div>

        <div className="mt-16 pt-6 border-t border-ink/20 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-ink-muted">
          <LogoMark />
          <span>Agent Assembly · Est. 2026</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.22em] text-ink-muted mb-4">
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i}>
            <a
              href="#"
              className="text-ink-soft hover:text-ink transition-colors"
            >
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
