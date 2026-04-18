import { redirect } from "next/navigation";
import Header from "@/components/Header";
import UploadForm from "./UploadForm";

export const metadata = {
  title: "Upload Dokumen — Buku Saku Infodoc",
};

export default async function UploadPage({ params }: { params: Promise<{ secretKey: string }> }) {
  const { secretKey } = await params;
  const expectedKey = process.env.UPLOAD_SECRET_KEY;

  if (!expectedKey || secretKey !== expectedKey) {
    redirect("/");
  }

  return (
    <main className="pb-32">
      <Header title="Upload Dokumen" showBack backHref="/" />

      {/* Upload Hero */}
      <div className="mx-4 mt-3 rounded-4xl overflow-hidden relative noise" style={{ minHeight: 100 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-ojk-red via-ojk-red-dark to-stone-950" />
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/12 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white tracking-[-0.01em]">Upload Baru</h2>
            <p className="text-[11px] text-white/45 mt-0.5">Langsung tersedia untuk semua pengguna</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <UploadForm secretKey={secretKey} />
      </div>
    </main>
  );
}
