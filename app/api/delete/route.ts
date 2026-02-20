import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const UPLOAD_SECRET = process.env.UPLOAD_SECRET_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId, secretKey } = body;

    // Validate secret key
    if (secretKey !== UPLOAD_SECRET) {
      return NextResponse.json(
        { error: "Secret key salah" },
        { status: 401 }
      );
    }

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Get document info first
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !doc) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Extract storage path from file_url
    // Example URL: https://obnntlcacavfqhcrfiyq.supabase.co/storage/v1/object/public/documents/...
    const urlParts = doc.file_url.split("/storage/v1/object/public/documents/");
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: "Format URL file tidak valid" },
        { status: 400 }
      );
    }
    const storagePath = urlParts[1];

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from("documents")
      .remove([storagePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return NextResponse.json(
        { error: "Gagal menghapus file dari storage" },
        { status: 500 }
      );
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      console.error("Database delete error:", dbError);
      return NextResponse.json(
        { error: "Gagal menghapus data dari database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus dokumen" },
      { status: 500 }
    );
  }
}
