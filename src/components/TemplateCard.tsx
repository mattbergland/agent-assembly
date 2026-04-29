import type { Template } from "@/data/templates";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group relative flex flex-col">
      {/* Preview card */}
      <div className="relative aspect-[4/3] rounded-lg border border-rule/10 bg-white overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <TemplatePreview template={template} />
        <HoverOverlay template={template} />
      </div>

      {/* Caption area below card */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-medium tracking-tight text-ink leading-snug">
          {template.title}
        </h3>
        <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-2">
          {template.caption}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-ink/[0.04] text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  const { preview } = template;

  return (
    <div className="absolute inset-0 p-5 flex flex-col">
      {/* Miniature document header */}
      <div className="flex items-start gap-2 mb-3">
        <DocIcon style={preview.style} />
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-gray-800 tracking-tight truncate">
            {preview.heading}
          </div>
          <div className="text-[9px] text-gray-400 mt-0.5">
            Agent Assembly Template
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-3" />

      {/* Section list */}
      <div className="flex-1 flex flex-col gap-[7px]">
        {preview.sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            <div className="flex items-center gap-1.5">
              {preview.style === "checklist" && (
                <div className="w-2 h-2 rounded-[2px] border border-gray-300 shrink-0" />
              )}
              {preview.style === "runofshow" && (
                <span className="text-[8px] font-mono text-gray-300 w-6 shrink-0">
                  {`${9 + i * 1}:${i % 2 === 0 ? "00" : "30"}`}
                </span>
              )}
              <div className="text-[9px] font-medium text-gray-600">
                {section}
              </div>
            </div>
            <div className="flex flex-col gap-[2px] ml-0">
              {preview.style === "brainstorm" ? (
                <div className="flex gap-1">
                  {[...Array(2 + (i % 2))].map((_, j) => (
                    <div
                      key={j}
                      className="h-[3px] rounded-full bg-gray-100"
                      style={{ width: `${20 + ((i + j) % 3) * 12}px` }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div
                    className="h-[3px] rounded-full bg-gray-100"
                    style={{ width: `${60 + (i % 3) * 15}%` }}
                  />
                  {i < 3 && (
                    <div
                      className="h-[3px] rounded-full bg-gray-50"
                      style={{ width: `${40 + (i % 2) * 20}%` }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverOverlay({ template }: { template: Template }) {
  return (
    <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-6">
      <p className="text-[11px] text-white/60 mb-1 text-center">
        Open template in
      </p>
      <OverlayButton
        label="Google Docs"
        icon={<GoogleDocsIcon />}
        href={`#google-docs-${template.id}`}
      />
      <OverlayButton
        label="Microsoft Word"
        icon={<WordIcon />}
        href={`#word-${template.id}`}
      />
      <OverlayButton
        label="Notion"
        icon={<NotionIcon />}
        href={`#notion-${template.id}`}
      />
    </div>
  );
}

function OverlayButton({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 w-full max-w-[200px] px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium transition-all duration-200 hover:translate-y-[-1px]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function DocIcon({ style }: { style: string }) {
  const colors: Record<string, string> = {
    brief: "#8E7DBE",
    summary: "#5A8F6B",
    checklist: "#C2703E",
    brainstorm: "#D4A843",
    runofshow: "#5A7FA8",
    playbook: "#8E7DBE",
  };
  const color = colors[style] || "#8E7DBE";

  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <path
        d="M0 2C0 0.9 0.9 0 2 0H10L16 6V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.1 0 18V2Z"
        fill={color}
        opacity="0.12"
      />
      <path
        d="M10 0L16 6H12C10.9 6 10 5.1 10 4V0Z"
        fill={color}
        opacity="0.24"
      />
      <rect x="3" y="9" width="7" height="1" rx="0.5" fill={color} opacity="0.5" />
      <rect x="3" y="12" width="10" height="1" rx="0.5" fill={color} opacity="0.3" />
      <rect x="3" y="15" width="5" height="1" rx="0.5" fill={color} opacity="0.3" />
    </svg>
  );
}

function GoogleDocsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        fill="#4285F4"
        opacity="0.9"
      />
      <path d="M14 2L20 8H14V2Z" fill="#A1C2FA" />
      <rect x="7" y="11" width="10" height="1" rx="0.5" fill="white" opacity="0.8" />
      <rect x="7" y="14" width="8" height="1" rx="0.5" fill="white" opacity="0.6" />
      <rect x="7" y="17" width="6" height="1" rx="0.5" fill="white" opacity="0.4" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#2B579A" opacity="0.9" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        W
      </text>
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M4 4.5C4 3.12 5.12 2 6.5 2H14L20 8V19.5C20 20.88 18.88 22 17.5 22H6.5C5.12 22 4 20.88 4 19.5V4.5Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />
      <path
        d="M7 6H11.5L7 11V6Z"
        fill="currentColor"
        opacity="0.8"
      />
      <rect x="7" y="13" width="10" height="1" rx="0.5" fill="currentColor" opacity="0.25" />
      <rect x="7" y="16" width="7" height="1" rx="0.5" fill="currentColor" opacity="0.15" />
    </svg>
  );
}
