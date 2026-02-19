import { redirect } from "next/navigation";
import Header from "@/components/Header";
import UploadForm from "./UploadForm";

export const metadata = {
  title: "Upload Dokumen — Buku Saku Infodoc",
};

export default async function UploadPage({ params }: { params: Promise<{ secretKey: string }> }) {
  const { secretKey } = await params;
  const expectedKey = process.env.UPLOAD_SECRET_KEY;

  // Validate secret key
  if (!expectedKey || secretKey !== expectedKey) {
    redirect("/");
  }

  return (
    <main className="pb-28">
      <Header title="Upload Dokumen" showBack backHref="/" />

      {/* Upload Hero */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-ojk-red to-ojk-red-dark rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            📤
          </div>
          <div>
            <h2 className="text-base font-bold">Upload Dokumen Baru</h2>
            <p className="text-xs opacity-75 mt-0.5">
              File akan langsung tersedia untuk semua pengguna
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        <UploadForm secretKey={secretKey} />
      </div>
    </main>
  );
}
