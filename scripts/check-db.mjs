import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];
const sql = neon(DATABASE_URL);

const rows = await sql`SELECT id, url, domain, html_tokens, mako_tokens, savings_pct, content_type, entity, is_public, created_at FROM analyses ORDER BY created_at DESC`;
console.log(`Total: ${rows.length} analyses\n`);
for (const r of rows) {
  console.log(`  ${r.is_public ? '🌐' : '🔒'} ${r.domain} | ${r.entity} | ${r.html_tokens}→${r.mako_tokens} tok (${r.savings_pct}% saved) | ${r.content_type}`);
}
