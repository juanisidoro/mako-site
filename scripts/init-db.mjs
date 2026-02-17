import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error("Usage: node scripts/init-db.mjs <DATABASE_URL>");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS analyses (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url           TEXT NOT NULL,
    domain        TEXT NOT NULL,
    html_tokens   INTEGER NOT NULL,
    mako_tokens   INTEGER NOT NULL,
    savings_pct   REAL NOT NULL,
    content_type  TEXT NOT NULL,
    entity        TEXT NOT NULL,
    summary       TEXT,
    mako_content  TEXT NOT NULL,
    headers_json  JSONB NOT NULL,
    is_public     BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_analyses_public
  ON analyses (is_public, created_at DESC)
  WHERE is_public = true
`;

console.log("OK: Table 'analyses' created successfully");

await sql`
  CREATE TABLE IF NOT EXISTS scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url             TEXT NOT NULL,
    domain          TEXT NOT NULL,
    entity          TEXT NOT NULL,
    content_type    TEXT NOT NULL,
    total_score     INTEGER NOT NULL,
    grade           TEXT NOT NULL,
    categories_json JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    is_public       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_scores_public
  ON scores (is_public, created_at DESC)
  WHERE is_public = true
`;

console.log("OK: Table 'scores' created successfully");

// Migration: add share_hash column if not exists
await sql`
  ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS share_hash TEXT UNIQUE
`;

console.log("OK: Column 'share_hash' added to scores table");

// Migration: add UNIQUE constraint on url for both tables
// Remove duplicates first (keep most recent per url)
await sql`
  DELETE FROM analyses a
  USING analyses b
  WHERE a.url = b.url AND a.created_at < b.created_at
`;

await sql`
  DELETE FROM scores a
  USING scores b
  WHERE a.url = b.url AND a.created_at < b.created_at
`;

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_analyses_url_unique ON analyses (url)
`;

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_url_unique ON scores (url)
`;

console.log("OK: UNIQUE constraint on url added to analyses and scores tables");
