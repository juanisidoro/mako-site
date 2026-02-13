import type { CheerioAPI } from "cheerio";
import type { ActionItem } from "@/lib/analyzer/action-extractor";
import type { LinkItem } from "@/lib/analyzer/link-extractor";

export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

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
  maxPoints: number;
  earned: number;
  checks: ScoreCheck[];
}

export interface ScoreRecommendation {
  check: string;
  impact: number;
  message: string;
}

export interface ScoreResult {
  id?: string;
  url: string;
  domain: string;
  entity: string;
  contentType: string;
  totalScore: number;
  grade: Grade;
  categories: ScoreCategory[];
  recommendations: ScoreRecommendation[];
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
