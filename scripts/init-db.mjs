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
