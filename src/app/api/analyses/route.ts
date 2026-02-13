import { NextRequest, NextResponse } from "next/server";
import { getPublicAnalyses, getAnalysisStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10) || 20;
    const limit = Math.min(Math.max(1, rawLimit), 50);

    const [analyses, stats] = await Promise.all([
      getPublicAnalyses(page, limit),
      getAnalysisStats(),
    ]);

    return NextResponse.json(
      {
        analyses,
        stats,
        page,
        limit,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("[api/analyses] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
