import type { RecipientTier } from '../types'

interface NotePreviewProps {
  note: string
  onChange: (note: string) => void
  tier: RecipientTier
}

const tierLabels: Record<RecipientTier, string> = {
  executives: 'Executive',
  ambassadors: 'Ambassador',
  'power-users': 'Power User',
  'event-attendees': 'Attendee',
}

const placeholders: Record<RecipientTier, string> = {
  executives: 'Thank you for your leadership and partnership...',
  ambassadors: 'Your advocacy means the world to our community...',
  'power-users': 'We appreciate you being such a dedicated user...',
  'event-attendees': 'Thanks for joining us! We hope you enjoyed the event...',
}

export function NotePreview({ note, onChange, tier }: NotePreviewProps) {
  return (
    <div>
      <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2 block">
        Included Note
      </label>
      <div className="rounded-lg border border-rule/10 bg-white overflow-hidden">
        {/* Note card mockup */}
        <div className="p-5 bg-gradient-to-br from-white to-ink/[0.02]">
          <div className="max-w-sm mx-auto">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md border border-ink/[0.06] p-6 space-y-3 relative">
              {/* Decorative corner */}
              <div className="absolute top-3 right-3">
                <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
                  <circle cx="5" cy="5" r="1.2" fill="#ddd" />
                  <circle cx="11" cy="5" r="1.2" fill="#ddd" />
                  <circle cx="17" cy="5" r="1.2" fill="#ddd" />
                  <circle cx="5" cy="11" r="1.2" fill="#ddd" />
                  <circle cx="11" cy="11" r="1.4" fill="#8E7DBE" />
                  <circle cx="17" cy="11" r="1.2" fill="#ddd" />
                  <circle cx="5" cy="17" r="1.2" fill="#ddd" />
                  <circle cx="11" cy="17" r="1.2" fill="#ddd" />
                  <circle cx="17" cy="17" r="1.2" fill="#ddd" />
                </svg>
              </div>

              <div className="text-[10px] font-medium text-lavender uppercase tracking-widest">
                {tierLabels[tier]} Gift
              </div>

              <textarea
                value={note}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholders[tier]}
                rows={4}
                className="w-full text-sm text-ink/80 leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-ink-muted/30 font-light italic"
              />

              <div className="pt-2 border-t border-ink/[0.06]">
                <p className="text-[10px] text-ink-muted/60 font-medium">Agent Assembly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
