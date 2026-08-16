import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { uploadToCloudinary } from "@/lib/storage/cloudinary";
import { parseDocumentFile, analyzeLegalText } from "@/lib/documents/parser";
import { FileType, RetentionPolicy } from "@/lib/types";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  await connectDB();

  try {
    const filter: any = { userId: user.userId, isDeleted: false };
    if (category && category !== "All") filter.category = category;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { textContent: { $regex: query, $options: "i" } },
      ];
    }

    const docs = await DocumentModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ documents: docs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "General";
    const retentionPolicy = ((formData.get("retentionPolicy") as string) || "30d") as RetentionPolicy;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const sizeBytes = file.size;
    if (sizeBytes > 200 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds maximum allowed limit of 200 MB." }, { status: 400 });
    }

    let fileType: FileType = "txt";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") fileType = "pdf";
    else if (ext === "docx" || ext === "doc") fileType = "docx";
    else if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) fileType = "img";

    // 1. Parse & OCR
    const parseRes = await parseDocumentFile(buffer, fileName, fileType);

    // Page count validation: Max 15 pages allowed
    if (parseRes.pageCount && parseRes.pageCount > 15) {
      return NextResponse.json(
        { error: `Document exceeds maximum page limit (${parseRes.pageCount} pages detected). Please upload a document with 15 pages or fewer.` },
        { status: 400 }
      );
    }

    // 2. Cloudinary upload
    const uploadRes = await uploadToCloudinary(buffer, fileName);

    await connectDB();

    // 3. Create document record
    const doc = await DocumentModel.create({
      userId: user.userId,
      title: fileName.replace(/\.[^/.]+$/, ""),
      fileName,
      fileUrl: uploadRes.url,
      cloudinaryPublicId: uploadRes.publicId,
      fileType,
      sizeBytes,
      textContent: parseRes.textContent,
      category,
      retentionPolicy,
      status: "parsed",
      metadata: {
        pageCount: parseRes.pageCount,
        wordCount: parseRes.wordCount,
        ocrUsed: parseRes.ocrUsed,
        language: parseRes.language,
      },
      isDeleted: false,
    });

    // 4. Perform Legal Clause & Risk Analysis
    const analysisPayload = analyzeLegalText(doc._id.toString(), user.userId, parseRes.textContent);
    const analysis = await AnalysisModel.create(analysisPayload);

    return NextResponse.json({
      success: true,
      document: doc,
      analysis,
    });
  } catch (e: any) {
    console.error("Document upload route error:", e);
    return NextResponse.json({ error: e.message || "Failed to process document" }, { status: 500 });
  }
}
