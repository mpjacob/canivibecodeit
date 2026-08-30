export interface App {
  slug: string;
  name: string;
  domain: string;
  category: string;
  priceMonthly: number;
  verdict: 'yes' | 'kinda' | 'no';
  whatYouLose: string[];
  priorArt: { title: string; url: string }[];
  prompt: string;
  notes: string;
}

export const CATEGORIES: Record<string, string> = {
  'project-management': '📋 Project Management',
  'crm': '🤝 CRM',
  'analytics': '📊 Analytics',
  'design': '🎨 Design',
  'communication': '💬 Communication',
  'dev-tools': '🛠️ Dev Tools',
  'finance': '💰 Finance',
  'marketing': '📣 Marketing',
  'productivity': '⚡ Productivity',
  'support': '🎧 Support',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  'project-management': '📋',
  'crm': '🤝',
  'analytics': '📊',
  'design': '🎨',
  'communication': '💬',
  'dev-tools': '🛠️',
  'finance': '💰',
  'marketing': '📣',
  'productivity': '⚡',
  'support': '🎧',
};

export const VERDICT_LABELS: Record<App['verdict'], string> = {
  yes: 'YES',
  kinda: 'KINDA',
  no: 'NOT REALLY',
};

export const REBUILD_PROMPT = `Build me a directory site called "Can I Vibecode It?" that answers, per paid SaaS app, whether you can replace it with one AI coding prompt. Stack: Astro (server output, node adapter) + better-sqlite3. No client framework: vanilla JS for interactions. Dev-tool aesthetic: JetBrains Mono + Space Grotesk, CRT-black dark mode (default) and a paper light mode, phosphor green as the only loud color. Each app is one JSON file in data/apps/. Homepage: hero search, category chips, Death List ranked by votes, MRR destroyed ticker. App pages at /:slug with verdict, prompt, copy buttons, FAQ, voting. SEO: SSR, JSON-LD, sitemap, OG images with satori. Waitlist email capture. MIT license.`;
