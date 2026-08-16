import { NextResponse } from "next/server";
import { LEGAL_TEMPLATES_50 } from "@/lib/templates/data";

export async function GET() {
  return NextResponse.json({
    templates: LEGAL_TEMPLATES_50,
    total: LEGAL_TEMPLATES_50.length,
  });
}
