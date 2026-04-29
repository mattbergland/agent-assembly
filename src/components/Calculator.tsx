import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  DollarSign,
  Users,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  BarChart3,
  Target,
  ArrowRight,
  Save,
} from 'lucide-react'
import type { EventInputs } from '../types'
import { EVENT_TYPES, getDefaultInputs, calculateROI } from '../types'
import { exportToExcel, exportToWord, exportToNotion, copyToClipboard } from '../utils/export'
import { saveEvent, loadAllEvents } from '../utils/storage'
import Tooltip from './Tooltip'

function CurrencyInput({
  label,
  value,
  onChange,
  tip,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  tip?: string
}) {
  return (
    <div>
      <label className="input-label">{label}{tip && <Tooltip text={tip} />}</label>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted text-sm">$</span>
        <input
          type="text"
          inputMode="numeric"
          className="input-field pl-3"
          value={value === 0 ? '' : value.toLocaleString('en-US')}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '')
            onChange(raw ? parseInt(raw, 10) : 0)
          }}
          placeholder="0"
        />
      </div>
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  tip,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  tip?: string
}) {
  return (
    <div>
      <label className="input-label">{label}{tip && <Tooltip text={tip} />}</label>
      <input
        type="text"
        inputMode="numeric"
        className="input-field"
        value={value === 0 ? '' : value.toLocaleString('en-US')}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, '')
          onChange(raw ? parseInt(raw, 10) : 0)
        }}
        placeholder="0"
      />
    </div>
  )
}

function MetricRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-rule/10">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${muted ? 'text-ink-muted/50' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

function FunnelBar({
  label,
  value,
  maxValue,
  rate,
}: {
  label: string
  value: number
  maxValue: number
  rate?: string
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-ink-muted font-medium">{label}</span>
        <span className="text-xs text-ink-soft font-medium tabular-nums">
          {value > 0 ? value.toLocaleString() : '—'}{rate && rate !== '—' ? ` (${rate})` : ''}
        </span>
      </div>
      <div className="h-1.5 bg-rule/10 overflow-hidden">
        <div
          className="h-full bg-lavender/70 transition-all duration-500"
          style={{ width: `${Math.max(pct, value > 0 ? 1 : 0)}%` }}
        />
      </div>
    </div>
  )
}

interface CalculatorProps {
  activeEventId: string | null
  onSaved: (id: string) => void
}

export default function Calculator({ activeEventId, onSaved }: CalculatorProps) {
  const [inputs, setInputs] = useState<EventInputs>(getDefaultInputs())
  const [copied, setCopied] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
  const [dirty, setDirty] = useState(false)

  // Load event when activeEventId changes
  useEffect(() => {
    if (activeEventId) {
      const all = loadAllEvents()
      const found = all.find((e) => e.id === activeEventId)
      if (found) {
        setInputs(found.inputs)
        setDirty(false)
        return
      }
    }
    setInputs(getDefaultInputs())
    setDirty(false)
  }, [activeEventId])

  const metrics = useMemo(() => calculateROI(inputs), [inputs])

  const update = useCallback(
    <K extends keyof EventInputs>(key: K, value: EventInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }))
      setDirty(true)
    },
    []
  )

  const handleSave = useCallback(() => {
    const saved = saveEvent(inputs, activeEventId ?? undefined)
    onSaved(saved.id)
    setSaveStatus('saved')
    setDirty(false)
    setTimeout(() => setSaveStatus('idle'), 1500)
  }, [inputs, activeEventId, onSaved])

  const fmtDollar = (n: number) => {
    if (n === 0 || !isFinite(n)) return '—'
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`
    return `$${Math.round(n).toLocaleString()}`
  }

  const fmtPercent = (n: number) => {
    if (n === 0 || !isFinite(n)) return '—'
    return `${n.toFixed(1)}%`
  }

  const fmtRatio = (n: number) => {
    if (n === 0 || !isFinite(n)) return '—'
    return `${n.toFixed(1)}x`
  }

  const handleCopyNotion = async () => {
    const md = exportToNotion(inputs, metrics)
    await copyToClipboard(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setExportMenuOpen(false)
  }

  const hasAnyData = metrics.totalCost > 0 || inputs.leadsCollected > 0 || inputs.totalAttendees > 0
  const hasFunnelData = inputs.leadsCollected > 0 || inputs.mqls > 0 || inputs.sqls > 0 || inputs.opportunities > 0 || inputs.dealsClosed > 0

  const maxFunnel = Math.max(
    inputs.leadsCollected,
    inputs.mqls,
    inputs.sqls,
    inputs.opportunities,
    inputs.dealsClosed,
    1
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight leading-tight text-ink mb-1">
            Event ROI Calculator
          </h2>
          <p className="text-ink-muted leading-relaxed text-sm">
            Results update as you type. Fill in what you know — skip what you don't.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Save button */}
          <button
            className={`btn-secondary text-xs ${dirty ? 'border-lavender text-lavender' : ''}`}
            onClick={handleSave}
          >
            {saveStatus === 'saved' ? (
              <><Check size={14} /> Saved</>
            ) : (
              <><Save size={14} /> {activeEventId ? 'Update' : 'Save'}</>
            )}
          </button>
          {/* Export */}
          {hasAnyData && (
            <div className="relative">
              <button
                className="btn-primary text-xs"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
              >
                <Download size={14} />
                Export
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-paper border border-rule/20 shadow-lg z-50 min-w-[180px]">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
                    onClick={() => {
                      exportToExcel(inputs, metrics)
                      setExportMenuOpen(false)
                    }}
                  >
                    <FileSpreadsheet size={14} className="text-ink-muted" />
                    Excel / Google Sheets
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
                    onClick={() => {
                      exportToWord(inputs, metrics)
                      setExportMenuOpen(false)
                    }}
                  >
                    <FileText size={14} className="text-ink-muted" />
                    Word / Google Docs
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
                    onClick={handleCopyNotion}
                  >
                    {copied ? (
                      <Check size={14} className="text-lavender" />
                    ) : (
                      <Copy size={14} className="text-ink-muted" />
                    )}
                    {copied ? 'Copied!' : 'Copy for Notion'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <Target size={14} className="text-lavender" />
          </div>
          <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
            Event Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-8">
          <div>
            <label className="input-label">Event Name<Tooltip text="The name of the event you're measuring. This will appear on your exported reports." /></label>
            <input
              type="text"
              className="input-field"
              value={inputs.eventName}
              onChange={(e) => update('eventName', e.target.value)}
              placeholder="e.g. SaaStr Annual 2025"
            />
          </div>
          <div>
            <label className="input-label">Event Type<Tooltip text="The format of your event. Helps contextualize your ROI benchmarks — dinners and roundtables typically have higher cost-per-lead but better conversion rates." /></label>
            <select
              className="input-field appearance-none cursor-pointer"
              value={inputs.eventType}
              onChange={(e) => update('eventType', e.target.value as EventInputs['eventType'])}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <DollarSign size={14} className="text-lavender" />
          </div>
          <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
            Investment
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 pl-8">
          <CurrencyInput label="Sponsorship / Booth" value={inputs.sponsorship} onChange={(v) => update('sponsorship', v)} tip="Your sponsorship package cost, booth rental fee, or exhibition space fee." />
          <CurrencyInput label="Booth Build" value={inputs.boothBuild} onChange={(v) => update('boothBuild', v)} tip="Booth design, construction, signage, AV equipment, monitors, furniture, and teardown costs." />
          <CurrencyInput label="Travel & Lodging" value={inputs.travel} onChange={(v) => update('travel', v)} tip="Flights, hotels, ground transportation, and per diem for all team members attending." />
          <CurrencyInput label="Swag & Collateral" value={inputs.swag} onChange={(v) => update('swag', v)} tip="Branded merchandise, printed materials, demo kits, and giveaway items." />
          <CurrencyInput label="Staffing" value={inputs.staffing} onChange={(v) => update('staffing', v)} tip="Cost of staff time, including external contractors, booth staff, or brand ambassadors." />
          <CurrencyInput label="Food & Beverage" value={inputs.foodBev} onChange={(v) => update('foodBev', v)} tip="Hosted dinners, happy hours, booth catering, coffee bars, or client entertainment." />
          <CurrencyInput label="Other Costs" value={inputs.otherCosts} onChange={(v) => update('otherCosts', v)} tip="Shipping, insurance, lead retrieval scanners, Wi-Fi fees, or any miscellaneous expenses." />
          <div className="flex items-end">
            <div>
              <div className="stat-label mb-1">Total Investment</div>
              <div className="text-lg font-semibold tracking-tight text-ink tabular-nums">
                {fmtDollar(metrics.totalCost)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <Users size={14} className="text-lavender" />
          </div>
          <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
            Engagement
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 pl-8">
          <NumberInput label="Total Attendees" value={inputs.totalAttendees} onChange={(v) => update('totalAttendees', v)} tip="Total event attendance — helps calculate your share of voice and revenue per attendee." />
          <NumberInput label="Booth Visitors" value={inputs.boothVisitors} onChange={(v) => update('boothVisitors', v)} tip="People who stopped at your booth or activation. Usually tracked via badge scans or manual count." />
          <NumberInput label="Meetings Taken" value={inputs.meetingsTaken} onChange={(v) => update('meetingsTaken', v)} tip="Scheduled 1:1 meetings, demos, or meaningful conversations with prospects at the event." />
          <NumberInput label="Leads Collected" value={inputs.leadsCollected} onChange={(v) => update('leadsCollected', v)} tip="Total new contacts captured — badge scans, business cards, form fills, or QR code scans." />
        </div>
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <TrendingUp size={14} className="text-lavender" />
          </div>
          <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
            Pipeline & Revenue
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 pl-8">
          <NumberInput label="MQLs" value={inputs.mqls} onChange={(v) => update('mqls', v)} tip="Marketing Qualified Leads — leads that meet your ICP criteria and are ready for sales outreach." />
          <NumberInput label="SQLs" value={inputs.sqls} onChange={(v) => update('sqls', v)} tip="Sales Qualified Leads — MQLs that sales has accepted and is actively pursuing." />
          <NumberInput label="Opportunities" value={inputs.opportunities} onChange={(v) => update('opportunities', v)} tip="SQLs that have entered your sales pipeline with a defined deal stage and expected close date." />
          <CurrencyInput label="Pipeline Generated" value={inputs.pipelineGenerated} onChange={(v) => update('pipelineGenerated', v)} tip="Total dollar value of all opportunities sourced or influenced by this event." />
          <NumberInput label="Deals Closed" value={inputs.dealsClosed} onChange={(v) => update('dealsClosed', v)} tip="Number of opportunities that converted to closed-won deals attributable to this event." />
          <CurrencyInput label="Revenue Won" value={inputs.revenueWon} onChange={(v) => update('revenueWon', v)} tip="Total closed-won revenue (ACV or TCV) from deals sourced or influenced by this event." />
        </div>
      </div>

      {/* Live Results */}
      {hasAnyData && (
        <div className="border-t border-rule/10 pt-8 mt-4 animate-in fade-in-0 duration-300">
          {/* Hero Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-rule/10">
            <div className="py-3 border-l-2 border-lavender pl-4">
              <div className="stat-label mb-1">Revenue ROI</div>
              <div className="stat-value text-lavender">{fmtPercent(metrics.revenueROI)}</div>
            </div>
            <div className="py-3 border-l-2 border-lavender pl-4">
              <div className="stat-label mb-1">Pipeline : Spend</div>
              <div className="stat-value text-lavender">{fmtRatio(metrics.pipelineToSpendRatio)}</div>
            </div>
            <div className="py-3">
              <div className="stat-label mb-1">Cost per Lead</div>
              <div className="stat-value">{fmtDollar(metrics.costPerLead)}</div>
            </div>
            <div className="py-3">
              <div className="stat-label mb-1">Cost per SQL</div>
              <div className="stat-value">{fmtDollar(metrics.costPerSQL)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Funnel */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={14} className="text-lavender" />
                <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
                  Conversion Funnel
                </h3>
              </div>
              {hasFunnelData ? (
                <div>
                  <FunnelBar label="Leads" value={inputs.leadsCollected} maxValue={maxFunnel} />
                  <FunnelBar label="MQLs" value={inputs.mqls} maxValue={maxFunnel} rate={fmtPercent(metrics.conversionLeadToMQL)} />
                  <FunnelBar label="SQLs" value={inputs.sqls} maxValue={maxFunnel} rate={fmtPercent(metrics.conversionMQLToSQL)} />
                  <FunnelBar label="Opportunities" value={inputs.opportunities} maxValue={maxFunnel} rate={fmtPercent(metrics.conversionSQLToOpp)} />
                  <FunnelBar label="Deals Closed" value={inputs.dealsClosed} maxValue={maxFunnel} rate={fmtPercent(metrics.conversionOppToDeal)} />
                </div>
              ) : (
                <p className="text-sm text-ink-muted/50 italic">Add lead or pipeline data to see your funnel.</p>
              )}
            </div>

            {/* Efficiency Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight size={14} className="text-lavender" />
                <h3 className="text-xs uppercase tracking-[0.12em] text-ink-muted font-medium">
                  Efficiency Metrics
                </h3>
              </div>
              <div className="space-y-0">
                <MetricRow label="Pipeline ROI" value={fmtPercent(metrics.pipelineROI)} muted={metrics.pipelineROI === 0} />
                <MetricRow label="Cost per MQL" value={fmtDollar(metrics.costPerMQL)} muted={metrics.costPerMQL === 0} />
                <MetricRow label="Cost per Opportunity" value={fmtDollar(metrics.costPerOpportunity)} muted={metrics.costPerOpportunity === 0} />
                <MetricRow label="Cost per Meeting" value={fmtDollar(metrics.costPerMeeting)} muted={metrics.costPerMeeting === 0} />
                <MetricRow label="Revenue per Attendee" value={fmtDollar(metrics.revenuePerAttendee)} muted={metrics.revenuePerAttendee === 0} />
                <MetricRow label="Avg Deal Size" value={fmtDollar(metrics.avgDealSize)} muted={metrics.avgDealSize === 0} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
