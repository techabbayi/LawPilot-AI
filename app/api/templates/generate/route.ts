import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { templateId, variables, templateTitle } = await req.json();

    let compiledContent = (variables.templateBodyMarkdown || "") as string;
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      compiledContent = compiledContent.replace(regex, variables[key]);
    });

    await connectDB();

    const title = `${templateTitle || "Generated Legal Document"} (${new Date().toLocaleDateString()})`;

    const doc = await DocumentModel.create({
      userId: user.userId,
      title,
      fileName: `${title.replace(/[^a-zA-Z0-9]/g, "_")}.md`,
      fileUrl: "#",
      fileType: "txt",
      sizeBytes: compiledContent.length,
      textContent: compiledContent,
      category: "Generated Templates",
      retentionPolicy: "30d",
      status: "parsed",
      metadata: {
        wordCount: compiledContent.split(/\s+/).length,
        pageCount: Math.ceil(compiledContent.split(/\s+/).length / 400),
      },
      isDeleted: false,
    });

    return NextResponse.json({
      success: true,
      document: doc,
      compiledContent,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Template generation failed" }, { status: 500 });
  }
}
