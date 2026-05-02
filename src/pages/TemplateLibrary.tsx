import { useState } from "react";
import { ToolLayout, Footer } from "@/components/Layout";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import "../App.css";

const allTags = Array.from(new Set(templates.flatMap((t) => t.tags)));

export default function TemplateLibrary() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? templates.filter((t) => t.tags.includes(activeTag))
    : templates;

  return (
    <ToolLayout title="Template Library">
      <main className="flex-1 px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="pt-4 pb-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono text-lavender opacity-60">
                01
              </span>
              <span className="h-px w-4 bg-ink-muted/25" />
              <span className="text-xs text-ink-muted tracking-wide uppercase">
                Template Library
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              Templates for every stage of the event.
            </h1>
            <p className="text-sm md:text-base text-ink-muted mt-3 leading-relaxed">
              Ready-to-use documents for planning, execution, and retrospectives.
              Open directly in Google Docs, Word, or Notion.
            </p>
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 pb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full border transition-all duration-200 ${
                activeTag === null
                  ? "bg-ink text-paper border-ink"
                  : "bg-transparent text-ink-muted border-rule/15 hover:border-rule/30 hover:text-ink"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full border transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-ink text-paper border-ink"
                    : "bg-transparent text-ink-muted border-rule/15 hover:border-rule/30 hover:text-ink"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-ink-muted">
                No templates match this filter.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </ToolLayout>
  );
}
