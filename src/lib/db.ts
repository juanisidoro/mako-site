import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface AnalysisResult {
  id?: string;
  url: string;
  domain: string;
  htmlTokens: number;
  makoTokens: number;
  savingsPercent: number;
  contentType: string;
  entity: string;
  summary: string;
  makoContent: string;
  headers: Record<string, string>;
  isPublic: boolean;
  createdAt: string;
}

export interface AnalysisStats {
  total: number;
  avgSavings: number;
  domains: number;
}

export async function initDatabase(): Promise<void> {
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
}

export async function saveAnalysis(
  result: AnalysisResult
): Promise<string | null> {
  try {
    const rows = await sql`
      INSERT INTO analyses (
        url, domain, html_tokens, mako_tokens, savings_pct,
        content_type, entity, summary, mako_content, headers_json,
        is_public, created_at
      ) VALUES (
        ${result.url},
        ${result.domain},
        ${result.htmlTokens},
        ${result.makoTokens},
        ${result.savingsPercent},
        ${result.contentType},
        ${result.entity},
        ${result.summary},
        ${result.makoContent},
        ${JSON.stringify(result.headers)},
        ${result.isPublic},
        ${result.createdAt}
      )
      RETURNING id
    `;
    return rows[0]?.id ?? null;
  } catch (error) {
    console.error("[db] Failed to save analysis:", error);
    return null;
  }
}

export async function getPublicAnalyses(
  page: number,
  limit: number
): Promise<AnalysisResult[]> {
  try {
    const offset = (page - 1) * limit;
    const rows = await sql`
      SELECT
        id, url, domain, html_tokens, mako_tokens, savings_pct,
        content_type, entity, summary, mako_content, headers_json,
        is_public, created_at
      FROM analyses
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows.map(mapRowToAnalysis);
  } catch (error) {
    console.error("[db] Failed to get public analyses:", error);
    return [];
  }
}

export async function getAnalysisStats(): Promise<AnalysisStats> {
  try {
    const rows = await sql`
      SELECT
        COUNT(*)::integer AS total,
        COALESCE(AVG(savings_pct), 0) AS avg_savings,
        COUNT(DISTINCT domain)::integer AS domains
      FROM analyses
      WHERE is_public = true
    `;
    const row = rows[0];
    return {
      total: row?.total ?? 0,
      avgSavings: parseFloat(row?.avg_savings ?? "0"),
      domains: row?.domains ?? 0,
    };
  } catch (error) {
    console.error("[db] Failed to get analysis stats:", error);
    return { total: 0, avgSavings: 0, domains: 0 };
  }
}

function mapRowToAnalysis(row: Record<string, unknown>): AnalysisResult {
  return {
    id: row.id as string,
    url: row.url as string,
    domain: row.domain as string,
    htmlTokens: row.html_tokens as number,
    makoTokens: row.mako_tokens as number,
    savingsPercent: row.savings_pct as number,
    contentType: row.content_type as string,
    entity: row.entity as string,
    summary: (row.summary as string) ?? "",
    makoContent: row.mako_content as string,
    headers:
      typeof row.headers_json === "string"
        ? JSON.parse(row.headers_json)
        : (row.headers_json as Record<string, string>),
    isPublic: row.is_public as boolean,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : (row.created_at as string),
  };
}
