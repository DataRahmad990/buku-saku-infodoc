import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

// File upload sekarang langsung ke Supabase Storage dari client.
// API route ini hanya menyimpan metadata (JSON kecil) ke database.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretKey, title, category, month, year, description, file_url, file_name, file_type, storage_path } = body;

    const expectedKey = process.env.UPLOAD_SECRET_KEY;
    if (!expectedKey || secretKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !category || !month || !year || !file_url || !file_name) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { error: dbError } = await supabase.from("documents").insert({
      title,
      category,
      month: Number(month),
      year: Number(year),
      description: description || null,
      file_url,
      file_name,
      file_type: file_type || null,
    });

    if (dbError) {
      // Rollback: hapus file dari storage kalau insert DB gagal
      if (storage_path) {
        await supabase.storage.from("documents").remove([storage_path]);
      }
      console.error("DB error:", dbError);
      return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, file_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
