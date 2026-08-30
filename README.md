# Can I Vibecode It?

A directory site answering, per paid SaaS app, whether you can replace it with one AI coding prompt.

**Live demo:** Run locally with `npm run dev` → http://localhost:4321

## Stack

- **Astro** (server output, Node adapter)
- **better-sqlite3** for votes and waitlist
- **Vanilla JS** for all interactions (no client framework)
- **satori + resvg** for OG image generation
- **JetBrains Mono + Space Grotesk** typography
- CRT-black dark mode (default) + paper light mode

## Features

- 12 SaaS apps as JSON files in `data/apps/`
- Homepage with live search, category chips, and "The Death List"
- MRR Destroyed ticker with odometer animation
- Per-app pages with verdict, one-shot prompts, copy buttons (Claude/Codex/Cursor)
- "I replaced this" voting (IP rate-limited, SQLite)
- Waitlist email capture (honeypot + dedupe)
- Full SEO: JSON-LD, sitemap, robots.txt, OG images
- Footer links to the rebuild prompt (this site practices what it preaches)

## Quick Start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build
npm start        # run production server
```

## Data Format

Each app is a JSON file in `data/apps/`:

```json
{
  "slug": "notion",
  "name": "Notion",
  "domain": "notion.so",
  "category": "productivity",
  "priceMonthly": 10,
  "verdict": "kinda",
  "whatYouLose": ["..."],
  "priorArt": [{ "title": "...", "url": "..." }],
  "prompt": "Build a Notion-like...",
  "notes": "The editor is the hard part."
}
```

## Adding Apps

1. Create `data/apps/your-app.json` following the schema above
2. Rebuild — the app appears automatically on the homepage and gets its own page at `/:slug`

## License

MIT
