export interface EventInputs {
  eventName: string
  eventType: EventType
  // Costs
  sponsorship: number
  boothBuild: number
  travel: number
  swag: number
  staffing: number
  foodBev: number
  otherCosts: number
  // Outcomes
  totalAttendees: number
  boothVisitors: number
  meetingsTaken: number
  leadsCollected: number
  mqls: number
  sqls: number
  opportunities: number
  pipelineGenerated: number
  dealsClosed: number
  revenueWon: number
}

export type EventType =
  | 'conference'
  | 'trade-show'
  | 'hosted-dinner'
  | 'field-event'
  | 'roadshow'
  | 'executive-roundtable'
  | 'webinar'
  | 'workshop'
  | 'other'

export interface ROIMetrics {
  totalCost: number
  costPerLead: number
  costPerMQL: number
  costPerSQL: number
  costPerOpportunity: number
  costPerMeeting: number
  pipelineToSpendRatio: number
  revenueROI: number
  pipelineROI: number
  revenuePerAttendee: number
  conversionLeadToMQL: number
  conversionMQLToSQL: number
  conversionSQLToOpp: number
  conversionOppToDeal: number
  avgDealSize: number
}

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'conference', label: 'Conference' },
  { value: 'trade-show', label: 'Trade Show' },
  { value: 'hosted-dinner', label: 'Hosted Dinner' },
  { value: 'field-event', label: 'Field Event' },
  { value: 'roadshow', label: 'Roadshow' },
  { value: 'executive-roundtable', label: 'Executive Roundtable' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'other', label: 'Other' },
]

export function getDefaultInputs(): EventInputs {
  return {
    eventName: '',
    eventType: 'conference',
    sponsorship: 0,
    boothBuild: 0,
    travel: 0,
    swag: 0,
    staffing: 0,
    foodBev: 0,
    otherCosts: 0,
    totalAttendees: 0,
    boothVisitors: 0,
    meetingsTaken: 0,
    leadsCollected: 0,
    mqls: 0,
    sqls: 0,
    opportunities: 0,
    pipelineGenerated: 0,
    dealsClosed: 0,
    revenueWon: 0,
  }
}

export function calculateROI(inputs: EventInputs): ROIMetrics {
  const totalCost =
    inputs.sponsorship +
    inputs.boothBuild +
    inputs.travel +
    inputs.swag +
    inputs.staffing +
    inputs.foodBev +
    inputs.otherCosts

  const safe = (n: number, d: number) => (d > 0 ? n / d : NaN)

  return {
    totalCost,
    costPerLead: safe(totalCost, inputs.leadsCollected),
    costPerMQL: safe(totalCost, inputs.mqls),
    costPerSQL: safe(totalCost, inputs.sqls),
    costPerOpportunity: safe(totalCost, inputs.opportunities),
    costPerMeeting: safe(totalCost, inputs.meetingsTaken),
    pipelineToSpendRatio: safe(inputs.pipelineGenerated, totalCost),
    revenueROI: totalCost > 0 ? ((inputs.revenueWon - totalCost) / totalCost) * 100 : NaN,
    pipelineROI: totalCost > 0 ? ((inputs.pipelineGenerated - totalCost) / totalCost) * 100 : NaN,
    revenuePerAttendee: safe(inputs.revenueWon, inputs.totalAttendees),
    conversionLeadToMQL: safe(inputs.mqls, inputs.leadsCollected) * 100,
    conversionMQLToSQL: safe(inputs.sqls, inputs.mqls) * 100,
    conversionSQLToOpp: safe(inputs.opportunities, inputs.sqls) * 100,
    conversionOppToDeal: safe(inputs.dealsClosed, inputs.opportunities) * 100,
    avgDealSize: safe(inputs.revenueWon, inputs.dealsClosed),
  }
}
