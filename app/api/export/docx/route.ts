import { NextResponse } from "next/server";
import { executiveMemoToBuffer } from "@/lib/export/docxBuilder";
import type { ExecutiveMemo } from "@/types/executive-memo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const memo = (await request.json()) as ExecutiveMemo;
    if (!memo?.title) {
      return NextResponse.json({ error: "Invalid memo payload" }, { status: 400 });
    }
    const buffer = await executiveMemoToBuffer(memo);
    const filename = `${memo.title.replace(/[^\w\s-]/g, "").trim() || "executive-memo"}.docx`;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "DOCX export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
