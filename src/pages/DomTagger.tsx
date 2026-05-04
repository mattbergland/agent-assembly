import { ToolLayout } from "@/components/Layout";
import "../App.css";

export default function DomTagger() {
  return (
    <ToolLayout title="DOM Tagger">
      <main className="flex-1 px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="pt-4 pb-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono text-lavender opacity-60">
                05
              </span>
              <span className="h-px w-4 bg-ink-muted/25" />
              <span className="text-xs text-ink-muted tracking-wide uppercase">
                Browser Extension
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              DOM Tagger for Devin
            </h1>
            <p className="text-sm md:text-base text-ink-muted mt-3 leading-relaxed">
              A Chrome extension that lets you visually inspect, select, and tag
              DOM elements — then copy structured references you can paste
              directly into Devin for precise frontend tweaks.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            <FeatureCard
              icon={<InspectorIcon />}
              title="Point-and-click inspector"
              description="Hover over any element to see its tag, classes, and dimensions in a live tooltip. Click to tag it."
            />
            <FeatureCard
              icon={<SelectorIcon />}
              title="Smart CSS selectors"
              description="Automatically generates a unique, readable CSS selector and full DOM path for every tagged element."
            />
            <FeatureCard
              icon={<NoteIcon />}
              title="Add notes"
              description="Attach a plain-text note to each tag — describe the change you want Devin to make."
            />
            <FeatureCard
              icon={<CopyIcon />}
              title="Copy for Devin"
              description="One click copies all tagged elements as a formatted Markdown reference ready for Devin."
            />
          </div>

          {/* Install instructions */}
          <div className="rounded-xl border border-rule/10 bg-white p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-lg font-medium tracking-tight mb-1">
              Install the extension
            </h2>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              DOM Tagger ships as an unpacked Chrome extension inside this
              repository. Follow these steps to load it into your browser.
            </p>

            <ol className="space-y-4 text-sm">
              <Step num={1}>
                Clone or pull the{" "}
                <code className="bg-paper px-1.5 py-0.5 rounded text-[13px] font-mono">
                  agent-assembly
                </code>{" "}
                repo so you have the{" "}
                <code className="bg-paper px-1.5 py-0.5 rounded text-[13px] font-mono">
                  browser-extension/
                </code>{" "}
                folder locally.
              </Step>
              <Step num={2}>
                Open Chrome and navigate to{" "}
                <code className="bg-paper px-1.5 py-0.5 rounded text-[13px] font-mono">
                  chrome://extensions
                </code>
              </Step>
              <Step num={3}>
                Enable <strong>Developer mode</strong> (toggle in the top-right
                corner).
              </Step>
              <Step num={4}>
                Click <strong>Load unpacked</strong> and select the{" "}
                <code className="bg-paper px-1.5 py-0.5 rounded text-[13px] font-mono">
                  browser-extension
                </code>{" "}
                directory.
              </Step>
              <Step num={5}>
                Pin the extension to your toolbar. Click the icon on any page to
                activate the inspector.
              </Step>
            </ol>
          </div>

          {/* Usage section */}
          <div className="rounded-xl border border-rule/10 bg-white p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-lg font-medium tracking-tight mb-1">
              How to use
            </h2>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              Tag elements on any page, add notes describing what you want
              changed, then paste the reference into Devin.
            </p>

            <div className="space-y-5 text-sm">
              <UsageStep
                title="Activate"
                description="Click the DOM Tagger icon in your toolbar. A side panel appears and the page enters inspection mode."
              />
              <UsageStep
                title="Inspect & tag"
                description="Hover over elements — you'll see a highlight and tooltip with the tag name, classes, and size. Click to tag an element."
              />
              <UsageStep
                title="Add notes"
                description='Each tagged element has a note field. Describe the change you want — e.g. "Make this heading 24px on mobile" or "Add 16px bottom margin".'
              />
              <UsageStep
                title="Copy for Devin"
                description='Click "Copy for Devin" at the bottom of the panel. This copies a Markdown-formatted reference with selectors, paths, dimensions, and your notes.'
              />
              <UsageStep
                title="Paste into Devin"
                description="Open a Devin session, paste the reference, and describe what you want changed. Devin will know exactly which elements to modify."
              />
            </div>
          </div>

          {/* Example output */}
          <div className="rounded-xl border border-rule/10 bg-white p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-lg font-medium tracking-tight mb-1">
              Example output
            </h2>
            <p className="text-sm text-ink-muted mb-4 leading-relaxed">
              Here's what the copied reference looks like when you paste it
              into Devin:
            </p>
            <pre className="bg-ink text-paper/90 rounded-lg p-5 text-xs leading-relaxed overflow-x-auto font-mono">
{`## DOM Element References

Page: https://example.com/dashboard

### 1. Page title
- **Selector**: \`h1.text-2xl.font-bold\`
- **Element**: \`<h1 class="text-2xl font-bold tracking-tight">\`
- **Path**: \`body > div#root > main > div.container > h1\`
- **Text**: "Welcome to the Dashboard"
- **Dimensions**: 800 × 48px at (100, 200)
- **Note**: "Reduce to text-xl on mobile breakpoint"

### 2. Sidebar nav
- **Selector**: \`nav.sidebar\`
- **Element**: \`<nav class="sidebar w-64 border-r">\`
- **Path**: \`body > div#root > div.layout > nav.sidebar\`
- **Dimensions**: 256 × 900px at (0, 56)
- **Note**: "Add a subtle background color #F9FAFB"`}
            </pre>
          </div>
        </div>
      </main>

    </ToolLayout>
  );
}

/* ── Sub-components ── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-rule/10 bg-white p-5 shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-ink/[0.03] flex items-center justify-center mb-3 text-ink-muted">
        {icon}
      </div>
      <h3 className="text-sm font-medium tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex-none w-6 h-6 rounded-full bg-lavender/10 text-lavender text-xs font-semibold flex items-center justify-center mt-0.5">
        {num}
      </span>
      <span className="text-ink-soft leading-relaxed">{children}</span>
    </li>
  );
}

function UsageStep({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-none w-1.5 h-1.5 rounded-full bg-lavender mt-1.5" />
      <div>
        <span className="font-medium text-ink">{title}</span>
        <span className="text-ink-muted ml-1">&mdash; {description}</span>
      </div>
    </div>
  );
}

/* ── Icons ── */

function InspectorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

function SelectorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
