import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import type { EventInputs, ROIMetrics } from '../types'
import { EVENT_TYPES } from '../types'

function fmt(n: number, prefix = '', suffix = '', decimals = 0): string {
  if (n === 0 || !isFinite(n)) return '—'
  return `${prefix}${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
}

function fmtDollar(n: number): string {
  return fmt(n, '$')
}

function fmtPercent(n: number): string {
  return fmt(n, '', '%', 1)
}

function fmtRatio(n: number): string {
  if (n === 0 || !isFinite(n)) return '—'
  return `${n.toFixed(1)}x`
}

function getEventTypeLabel(type: string): string {
  return EVENT_TYPES.find(e => e.value === type)?.label ?? type
}

export function exportToExcel(inputs: EventInputs, metrics: ROIMetrics) {
  const wb = XLSX.utils.book_new()

  const summaryData = [
    ['Event ROI Report'],
    [''],
    ['Event Details'],
    ['Event Name', inputs.eventName || 'Untitled Event'],
    ['Event Type', getEventTypeLabel(inputs.eventType)],
    [''],
    ['Cost Breakdown'],
    ['Sponsorship / Booth Fee', metrics.totalCost > 0 ? inputs.sponsorship : 0],
    ['Booth Build & Design', inputs.boothBuild],
    ['Travel & Lodging', inputs.travel],
    ['Swag & Collateral', inputs.swag],
    ['Staffing', inputs.staffing],
    ['Food & Beverage', inputs.foodBev],
    ['Other Costs', inputs.otherCosts],
    ['Total Investment', metrics.totalCost],
    [''],
    ['Funnel Metrics'],
    ['Total Attendees', inputs.totalAttendees],
    ['Booth Visitors', inputs.boothVisitors],
    ['Meetings Taken', inputs.meetingsTaken],
    ['Leads Collected', inputs.leadsCollected],
    ['MQLs', inputs.mqls],
    ['SQLs', inputs.sqls],
    ['Opportunities', inputs.opportunities],
    ['Pipeline Generated', inputs.pipelineGenerated],
    ['Deals Closed', inputs.dealsClosed],
    ['Revenue Won', inputs.revenueWon],
    [''],
    ['ROI Analysis'],
    ['Revenue ROI', `${fmtPercent(metrics.revenueROI)}`],
    ['Pipeline ROI', `${fmtPercent(metrics.pipelineROI)}`],
    ['Pipeline : Spend Ratio', fmtRatio(metrics.pipelineToSpendRatio)],
    ['Cost per Lead', fmtDollar(metrics.costPerLead)],
    ['Cost per MQL', fmtDollar(metrics.costPerMQL)],
    ['Cost per SQL', fmtDollar(metrics.costPerSQL)],
    ['Cost per Opportunity', fmtDollar(metrics.costPerOpportunity)],
    ['Cost per Meeting', fmtDollar(metrics.costPerMeeting)],
    ['Revenue per Attendee', fmtDollar(metrics.revenuePerAttendee)],
    ['Avg Deal Size', fmtDollar(metrics.avgDealSize)],
    [''],
    ['Conversion Rates'],
    ['Lead → MQL', fmtPercent(metrics.conversionLeadToMQL)],
    ['MQL → SQL', fmtPercent(metrics.conversionMQLToSQL)],
    ['SQL → Opportunity', fmtPercent(metrics.conversionSQLToOpp)],
    ['Opportunity → Deal', fmtPercent(metrics.conversionOppToDeal)],
  ]

  const ws = XLSX.utils.aoa_to_sheet(summaryData)

  ws['!cols'] = [{ wch: 28 }, { wch: 20 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Event ROI')

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buf], { type: 'application/octet-stream' })
  saveAs(blob, `${inputs.eventName || 'event'}-roi-report.xlsx`)
}

function makeBorder() {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  }
}

function makeTableRow(label: string, value: string, bold = false): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        borders: makeBorder(),
        width: { size: 60, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold, size: 20, font: 'Inter' })],
          }),
        ],
      }),
      new TableCell({
        borders: makeBorder(),
        width: { size: 40, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: value, bold, size: 20, font: 'Inter' })],
          }),
        ],
      }),
    ],
  })
}

export async function exportToWord(inputs: EventInputs, metrics: ROIMetrics) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: 'Event ROI Report',
                bold: true,
                size: 36,
                font: 'Inter',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${inputs.eventName || 'Untitled Event'} — ${getEventTypeLabel(inputs.eventType)}`,
                size: 22,
                font: 'Inter',
                color: '5A5A58',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
            children: [new TextRun({ text: 'Cost Breakdown', bold: true, size: 26, font: 'Inter' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTableRow('Sponsorship / Booth Fee', fmtDollar(inputs.sponsorship)),
              makeTableRow('Booth Build & Design', fmtDollar(inputs.boothBuild)),
              makeTableRow('Travel & Lodging', fmtDollar(inputs.travel)),
              makeTableRow('Swag & Collateral', fmtDollar(inputs.swag)),
              makeTableRow('Staffing', fmtDollar(inputs.staffing)),
              makeTableRow('Food & Beverage', fmtDollar(inputs.foodBev)),
              makeTableRow('Other Costs', fmtDollar(inputs.otherCosts)),
              makeTableRow('Total Investment', fmtDollar(metrics.totalCost), true),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
            children: [new TextRun({ text: 'Funnel Metrics', bold: true, size: 26, font: 'Inter' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTableRow('Total Attendees', inputs.totalAttendees.toLocaleString()),
              makeTableRow('Booth Visitors', inputs.boothVisitors.toLocaleString()),
              makeTableRow('Meetings Taken', inputs.meetingsTaken.toLocaleString()),
              makeTableRow('Leads Collected', inputs.leadsCollected.toLocaleString()),
              makeTableRow('MQLs', inputs.mqls.toLocaleString()),
              makeTableRow('SQLs', inputs.sqls.toLocaleString()),
              makeTableRow('Opportunities', inputs.opportunities.toLocaleString()),
              makeTableRow('Pipeline Generated', fmtDollar(inputs.pipelineGenerated)),
              makeTableRow('Deals Closed', inputs.dealsClosed.toLocaleString()),
              makeTableRow('Revenue Won', fmtDollar(inputs.revenueWon)),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
            children: [new TextRun({ text: 'ROI Analysis', bold: true, size: 26, font: 'Inter' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTableRow('Revenue ROI', fmtPercent(metrics.revenueROI), true),
              makeTableRow('Pipeline ROI', fmtPercent(metrics.pipelineROI), true),
              makeTableRow('Pipeline : Spend Ratio', fmtRatio(metrics.pipelineToSpendRatio)),
              makeTableRow('Cost per Lead', fmtDollar(metrics.costPerLead)),
              makeTableRow('Cost per MQL', fmtDollar(metrics.costPerMQL)),
              makeTableRow('Cost per SQL', fmtDollar(metrics.costPerSQL)),
              makeTableRow('Cost per Opportunity', fmtDollar(metrics.costPerOpportunity)),
              makeTableRow('Cost per Meeting', fmtDollar(metrics.costPerMeeting)),
              makeTableRow('Revenue per Attendee', fmtDollar(metrics.revenuePerAttendee)),
              makeTableRow('Avg Deal Size', fmtDollar(metrics.avgDealSize)),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
            children: [new TextRun({ text: 'Conversion Rates', bold: true, size: 26, font: 'Inter' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTableRow('Lead → MQL', fmtPercent(metrics.conversionLeadToMQL)),
              makeTableRow('MQL → SQL', fmtPercent(metrics.conversionMQLToSQL)),
              makeTableRow('SQL → Opportunity', fmtPercent(metrics.conversionSQLToOpp)),
              makeTableRow('Opportunity → Deal', fmtPercent(metrics.conversionOppToDeal)),
            ],
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${inputs.eventName || 'event'}-roi-report.docx`)
}

export function exportToNotion(inputs: EventInputs, metrics: ROIMetrics): string {
  const lines: string[] = []
  lines.push(`# Event ROI Report`)
  lines.push('')
  lines.push(`**Event:** ${inputs.eventName || 'Untitled Event'}`)
  lines.push(`**Type:** ${getEventTypeLabel(inputs.eventType)}`)
  lines.push('')
  lines.push(`## Cost Breakdown`)
  lines.push('')
  lines.push(`| Category | Amount |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Sponsorship / Booth Fee | ${fmtDollar(inputs.sponsorship)} |`)
  lines.push(`| Booth Build & Design | ${fmtDollar(inputs.boothBuild)} |`)
  lines.push(`| Travel & Lodging | ${fmtDollar(inputs.travel)} |`)
  lines.push(`| Swag & Collateral | ${fmtDollar(inputs.swag)} |`)
  lines.push(`| Staffing | ${fmtDollar(inputs.staffing)} |`)
  lines.push(`| Food & Beverage | ${fmtDollar(inputs.foodBev)} |`)
  lines.push(`| Other Costs | ${fmtDollar(inputs.otherCosts)} |`)
  lines.push(`| **Total Investment** | **${fmtDollar(metrics.totalCost)}** |`)
  lines.push('')
  lines.push(`## Funnel Metrics`)
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Total Attendees | ${inputs.totalAttendees.toLocaleString()} |`)
  lines.push(`| Booth Visitors | ${inputs.boothVisitors.toLocaleString()} |`)
  lines.push(`| Meetings Taken | ${inputs.meetingsTaken.toLocaleString()} |`)
  lines.push(`| Leads Collected | ${inputs.leadsCollected.toLocaleString()} |`)
  lines.push(`| MQLs | ${inputs.mqls.toLocaleString()} |`)
  lines.push(`| SQLs | ${inputs.sqls.toLocaleString()} |`)
  lines.push(`| Opportunities | ${inputs.opportunities.toLocaleString()} |`)
  lines.push(`| Pipeline Generated | ${fmtDollar(inputs.pipelineGenerated)} |`)
  lines.push(`| Deals Closed | ${inputs.dealsClosed.toLocaleString()} |`)
  lines.push(`| Revenue Won | ${fmtDollar(inputs.revenueWon)} |`)
  lines.push('')
  lines.push(`## ROI Analysis`)
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Revenue ROI | ${fmtPercent(metrics.revenueROI)} |`)
  lines.push(`| Pipeline ROI | ${fmtPercent(metrics.pipelineROI)} |`)
  lines.push(`| Pipeline : Spend | ${fmtRatio(metrics.pipelineToSpendRatio)} |`)
  lines.push(`| Cost per Lead | ${fmtDollar(metrics.costPerLead)} |`)
  lines.push(`| Cost per MQL | ${fmtDollar(metrics.costPerMQL)} |`)
  lines.push(`| Cost per SQL | ${fmtDollar(metrics.costPerSQL)} |`)
  lines.push(`| Cost per Opportunity | ${fmtDollar(metrics.costPerOpportunity)} |`)
  lines.push(`| Cost per Meeting | ${fmtDollar(metrics.costPerMeeting)} |`)
  lines.push(`| Revenue per Attendee | ${fmtDollar(metrics.revenuePerAttendee)} |`)
  lines.push(`| Avg Deal Size | ${fmtDollar(metrics.avgDealSize)} |`)
  lines.push('')
  lines.push(`## Conversion Rates`)
  lines.push('')
  lines.push(`| Stage | Rate |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Lead → MQL | ${fmtPercent(metrics.conversionLeadToMQL)} |`)
  lines.push(`| MQL → SQL | ${fmtPercent(metrics.conversionMQLToSQL)} |`)
  lines.push(`| SQL → Opportunity | ${fmtPercent(metrics.conversionSQLToOpp)} |`)
  lines.push(`| Opportunity → Deal | ${fmtPercent(metrics.conversionOppToDeal)} |`)

  return lines.join('\n')
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
