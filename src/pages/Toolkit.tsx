import { Link } from "react-router-dom";
import { Nav, Footer } from "@/components/Layout";
import "../App.css";

interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  to?: string;
  comingSoon?: boolean;
}

const toolkitItems: ToolkitItem[] = [
  {
    id: "template-library",
    title: "Template Library",
    description:
      "Ready-to-use documents for planning, execution, and retrospectives. Open directly in Google Docs, Word, or Notion.",
    icon: <TemplateLibraryIcon />,
    to: "/toolkit/templates",
  },
  {
    id: "roi-calculator",
    title: "ROI Calculator",
    description:
      "Quantify the impact of your events with pipeline attribution, cost-per-lead analysis, and executive-ready ROI reports.",
    icon: <ROICalculatorIcon />,
    to: "/toolkit/roi-calculator",
  },
  {
    id: "seat-arrangement",
    title: "Seat Arrangement Planner",
    description:
      "Design table assignments and seating charts that maximize networking potential and strategic conversations.",
    icon: <SeatArrangementIcon />,
    to: "/toolkit/seat-arrangement",
  },
  {
    id: "featured-venues",
    title: "Featured Venues",
    description:
      "Curated spaces for executive dinners, offsites, and large-format events — vetted and reviewed by event marketers.",
    icon: <FeaturedVenuesIcon />,
    comingSoon: true,
  },
  {
    id: "experience-library",
    title: "Experience Library",
    description:
      "Browse proven event formats, activations, and creative concepts that drive engagement and leave lasting impressions.",
    icon: <ExperienceLibraryIcon />,
    comingSoon: true,
  },
  {
    id: "vendor-list",
    title: "Vendor List",
    description:
      "Trusted partners for catering, AV, production, staffing, and everything in between — organized by category and region.",
    icon: <VendorListIcon />,
    comingSoon: true,
  },
];

export default function Toolkit() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <Nav />

      <main className="flex-1 px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="pt-8 pb-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono text-lavender opacity-60">
                01
              </span>
              <span className="h-px w-4 bg-ink-muted/25" />
              <span className="text-xs text-ink-muted tracking-wide uppercase">
                Toolkit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              Everything you need to run world-class events.
            </h1>
            <p className="text-sm md:text-base text-ink-muted mt-3 leading-relaxed">
              Templates, calculators, planners, and curated resources — built for
              event marketers who sweat the details.
            </p>
          </div>

          {/* Toolkit cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {toolkitItems.map((item) => (
              <ToolkitCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ToolkitCard({ item }: { item: ToolkitItem }) {
  const content = (
    <div
      className={`group relative flex flex-col rounded-xl border border-rule/10 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 ${
        item.comingSoon
          ? "opacity-80"
          : "hover:shadow-lg hover:border-lavender/30 hover:-translate-y-0.5 cursor-pointer"
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-ink/[0.03] flex items-center justify-center mb-5 text-ink-muted group-hover:text-lavender transition-colors duration-300">
        {item.icon}
      </div>

      {/* Title + badge */}
      <div className="flex items-center gap-2.5 mb-2">
        <h3 className="text-base font-medium tracking-tight text-ink">
          {item.title}
        </h3>
        {item.comingSoon && (
          <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-lavender/10 text-lavender">
            Coming Soon
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-ink-muted leading-relaxed">
        {item.description}
      </p>

      {/* Arrow indicator for linked cards */}
      {!item.comingSoon && (
        <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explore</span>
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
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  if (item.to && !item.comingSoon) {
    return <Link to={item.to}>{content}</Link>;
  }
  return content;
}

/* ── Icons ── */

function TemplateLibraryIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ROICalculatorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function SeatArrangementIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="3" r="1.5" />
      <circle cx="19.8" cy="7.5" r="1.5" />
      <circle cx="19.8" cy="16.5" r="1.5" />
      <circle cx="12" cy="21" r="1.5" />
      <circle cx="4.2" cy="16.5" r="1.5" />
      <circle cx="4.2" cy="7.5" r="1.5" />
    </svg>
  );
}

function FeaturedVenuesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01" />
      <path d="M9 12v.01" />
      <path d="M9 15v.01" />
      <path d="M9 18v.01" />
    </svg>
  );
}

function ExperienceLibraryIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function VendorListIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
