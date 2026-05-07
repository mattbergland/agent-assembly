import { useEffect, useState } from "react";

/* ─── colour tokens (DBS red × Devin dark) ─── */
const C = {
  bg: "#0A0A0F",
  bgCard: "#12121A",
  bgCardHover: "#1A1A25",
  border: "#1F1F2E",
  borderAccent: "#E3242B",
  red: "#E3242B",
  redSoft: "#FF4D54",
  redGlow: "rgba(227, 36, 43, 0.15)",
  gold: "#C9A84C",
  goldSoft: "#E2C97A",
  text: "#F0F0F5",
  textMuted: "#9999AA",
  textDim: "#666677",
  white: "#FFFFFF",
};

/* ─── SVG logos (inline for zero external deps) ─── */
function DBSLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="30" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="28" fill={C.red}>
        DBS
      </text>
    </svg>
  );
}

function CognitionLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="28" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="22" fill={C.white}>
        Cognition
      </text>
    </svg>
  );
}

function XMark() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: `1.5px solid ${C.border}`,
        color: C.textMuted,
        fontSize: 14,
        fontWeight: 300,
        flexShrink: 0,
      }}
    >
      &times;
    </span>
  );
}

/* ─── Animated background grid ─── */
function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px]"
        style={{
          background: `radial-gradient(ellipse at center top, ${C.redGlow} 0%, transparent 70%)`,
        }}
      />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(${C.white} 1px, transparent 1px),
            linear-gradient(90deg, ${C.white} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative z-10 px-5 sm:px-8 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

/* ─── Agenda session card ─── */
function AgendaCard({
  time,
  title,
  subtitle,
  speakers,
  bullets,
  tag,
  accent = false,
}: {
  time: string;
  title: string;
  subtitle?: string;
  speakers?: string[];
  bullets?: string[];
  tag?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="group relative rounded-xl border p-5 sm:p-6 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        backgroundColor: C.bgCard,
        borderColor: accent ? C.borderAccent : C.border,
        boxShadow: accent
          ? `0 0 30px ${C.redGlow}, inset 0 1px 0 rgba(255,255,255,0.03)`
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
        {/* time pill */}
        <div
          className="shrink-0 text-xs font-mono tracking-wider px-3 py-1.5 rounded-md self-start"
          style={{
            backgroundColor: accent ? C.redGlow : "rgba(255,255,255,0.04)",
            color: accent ? C.redSoft : C.textMuted,
            border: `1px solid ${accent ? "rgba(227,36,43,0.3)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {time}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <h3
              className="text-base sm:text-lg font-semibold leading-snug"
              style={{ color: C.text }}
            >
              {title}
            </h3>
            {tag && (
              <span
                className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full shrink-0 mt-1"
                style={{
                  backgroundColor: "rgba(201,168,76,0.12)",
                  color: C.gold,
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                {tag}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: C.textMuted }}>
              {subtitle}
            </p>
          )}
          {speakers && speakers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {speakers.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: C.textMuted,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          {bullets && bullets.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.textDim }}>
                  <span
                    className="mt-2 w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: C.red }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Break / divider card ─── */
function BreakCard({ time, label }: { time: string; label: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div
        className="text-xs font-mono tracking-wider px-3 py-1.5 rounded-md"
        style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          color: C.textDim,
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {time}
      </div>
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
      <span className="text-xs uppercase tracking-widest" style={{ color: C.textDim }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
    </div>
  );
}

/* ─── Track card (afternoon breakouts) ─── */
function TrackCard({
  track,
  title,
  audience,
  focus,
  deliverable,
}: {
  track: string;
  title: string;
  audience: string;
  focus: string[];
  deliverable: string;
}) {
  return (
    <div
      className="rounded-xl border p-5 sm:p-6 flex flex-col h-full"
      style={{
        backgroundColor: C.bgCard,
        borderColor: C.border,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: C.red, color: C.white }}
        >
          {track}
        </span>
        <span className="text-xs uppercase tracking-widest" style={{ color: C.textDim }}>
          Track
        </span>
      </div>
      <h4 className="text-base font-semibold mb-2" style={{ color: C.text }}>
        {title}
      </h4>
      <p className="text-xs mb-3" style={{ color: C.textMuted }}>
        <span style={{ color: C.gold }}>Audience:</span> {audience}
      </p>
      <ul className="space-y-1.5 mb-4 flex-1">
        {focus.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.textDim }}>
            <span
              className="mt-2 w-1 h-1 rounded-full shrink-0"
              style={{ backgroundColor: C.redSoft }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div
        className="text-xs p-3 rounded-lg"
        style={{
          backgroundColor: "rgba(201,168,76,0.06)",
          border: "1px solid rgba(201,168,76,0.15)",
          color: C.goldSoft,
        }}
      >
        <span className="font-semibold">Deliverable:</span> {deliverable}
      </div>
    </div>
  );
}

/* ─── Stat pill ─── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold" style={{ color: C.red }}>
        {value}
      </div>
      <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: C.textMuted }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Nav link ─── */
function NavAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm transition-colors duration-200"
      style={{ color: C.textMuted }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════ */
export default function DBSCognitionEvent() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: C.bg, color: C.text }}
    >
      <GridBackground />

      {/* ── Sticky nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between px-5 sm:px-8 h-16">
          <div className="flex items-center gap-3">
            <DBSLogo className="h-6" />
            <XMark />
            <CognitionLogo className="h-5" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <NavAnchor href="#agenda">Agenda</NavAnchor>
            <NavAnchor href="#tracks">Tracks</NavAnchor>
            <NavAnchor href="#outcomes">Outcomes</NavAnchor>
            <a
              href="#register"
              className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: C.red,
                color: C.white,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.redSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.red)}
            >
              Register Interest
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <Section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="text-center max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold px-4 py-1.5 rounded-full mb-8"
            style={{
              border: `1px solid ${C.borderAccent}`,
              color: C.redSoft,
              backgroundColor: C.redGlow,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: C.red }}
            />
            Invite-Only &middot; Singapore 2026
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ color: C.white }}
          >
            Engineering the Next Wave of{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.red}, ${C.redSoft})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-Powered Banking
            </span>
          </h1>

          <p className="text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto" style={{ color: C.textMuted }}>
            A full-day executive summit where DBS and Cognition co-design the
            future of autonomous AI engineering in financial services — from
            legacy modernization to customer journey acceleration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#register"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: C.red,
                color: C.white,
                boxShadow: `0 0 40px ${C.redGlow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.redSoft;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.red;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Register Interest
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a
              href="#agenda"
              className="inline-flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-200"
              style={{
                border: `1px solid ${C.border}`,
                color: C.textMuted,
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = C.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.textMuted;
              }}
            >
              View Full Agenda
            </a>
          </div>
        </div>

        {/* stat bar */}
        <div
          className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-8 sm:gap-16 py-6 px-6 rounded-2xl mx-auto max-w-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: `1px solid ${C.border}`,
          }}
        >
          <Stat value="Full Day" label="Summit" />
          <Stat value="3" label="Deep-Dive Tracks" />
          <Stat value="50+" label="Senior Leaders" />
          <Stat value="5" label="Pilot Concepts" />
        </div>
      </Section>

      {/* ── Logos / co-branding strip ── */}
      <Section className="py-12">
        <div
          className="flex items-center justify-center gap-12 sm:gap-20 py-8 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.015)",
            border: `1px solid ${C.border}`,
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: C.red }}>
              DBS
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] mt-1" style={{ color: C.textDim }}>
              World's Best Bank
            </div>
          </div>
          <div
            className="w-px h-12"
            style={{ backgroundColor: C.border }}
          />
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: C.white }}>
              Cognition
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] mt-1" style={{ color: C.textDim }}>
              AI Software Engineer
            </div>
          </div>
        </div>
      </Section>

      {/* ── Morning agenda ── */}
      <Section id="agenda" className="py-16 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: C.red }}
          >
            Full-Day Agenda
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3" style={{ color: C.white }}>
            DBS &times; Cognition Digital Transformation Day
          </h2>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: C.textMuted }}>
            Singapore &middot; 2026 &middot; Invite-only senior leadership summit
          </p>
        </div>

        {/* Morning heading */}
        <div className="flex items-center gap-4 mb-8">
          <h3
            className="text-xs uppercase tracking-[0.2em] font-bold shrink-0"
            style={{ color: C.gold }}
          >
            Morning Programme
          </h3>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,168,76,0.2)" }} />
        </div>

        <div className="space-y-4">
          <AgendaCard
            time="09:00"
            title="Arrival, Registration & Networking Breakfast"
            subtitle="Light networking with Cognition and DBS hosts. Demo bar with looped Devin clips showcasing repo understanding, refactoring, and test generation on banking-relevant examples."
            tag="Networking"
          />

          <AgendaCard
            time="09:30"
            title="Opening Remarks — From Digital Bank to AI-First Engineering Organization"
            subtitle="DBS' decade-long AI-powered digital transformation: digital to the core, AI at scale, ADA/ALAN platforms, and industrialised AI deployment."
            speakers={["Senior DBS Executive", "Group CIO / Head of Technology & Operations"]}
            accent
          />

          <AgendaCard
            time="09:45"
            title="Keynote — Autonomous AI Engineers in Tier-1 Banks: What's Now Possible"
            subtitle="What Devin is: an autonomous AI software engineer that understands large codebases, plans and executes end-to-end, and works with human engineers. Why banks care: legacy modernization, faster time-to-market, risk reduction."
            speakers={["Senior Cognition Executive"]}
            bullets={[
              "Leading banks already using Devin: 6x faster migrations, 5x lower cost",
              "70% of vulnerabilities auto-remediated across engineering teams",
              "Strategic partner positioning — not another tooling vendor",
            ]}
            accent
          />

          <AgendaCard
            time="10:15"
            title="Fireside Chat — Scaling AI at DBS: From ADA & ALAN to Autonomous Engineers"
            subtitle="How DBS industrialised AI: ADA as self-service platform, ALAN as AI knowledge repository, 600+ AI/ML models, and hundreds of use cases."
            speakers={[
              "DBS AI / Data Platform Leader",
              "Cognition Senior Product Leader",
            ]}
            bullets={[
              "Gaps that remain: slow change in complex legacy stacks, engineering capacity pressure",
              "How AI engineers safely sit on top of DBS platforms within governance controls",
              "Compressing development cycles from months to weeks",
            ]}
          />

          <BreakCard time="11:00" label="Coffee Break & Demo Pods" />

          <div className="grid sm:grid-cols-3 gap-3 pl-0 sm:pl-24">
            {[
              { pod: "Pod 1", label: "Legacy to Cloud-Native Migration" },
              { pod: "Pod 2", label: "Security & Vulnerability Remediation" },
              { pod: "Pod 3", label: "Ticket Backlog & Test Automation" },
            ].map(({ pod, label }) => (
              <div
                key={pod}
                className="rounded-lg border p-3 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderColor: C.border,
                }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.red }}>
                  {pod}
                </div>
                <div className="text-xs" style={{ color: C.textMuted }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <AgendaCard
            time="11:20"
            title="Technical Deep-Dive — How Devin Works Across the Software Lifecycle in a Bank"
            subtitle="End-to-end walkthrough: ingesting large repos, creating a plan, making changes, running tests, and iterating with human oversight."
            bullets={[
              "Core system upgrades and refactoring of high-risk services",
              ".NET / Java migrations, SQL server migrations, and API modernization",
              "Automated remediation of vulnerabilities (SonarQube, Fortify, Veracode)",
              "First-pass code reviews and test creation to lift quality without headcount",
            ]}
            tag="Deep Dive"
          />

          <AgendaCard
            time="12:10"
            title="Case Story — How a Global Bank Embedded Devin into Its Engineering Org"
            subtitle="High-level learnings from a major bank that started with a small modernization pilot and scaled Devin across most engineering teams."
            bullets={[
              "Quantitative outcomes: speed, cost, and adoption at scale",
              "Qualitative learning: change management, training, governance models",
              "Relevance to DBS operating model: cross-functional squads, platform teams",
            ]}
          />

          <BreakCard time="12:30" label="Networking Lunch" />

          <div className="grid sm:grid-cols-4 gap-3 pl-0 sm:pl-24">
            {[
              "Core & Platform Modernization",
              "Risk, Regulatory & Controls",
              "Customer Journeys (Consumer, Wealth, GTS)",
              "Engineering Productivity & Talent",
            ].map((table) => (
              <div
                key={table}
                className="rounded-lg border p-3 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderColor: C.border,
                }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.gold }}>
                  Theme Table
                </div>
                <div className="text-xs" style={{ color: C.textMuted }}>
                  {table}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Afternoon tracks ── */}
      <Section id="tracks" className="py-16 sm:py-24">
        <div className="flex items-center gap-4 mb-8">
          <h3
            className="text-xs uppercase tracking-[0.2em] font-bold shrink-0"
            style={{ color: C.gold }}
          >
            Afternoon Programme
          </h3>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,168,76,0.2)" }} />
        </div>

        <AgendaCard
          time="13:30"
          title="From Inspiration to Action — Choosing DBS Use Cases for Devin"
          subtitle="Participants self-select into 3 parallel tracks based on role and interests. Each track aims to leave with 2-3 concrete pilot concepts."
          tag="Breakout"
        />

        <div className="mt-6 mb-4">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: C.textDim }}>
            13:45 – 15:15 &middot; Parallel Working Sessions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <TrackCard
            track="A"
            title="Core Systems & Modernization"
            audience="Core banking, payments, GTS, architecture, and platform leads"
            focus={[
              "Identify 1-2 legacy services where migrations have been chronically slow",
              "Map DevOps pipeline, environments, and controls for Devin integration",
              "Co-design large-scale refactor and migration plan generation",
              "Progressive rollout and validation workflows",
            ]}
            deliverable="Draft pilot canvas for Devin-assisted modernization with KPIs: cycle-time reduction, defect rate, engineer-hours saved"
          />
          <TrackCard
            track="B"
            title="Risk, Compliance & Resilience"
            audience="Risk, compliance, internal audit, tech risk, and SRE leaders"
            focus={[
              "Regulatory change implementation and model documentation",
              "Control testing and incident post-mortem remediation",
              "Scanning repos for control gaps and generating remediation PRs",
              "Supporting stress scenarios by tracing dependencies and proposing fixes",
            ]}
            deliverable="Shortlist 1-2 safety-positive pilots (e.g., vulnerability remediation factory, regulatory-change helper)"
          />
          <TrackCard
            track="C"
            title="Customer Journeys & Productivity"
            audience="Consumer/SME, Wealth, GTS product owners, digital channels, and dev leads"
            focus={[
              "Map journeys where DBS uses AI to personalise experiences",
              "Identify engineering bottlenecks slowing experimentation",
              "Rapidly spin up experiments and A/B test variants",
              "Accelerate partner ecosystem integration (APIs, microservices)",
            ]}
            deliverable="2-3 Devin-accelerated customer journey ideas with time-to-market and experiment velocity targets"
          />
        </div>

        <div className="space-y-4 mt-8">
          <BreakCard time="15:15" label="Coffee Break" />

          <AgendaCard
            time="15:30"
            title="Report-Back & Consolidation — Pilot Pitches: Where Should DBS Start?"
            subtitle="Each track presents top 1-2 pilot ideas (5-7 minutes each) to a joint DBS + Cognition panel. Panel responds on feasibility, dependencies, risk considerations, and timeline."
            tag="Plenary"
            bullets={[
              "3-5 prioritized pilot candidates with cross-functional sponsors",
              "Indicative timelines and resource requirements",
            ]}
          />

          <AgendaCard
            time="16:15"
            title="Executive Close-Out — From Day-One to Day-100"
            subtitle="Building a DBS × Cognition AI-Engineer Program: 90-day joint programme structure covering discovery, sandbox pilots, evaluation, and scale-out."
            speakers={["Cognition Executive", "DBS Executive Sponsor"]}
            accent
            bullets={[
              "Ownership: which teams co-own Devin pilots (platform, business, risk)",
              "Governance model: guardrails, data boundaries, human-in-the-loop design",
              "Success definition: engineering leverage, risk posture, business value",
            ]}
          />

          <AgendaCard
            time="16:45"
            title="Informal Networking & Optional Demos"
            subtitle="Small-group demos for teams wanting to go deeper on specific stacks. Capture follow-up interest: pilot sponsors, technical POCs, and compliance/legal stakeholders."
            tag="Networking"
          />
        </div>
      </Section>

      {/* ── Outcomes section ── */}
      <Section id="outcomes" className="py-16 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: C.red }}
          >
            Expected Outcomes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3" style={{ color: C.white }}>
            What You'll Walk Away With
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "01",
              title: "Prioritized Pilots",
              desc: "3-5 concrete DBS-specific pilot concepts with clear scope, stakeholders, and success metrics.",
            },
            {
              icon: "02",
              title: "90-Day Programme",
              desc: "Joint program structure: discovery, sandbox pilots, evaluation, and scale-out model.",
            },
            {
              icon: "03",
              title: "Governance Model",
              desc: "Guardrails, data boundaries, and human-in-the-loop design aligned with DBS frameworks.",
            },
            {
              icon: "04",
              title: "Cross-Functional Sponsors",
              desc: "Named pilot owners across platform, line of business, and risk teams.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={icon}
              className="rounded-xl border p-5 group hover:translate-y-[-2px] transition-all duration-300"
              style={{
                backgroundColor: C.bgCard,
                borderColor: C.border,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              <div
                className="text-xl font-bold mb-3"
                style={{ color: C.red }}
              >
                {icon}
              </div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: C.text }}>
                {title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Devin evidence strip ── */}
      <Section className="py-16 sm:py-20">
        <div
          className="rounded-2xl border p-8 sm:p-12 text-center"
          style={{
            backgroundColor: C.redGlow,
            borderColor: "rgba(227,36,43,0.2)",
          }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: C.white }}>
            Proven at Scale in Global Banking
          </h3>
          <p className="text-sm max-w-2xl mx-auto mb-8" style={{ color: C.textMuted }}>
            Leading banks are already deploying Devin for large-scale engineering transformation.
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            <Stat value="6x" label="Faster Migrations" />
            <Stat value="5x" label="Lower Cost" />
            <Stat value="70%" label="Vulns Auto-Remediated" />
            <Stat value="90%+" label="Engineer Adoption" />
          </div>
        </div>
      </Section>

      {/* ── Register interest CTA ── */}
      <Section id="register" className="py-16 sm:py-24">
        <div
          className="rounded-2xl border p-8 sm:p-12 text-center"
          style={{
            backgroundColor: C.bgCard,
            borderColor: C.border,
            boxShadow: `0 0 60px ${C.redGlow}`,
          }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: C.white }}>
            Register Your Interest
          </h3>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: C.textMuted }}>
            This is an invite-only event for senior DBS and Cognition stakeholders.
            Express your interest and we'll follow up with details.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.name@dbs.com"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.border}`,
                color: C.text,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.red;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${C.redGlow}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: C.red,
                color: C.white,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.redSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.red)}
            >
              Submit
            </button>
          </div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-5 sm:px-8 py-12 mt-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-px mb-8" style={{ backgroundColor: C.border }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DBSLogo className="h-5 opacity-60" />
              <XMark />
              <CognitionLogo className="h-4 opacity-60" />
            </div>
            <p className="text-xs" style={{ color: C.textDim }}>
              &copy; 2026 DBS Bank &amp; Cognition AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
