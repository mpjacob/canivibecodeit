import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { App } from './types';
import { getAllVotes } from './db';

const APPS_DIR = './data/apps';

export function getAllApps(): App[] {
  const files = readdirSync(APPS_DIR).filter((f) => f.endsWith('.json'));
  const apps: App[] = [];

  for (const file of files) {
    const raw = readFileSync(join(APPS_DIR, file), 'utf-8');
    apps.push(JSON.parse(raw) as App);
  }

  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAppBySlug(slug: string): App | undefined {
  const path = join(APPS_DIR, `${slug}.json`);
  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as App;
  } catch {
    return undefined;
  }
}

export function getDeathList(): (App & { votes: number })[] {
  const apps = getAllApps();
  const votes = getAllVotes();

  return apps
    .map((app) => ({ ...app, votes: votes[app.slug] ?? 0 }))
    .sort((a, b) => b.votes - a.votes || b.priceMonthly - a.priceMonthly);
}

export function getMrrDestroyed(): number {
  const deathList = getDeathList();
  return deathList.reduce((sum, app) => sum + app.priceMonthly * app.votes, 0);
}

export function getRelatedApps(app: App, limit = 3): App[] {
  const all = getAllApps().filter((a) => a.slug !== app.slug);
  const sameCategory = all.filter((a) => a.category === app.category);
  const sameVerdict = all.filter((a) => a.verdict === app.verdict && a.category !== app.category);

  const related = [...sameCategory, ...sameVerdict];
  const seen = new Set<string>();
  const result: App[] = [];

  for (const a of related) {
    if (!seen.has(a.slug)) {
      seen.add(a.slug);
      result.push(a);
      if (result.length >= limit) break;
    }
  }

  if (result.length < limit) {
    for (const a of all) {
      if (!seen.has(a.slug)) {
        result.push(a);
        if (result.length >= limit) break;
      }
    }
  }

  return result;
}

export function getCategories(): string[] {
  const apps = getAllApps();
  const cats = new Set(apps.map((a) => a.category));
  return Array.from(cats).sort();
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free tier';
  return `$${price}/mo`;
}

export function formatMrr(amount: number): string {
  return `$${amount.toLocaleString('en-US')}/mo`;
}
