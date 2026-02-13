import { NextRequest, NextResponse } from "next/server";
import { getLatestPublicScore } from "@/lib/db";

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+": return "#22c55e";
    case "A": return "#06d6a0";
    case "B": return "#38bdf8";
    case "C": return "#f59e0b";
    case "D": return "#f97316";
    case "F": return "#ef4444";
    default: return "#64748b";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let domain: string;
  try {
    domain = new URL(url).hostname;
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  const scoreRow = await getLatestPublicScore(domain);

  const score = scoreRow?.totalScore ?? "?";
  const grade = scoreRow?.grade ?? "?";
  const gradeColor = getGradeColor(String(grade));

  // shields.io-style SVG badge
  const labelText = "MAKO Score";
  const valueText = `${score}/100`;
  const gradeText = grade;

  const labelWidth = labelText.length * 6.8 + 12;
  const valueWidth = valueText.length * 6.8 + 12;
  const gradeWidth = gradeText.length * 7.5 + 14;
  const totalWidth = labelWidth + valueWidth + gradeWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".07"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="22" rx="4" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="22" fill="#1e293b"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="22" fill="#0f172a"/>
    <rect x="${labelWidth + valueWidth}" width="${gradeWidth}" height="22" fill="${gradeColor}"/>
    <rect width="${totalWidth}" height="22" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#94a3b8">${labelText}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15" fill="#e2e8f0">${valueText}</text>
    <text x="${labelWidth + valueWidth + gradeWidth / 2}" y="15" fill="#fff" font-weight="bold">${gradeText}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
