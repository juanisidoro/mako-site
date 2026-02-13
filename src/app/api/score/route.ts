import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreUrl } from "@/lib/scorer";

const requestSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  isPublic: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { url, isPublic } = parsed.data;

    const result = await scoreUrl(url, isPublic);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("[api/score] Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";
    const isClientError =
      message.includes("Invalid URL") ||
      message.includes("not allowed") ||
      message.includes("Must be");

    return NextResponse.json(
      { error: message },
      { status: isClientError ? 400 : 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
