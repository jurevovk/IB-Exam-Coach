import { NextResponse } from "next/server";

import {
  extractDocxText,
  extractPdfText,
  extractPlainText,
} from "@/lib/grade-work/extractText";

export const runtime = "nodejs";

const minUsefulTextLength = 80;

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `extract-${Date.now()}`;
};

const logExtract = (
  requestId: string,
  stage: string,
  details: Record<string, unknown>
) => {
  console.info("[grade-work:extract]", { requestId, stage, ...details });
};

const logExtractError = (
  requestId: string,
  stage: string,
  error: unknown,
  details: Record<string, unknown> = {}
) => {
  console.error("[grade-work:extract]", {
    requestId,
    stage,
    error: error instanceof Error ? error.message : String(error),
    ...details,
  });
};

const getExtension = (name: string) =>
  name.toLowerCase().split(".").pop()?.trim() ?? "";

const parseFile = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getExtension(file.name);

  if (extension === "txt" || file.type === "text/plain") {
    return extractPlainText(buffer);
  }

  if (
    extension === "docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractDocxText(buffer);
  }

  if (extension === "pdf" || file.type === "application/pdf") {
    return extractPdfText(buffer);
  }

  throw new Error("Upload a PDF, DOCX, or TXT file.");
};

export async function POST(req: Request) {
  const requestId = createRequestId();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      logExtractError(
        requestId,
        "missing_file",
        new Error("No file in request")
      );
      return NextResponse.json(
        { error: "Choose a PDF, DOCX, or TXT file to extract." },
        { status: 400 }
      );
    }

    logExtract(requestId, "file_received", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    const text = await parseFile(file);
    logExtract(requestId, "text_extracted", {
      name: file.name,
      textCharacters: text.length,
    });

    if (text.length < minUsefulTextLength) {
      logExtractError(
        requestId,
        "extracted_text_too_short",
        new Error("Extracted text below useful threshold"),
        { textCharacters: text.length }
      );
      return NextResponse.json(
        {
          error:
            "Could not extract enough readable text from this file. Paste the essay text instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ fileName: file.name, text });
  } catch (error) {
    logExtractError(requestId, "extract_failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not extract text from this file. Paste the essay text instead.",
      },
      { status: 400 }
    );
  }
}
