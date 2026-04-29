export interface CheckIn {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  photoUrl: string; // base64 data URL
  description: string;
  tags: string[];
  timestamp: number;
}

export interface EventConfig {
  eventName: string;
  organizerQuestion: string;
  availableTags: string[];
  autoResetSeconds: number;
  badgeSize: "standard" | "small";
}

export const DEFAULT_EVENT_CONFIG: EventConfig = {
  eventName: "Welcome",
  organizerQuestion:
    "What are you most excited to learn or connect about today?",
  availableTags: [
    "Developer",
    "Designer",
    "Product",
    "Marketing",
    "Sales",
    "Executive",
    "Founder",
    "Investor",
    "Student",
    "Community",
  ],
  autoResetSeconds: 15,
  badgeSize: "standard",
};
