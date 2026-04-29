import { useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { SavedEvent } from '../utils/storage'
import { calculateROI } from '../types'
import type { ROIMetrics } from '../types'
import { EVENT_TYPES } from '../types'

function getTypeLabel(type: string) {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}

function fmtDollar(n: number) {
  if (n === 0 || !isFinite(n)) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function fmtPercent(n: number) {
  if (n === 0 || !isFinite(n)) return '—'
  return `${n.toFixed(1)}%`
}

function fmtRatio(n: number) {
  if (n === 0 || !isFinite(n)) return '—'
  return `${n.toFixed(1)}x`
}

interface CompareViewProps {
  savedEvents: SavedEvent[]
  onBack: () => void
}

type MetricDef = {
  label: string
  key: keyof ROIMetrics
  format: (n: number) => string
}

const COMPARE_METRICS: MetricDef[] = [
  { label: 'Total Investment', key: 'totalCost', format: fmtDollar },
  { label: 'Revenue ROI', key: 'revenueROI', format: fmtPercent },
  { label: 'Pipeline ROI', key: 'pipelineROI', format: fmtPercent },
  { label: 'Pipeline : Spend', key: 'pipelineToSpendRatio', format: fmtRatio },
  { label: 'Cost per Lead', key: 'costPerLead', format: fmtDollar },
  { label: 'Cost per MQL', key: 'costPerMQL', format: fmtDollar },
  { label: 'Cost per SQL', key: 'costPerSQL', format: fmtDollar },
  { label: 'Cost per Opportunity', key: 'costPerOpportunity', format: fmtDollar },
  { label: 'Cost per Meeting', key: 'costPerMeeting', format: fmtDollar },
  { label: 'Revenue per Attendee', key: 'revenuePerAttendee', format: fmtDollar },
  { label: 'Avg Deal Size', key: 'avgDealSize', format: fmtDollar },
  { label: 'Lead → MQL', key: 'conversionLeadToMQL', format: fmtPercent },
  { label: 'MQL → SQL', key: 'conversionMQLToSQL', format: fmtPercent },
  { label: 'SQL → Opp', key: 'conversionSQLToOpp', format: fmtPercent },
  { label: 'Opp → Deal', key: 'conversionOppToDeal', format: fmtPercent },
]

function bestValue(key: keyof ROIMetrics, values: number[]): number | null {
  const nonZero = values.filter((v) => v !== 0 && isFinite(v))
  if (nonZero.length < 2) return null

  const costMetrics: (keyof ROIMetrics)[] = ['costPerLead', 'costPerMQL', 'costPerSQL', 'costPerOpportunity', 'costPerMeeting', 'totalCost']
  if (costMetrics.includes(key)) return Math.min(...nonZero)
  return Math.max(...nonZero)
}

export default function CompareView({ savedEvents, onBack }: CompareViewProps) {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const ids = new Set<string>()
    savedEvents.slice(0, 4).forEach((e) => ids.add(e.id))
    return ids
  })

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedEvents = useMemo(
    () => savedEvents.filter((e) => selected.has(e.id)),
    [savedEvents, selected]
  )

  const metricsMap = useMemo(() => {
    const map = new Map<string, ROIMetrics>()
    selectedEvents.forEach((e) => map.set(e.id, calculateROI(e.inputs)))
    return map
  }, [selectedEvents])

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-ink-muted hover:text-lavender transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-2xl font-medium tracking-tight leading-tight text-ink">
          Compare Events
        </h2>
      </div>

      {/* Event selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {savedEvents.map((ev) => (
          <button
            key={ev.id}
            onClick={() => toggle(ev.id)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              selected.has(ev.id)
                ? 'border-lavender bg-lavender/10 text-lavender'
                : 'border-rule/20 text-ink-muted hover:border-rule/40'
            }`}
          >
            {ev.inputs.eventName || 'Untitled'}
          </button>
        ))}
      </div>

      {selectedEvents.length < 2 ? (
        <p className="text-sm text-ink-muted/50 italic">Select at least 2 events to compare.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule/20">
                <th className="text-left py-3 pr-4 text-[11px] uppercase tracking-[0.12em] text-ink-muted font-medium w-44">
                  Metric
                </th>
                {selectedEvents.map((ev) => (
                  <th key={ev.id} className="text-right py-3 px-3 text-[11px] uppercase tracking-[0.12em] text-ink-muted font-medium min-w-[100px]">
                    <div className="truncate max-w-[120px] ml-auto">
                      {ev.inputs.eventName || 'Untitled'}
                    </div>
                    <div className="text-[10px] font-normal normal-case tracking-normal mt-0.5 opacity-60">
                      {getTypeLabel(ev.inputs.eventType)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Input rows */}
              <tr className="border-b border-rule/10">
                <td className="py-2.5 pr-4 text-ink-muted">Leads Collected</td>
                {selectedEvents.map((ev) => (
                  <td key={ev.id} className="py-2.5 px-3 text-right tabular-nums text-ink">
                    {ev.inputs.leadsCollected > 0 ? ev.inputs.leadsCollected.toLocaleString() : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-rule/10">
                <td className="py-2.5 pr-4 text-ink-muted">Pipeline Generated</td>
                {selectedEvents.map((ev) => (
                  <td key={ev.id} className="py-2.5 px-3 text-right tabular-nums text-ink">
                    {fmtDollar(ev.inputs.pipelineGenerated)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-rule/10">
                <td className="py-2.5 pr-4 text-ink-muted">Revenue Won</td>
                {selectedEvents.map((ev) => (
                  <td key={ev.id} className="py-2.5 px-3 text-right tabular-nums text-ink">
                    {fmtDollar(ev.inputs.revenueWon)}
                  </td>
                ))}
              </tr>

              {/* Divider */}
              <tr>
                <td colSpan={selectedEvents.length + 1} className="pt-4 pb-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted/60 font-medium">
                    Calculated Metrics
                  </div>
                </td>
              </tr>

              {COMPARE_METRICS.map((m) => {
                const values = selectedEvents.map((ev) => metricsMap.get(ev.id)?.[m.key] ?? 0)
                const best = bestValue(m.key, values)
                return (
                  <tr key={m.key} className="border-b border-rule/10">
                    <td className="py-2.5 pr-4 text-ink-muted">{m.label}</td>
                    {selectedEvents.map((ev, i) => {
                      const val = values[i]
                      const isBest = best !== null && val === best && val !== 0 && isFinite(val)
                      return (
                        <td
                          key={ev.id}
                          className={`py-2.5 px-3 text-right tabular-nums ${
                            isBest ? 'text-lavender font-semibold' : 'text-ink'
                          }`}
                        >
                          {m.format(val)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
