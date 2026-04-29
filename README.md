# Agent Assembly — Event Check-In

iPad-optimized event check-in kiosk with live networking slides and badge printing.

## Features

- **Kiosk Check-In** — Camera capture, LinkedIn QR scan, voice input, tag selection
- **Live Slides** — Auto-rotating attendee presentation for event displays
- **Badge Printing** — Label printer–ready badge layouts (4"×3" or 3"×2")
- **Admin Panel** — Event settings, check-in management, print queue

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS with Agent Assembly design tokens
- localStorage persistence (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home / navigation |
| `/checkin` | Kiosk check-in flow |
| `/slides` | Live presentation view |
| `/admin` | Event settings & badge printing |

## Design System

Uses the Agent Assembly visual identity:

- **Paper** `#F5F5F3` — warm off-white background
- **Ink** `#111111` — primary text
- **Lavender** `#8E7DBE` — accent color
- **Inter** font with OpenType features (ss01, cv11)
