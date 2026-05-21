import { NextResponse } from "next/server";
import { buildPresentationPptxBuffer } from "@/lib/export/pptxBuilder";
import type { PresentationExport } from "@/types/presentation-export";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      presentation: PresentationExport;
      slideIds?: string[];
    };
    if (!body?.presentation?.presentationTitle) {
      return NextResponse.json({ error: "Invalid presentation payload" }, { status: 400 });
    }
    const { buffer, usedTemplate } = await buildPresentationPptxBuffer(
      body.presentation,
      body.slideIds,
    );
    const filename = `${body.presentation.presentationTitle.replace(/[^\w\s-]/g, "").trim() || "diagnostic-deck"}.pptx`;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Used-Template": usedTemplate ? "true" : "false",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PPTX export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
