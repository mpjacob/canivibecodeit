import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = './data/vibecode.db';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      slug TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS vote_ips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      ip TEXT NOT NULL,
      voted_at INTEGER NOT NULL,
      UNIQUE(slug, ip)
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_vote_ips_slug ON vote_ips(slug);
  `);

  return db;
}

export function getVoteCount(slug: string): number {
  const row = getDb().prepare('SELECT count FROM votes WHERE slug = ?').get(slug) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function getAllVotes(): Record<string, number> {
  const rows = getDb().prepare('SELECT slug, count FROM votes').all() as { slug: string; count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.slug] = row.count;
  }
  return map;
}

export function castVote(slug: string, ip: string): { success: boolean; count: number; error?: string } {
  const database = getDb();

  const existing = database
    .prepare('SELECT id FROM vote_ips WHERE slug = ? AND ip = ?')
    .get(slug, ip);

  if (existing) {
    const count = getVoteCount(slug);
    return { success: false, count, error: 'already_voted' };
  }

  const txn = database.transaction(() => {
    database.prepare('INSERT INTO vote_ips (slug, ip, voted_at) VALUES (?, ?, ?)').run(slug, ip, Date.now());
    database
      .prepare(
        `INSERT INTO votes (slug, count) VALUES (?, 1)
         ON CONFLICT(slug) DO UPDATE SET count = count + 1`
      )
      .run(slug);
  });

  txn();
  return { success: true, count: getVoteCount(slug) };
}

export function addToWaitlist(email: string): { success: boolean; error?: string } {
  try {
    getDb().prepare('INSERT INTO waitlist (email, created_at) VALUES (?, ?)').run(email, Date.now());
    return { success: true };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'duplicate' };
    }
    throw e;
  }
}

export function getWaitlistCount(): number {
  const row = getDb().prepare('SELECT COUNT(*) as count FROM waitlist').get() as { count: number };
  return row.count;
}
