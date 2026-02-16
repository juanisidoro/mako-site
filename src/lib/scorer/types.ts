import type { CheerioAPI } from "cheerio";
import type { ActionItem } from "@/lib/analyzer/action-extractor";
import type { LinkItem } from "@/lib/analyzer/link-extractor";

export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export interface GradeInfo {
  grade: Grade;
  title: string;
  description: string;
}

export interface ConformanceLevel {
  level: number;
  name: string;
  badge: string;
}

export interface ScoreCheck {
  id: string;
  name: string;
  maxPoints: number;
  earned: number;
  passed: boolean;
  details?: string;
}

export interface ScoreCategory {
  name: string;
  key: string;
  question: string;
  maxPoints: number;
  earned: number;
  checks: ScoreCheck[];
}

export interface ScoreRecommendation {
  check: string;
  category: string;
  impact: number;
  message: string;
  businessMessage: string;
}

export interface SiteProbeUrl {
  url: string;
  path: string;
  hasMako: boolean;
  makoVersion?: string;
  makoTokens?: number;
  makoType?: string;
  error?: string;
}

export interface SiteProbe {
  urls: SiteProbeUrl[];
  makoCount: number;
  totalChecked: number;
  adoptionPct: number;
}

export interface MakoProbeResult {
  hasMakoVersion: boolean;
  makoVersion: string | null;
  hasCorrectContentType: boolean;
  getBody: string;
  hasFrontmatter: boolean;
  summary: string;
  summaryWordCount: number;
  bodyContent: string;
  bodyContentLength: number;
  makoTokens: string | null;
  makoUpdated: string | null;
  makoType: string | null;
  makoLang: string | null;
  makoEntity: string | null;
  makoCanonical: string | null;
  etag: string | null;
  hasLinkTag: boolean;
  makoActions: MakoAction[];
  makoLinks: MakoLink[];
}

export interface MakoAction {
  name?: string;
  description?: string;
  url?: string;
}

export interface MakoLink {
  url?: string;
  context?: string;
}

export interface ScoreResult {
  id?: string;
  url: string;
  domain: string;
  entity: string;
  contentType: string;
  totalScore: number;
  grade: Grade;
  gradeInfo: GradeInfo;
  conformanceLevel: ConformanceLevel | null;
  categories: ScoreCategory[];
  recommendations: ScoreRecommendation[];
  siteProbe?: SiteProbe;
  isPublic: boolean;
  createdAt: string;
}

export interface PageData {
  url: string;
  finalUrl: string;
  html: string;
  $: CheerioAPI;
  markdown: string;
  htmlTokens: number;
  contentType: string;
  entity: string;
  summary: string;
  links: { internal: LinkItem[]; external: LinkItem[] };
  actions: ActionItem[];
  language: string;
  usedJinaFallback: boolean;
}

export function getGrade(score: number): Grade {
  if (score >= 95) return "A+";
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

export function getGradeInfo(score: number): GradeInfo {
  const grade = getGrade(score);
  const info: Record<Grade, { title: string; description: string }> = {
    F: {
      title: "Invisible to AI agents",
      description:
        "Your site can't be parsed by AI agents reliably. Basic structure is missing.",
    },
    D: {
      title: "Readable with effort",
      description:
        "Agents can extract some data, but results may be inaccurate. Key signals are missing.",
    },
    C: {
      title: "Accessible but inefficient",
      description:
        "Good base structure. Agents understand you but consume excess tokens doing so.",
    },
    B: {
      title: "Optimized for AI",
      description:
        "Agents read you well and efficiently. MAKO implementation unlocks the next level.",
    },
    A: {
      title: "Agent-ready",
      description:
        "Fast discovery, reliable structured data, and efficient token usage.",
    },
    "A+": {
      title: "Agent-first",
      description:
        "Your site speaks the language of AI agents natively. Perfect score.",
    },
  };
  return { grade, ...info[grade] };
}

export function getConformanceLevel(score: number): ConformanceLevel | null {
  if (score >= 90) return { level: 4, name: "MAKO Excellence", badge: "star" };
  if (score >= 80) return { level: 3, name: "MAKO Standard", badge: "check" };
  if (score >= 70)
    return { level: 2, name: "MAKO Discovery", badge: "search" };
  if (score >= 50) return { level: 1, name: "AI-Readable", badge: "circle" };
  return null;
}
