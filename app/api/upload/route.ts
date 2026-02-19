import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const maxDuration = 60;

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const secretKey = formData.get("secretKey") as string;
    const expectedKey = process.env.UPLOAD_SECRET_KEY;
    if (!expectedKey || secretKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const month = parseInt(formData.get("month") as string, 10);
    const year = parseInt(formData.get("year") as string, 10);
    const description = (formData.get("description") as string) || null;
    const file = formData.get("file") as File;

    if (!title || !category || !month || !year || !file) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const ALLOWED_TYPES = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File terlalu besar (maks 50MB)" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const timestamp = Date.now();
    const safeName = sanitizeFilename(file.name);
    const storagePath = `${category}/${year}/${String(month).padStart(2, "0")}/${timestamp}_${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json({ error: `Storage error: ${storageError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from("documents").insert({
      title,
      category,
      month,
      year,
      description,
      file_url: fileUrl,
      file_name: file.name,
      file_type: getFileType(file.name),
    });

    if (dbError) {
      await supabase.storage.from("documents").remove([storagePath]);
      console.error("DB error:", dbError);
      return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, file_url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
