import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FlipbookViewer from "@/components/flipbook/FlipbookViewer";
import type { Document } from "@/lib/supabase";

async function getDocument(docId: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", docId)
    .single();

  if (error || !data) return null;
  return data;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const doc = await getDocument(docId);
  return {
    title: doc ? `${doc.title} — Buku Saku Infodoc` : "Dokumen",
  };
}

export default async function ViewDocumentPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const doc = await getDocument(docId);

  if (!doc) {
    notFound();
  }

  // Only support PDF for flipbook viewer
  const fileType = doc.file_type?.toLowerCase();
  if (fileType !== "pdf") {
    // Redirect to Microsoft Office viewer for PPT/PPTX
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(doc.file_url)}`;
    redirect(officeViewerUrl);
  }

  return <FlipbookViewer pdfUrl={doc.file_url} title={doc.title} />;
}
