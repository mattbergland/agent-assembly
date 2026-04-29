"use client";

interface TagSelectorProps {
  available: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({
  available,
  selected,
  onChange,
}: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {available.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                isActive
                  ? "bg-lavender text-paper"
                  : "bg-ink/5 text-ink-muted border border-rule/10 hover:bg-ink/10 hover:text-ink-soft"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
