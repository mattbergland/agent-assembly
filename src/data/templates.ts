export interface Template {
  id: string;
  title: string;
  caption: string;
  tags: string[];
  preview: TemplatePreview;
}

export interface TemplatePreview {
  heading: string;
  sections: string[];
  style: "brief" | "summary" | "checklist" | "brainstorm" | "runofshow" | "playbook";
}

export const templates: Template[] = [
  {
    id: "event-brief",
    title: "Event Brief",
    caption:
      "A structured one-pager to align stakeholders on event goals, audience, logistics, and success metrics before planning kicks off.",
    tags: ["Planning", "Strategy", "Pre-Event"],
    preview: {
      heading: "Event Brief",
      sections: [
        "Event Overview",
        "Objectives & KPIs",
        "Target Audience",
        "Budget Summary",
        "Key Stakeholders",
        "Timeline & Milestones",
      ],
      style: "brief",
    },
  },
  {
    id: "executive-summary",
    title: "Executive Summary",
    caption:
      "A concise post-event report for leadership — covering attendance, key outcomes, pipeline impact, and strategic recommendations.",
    tags: ["Post-Event", "Reporting", "Executive"],
    preview: {
      heading: "Executive Summary",
      sections: [
        "Event Snapshot",
        "Attendance & Engagement",
        "Key Outcomes",
        "Pipeline Impact",
        "Budget vs. Actual",
        "Recommendations",
      ],
      style: "summary",
    },
  },
  {
    id: "event-learnings",
    title: "Event Learnings Doc",
    caption:
      "Capture what worked, what didn't, and actionable takeaways to improve future events. Built for honest team retrospectives.",
    tags: ["Post-Event", "Retrospective", "Team"],
    preview: {
      heading: "Event Learnings",
      sections: [
        "Event Context",
        "What Went Well",
        "What Didn't Work",
        "Surprises & Insights",
        "Action Items",
        "Carry Forward",
      ],
      style: "brief",
    },
  },
  {
    id: "event-brainstorm",
    title: "Event Brainstorm Doc",
    caption:
      "A freeform canvas for ideation — themes, formats, venue ideas, speaker wish lists, and creative activations all in one place.",
    tags: ["Ideation", "Creative", "Pre-Event"],
    preview: {
      heading: "Event Brainstorm",
      sections: [
        "Theme Ideas",
        "Format & Structure",
        "Venue Options",
        "Speaker Wish List",
        "Activations & Moments",
        "Open Questions",
      ],
      style: "brainstorm",
    },
  },
  {
    id: "general-run-of-show",
    title: "General Event Run of Show",
    caption:
      "Minute-by-minute timeline covering setup through teardown. Assign owners, track cues, and keep every vendor on the same page.",
    tags: ["Execution", "Day-Of", "Operations"],
    preview: {
      heading: "Run of Show",
      sections: [
        "Pre-Event Setup",
        "Doors Open & Registration",
        "Opening Remarks",
        "Main Program",
        "Networking & Breaks",
        "Wrap & Teardown",
      ],
      style: "runofshow",
    },
  },
  {
    id: "executive-dinner-ros",
    title: "Executive Dinner Run of Show",
    caption:
      "A refined timeline for intimate executive gatherings — from arrival cocktails to discussion facilitation to after-dinner wrap.",
    tags: ["Executive", "Day-Of", "Intimate"],
    preview: {
      heading: "Executive Dinner ROS",
      sections: [
        "Arrival & Cocktails",
        "Seating & Introductions",
        "First Course & Icebreaker",
        "Main Course & Discussion",
        "Dessert & Key Takeaways",
        "Close & Follow-Up",
      ],
      style: "runofshow",
    },
  },
  {
    id: "executive-retreat-playbook",
    title: "Executive Retreat Playbook",
    caption:
      "End-to-end guide for multi-day executive retreats — covering pre-work, session design, facilitation notes, and post-retreat actions.",
    tags: ["Executive", "Multi-Day", "Playbook"],
    preview: {
      heading: "Executive Retreat Playbook",
      sections: [
        "Retreat Objectives",
        "Pre-Work & Preparation",
        "Day 1 Agenda",
        "Day 2 Agenda",
        "Facilitation Guide",
        "Post-Retreat Actions",
      ],
      style: "playbook",
    },
  },
  {
    id: "venue-walkthrough",
    title: "Venue Walkthrough Checklist",
    caption:
      "A systematic checklist for site visits — evaluate capacity, AV, catering, accessibility, and capture photos with notes for comparison.",
    tags: ["Venue", "Pre-Event", "Checklist"],
    preview: {
      heading: "Venue Walkthrough",
      sections: [
        "Venue Overview",
        "Capacity & Layout",
        "AV & Technology",
        "Catering & F&B",
        "Accessibility & Parking",
        "Photo Documentation",
      ],
      style: "checklist",
    },
  },
];
