"use client";

import { Document, MONTHS } from "@/lib/supabase";
import { useState } from "react";

const FILE_STYLES: Record<string, { label: string; accent: string; bg: string; darkBg: string }> = {
  pdf: { label: "PDF", accent: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50", darkBg: "dark:bg-rose-950/30" },
  ppt: { label: "PPT", accent: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50", darkBg: "dark:bg-amber-950/30" },
  pptx: { label: "PPTX", accent: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50", darkBg: "dark:bg-amber-950/30" },
  default: { label: "FILE", accent: "text-stone-500 dark:text-stone-400", bg: "bg-stone-100", darkBg: "dark:bg-stone-800/40" },
};

interface DocumentCardProps {
  doc: Document;
  onDelete?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function FileIcon({ type }: { type: string }) {
  const isPdf = type === "pdf";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {isPdf ? (
        <path d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v2" />
      ) : (
        <rect x="8" y="12" width="8" height="6" rx="1" />
      )}
    </svg>
  );
}

export default function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const fileType = doc.file_type?.toLowerCase() || "default";
  const style = FILE_STYLES[fileType] || FILE_STYLES.default;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDownload = async () => {
    try {
      const response = await fetch(doc.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(doc.file_url, "_blank");
    }
  };

  const handleView = () => {
    if (fileType === "pdf") {
      window.open(`/view/${doc.id}`, "_blank");
    } else {
      const encoded = encodeURIComponent(doc.file_url);
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encoded}`, "_blank");
    }
  };

  const handleDelete = async () => {
    if (!secretKey.trim()) { setDeleteError("Masukkan secret key"); return; }
    setIsDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: doc.id, secretKey }),
      });
      const data = await response.json();
      if (!response.ok) { setDeleteError(data.error || "Gagal menghapus"); setIsDeleting(false); return; }
      setShowDeleteModal(false);
      if (onDelete) { onDelete(); } else { window.location.reload(); }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("Terjadi kesalahan");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="glass p-4 group">
        <div className="flex gap-3.5 items-start">
          {/* File type icon */}
          <div className={`w-11 h-11 ${style.bg} ${style.darkBg} rounded-2xl flex items-center justify-center flex-shrink-0 ${style.accent} group-hover:scale-105 transition-transform duration-300`}>
            <FileIcon type={fileType} />
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary text-[13px] leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200 tracking-[-0.01em]">
              {doc.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[9px] font-bold uppercase tracking-[0.06em] ${style.accent} ${style.bg} ${style.darkBg} px-2 py-0.5 rounded-md`}>
                {style.label}
              </span>
              <span className="text-[11px] text-tertiary">
                {MONTHS[doc.month]} {doc.year}
              </span>
              <span className="text-[10px] text-quaternary">
                {formatDate(doc.created_at)}
              </span>
            </div>
            {doc.description && (
              <p className="text-[11px] text-tertiary mt-1 line-clamp-1">{doc.description}</p>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-quaternary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5"
            title="Hapus"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3.5">
          <button
            onClick={handleView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-default text-secondary text-[12px] font-semibold hover:border-[rgb(var(--accent))] hover:text-accent hover:bg-accent-soft active:scale-[0.97] transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Baca
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[rgb(var(--accent))] text-white text-[12px] font-semibold hover:shadow-accent-sm active:scale-[0.97] transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center animate-fade">
          <div className="bg-[rgb(var(--surface-1))] rounded-t-4xl w-full max-w-[430px] p-6 pb-10 shadow-heavy border-t border-default animate-slide-up">
            <div className="w-10 h-1 bg-quaternary rounded-full mx-auto mb-6" />

            <div className="w-14 h-14 rounded-3xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>

            <h3 className="text-[17px] font-bold text-primary text-center tracking-[-0.02em]">Hapus Dokumen?</h3>
            <p className="text-[13px] text-secondary text-center mt-1.5 mb-5 leading-relaxed">
              <span className="font-semibold text-primary">{doc.title}</span> akan dihapus permanen.
            </p>

            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Masukkan secret key"
              className="w-full px-4 py-3.5 bg-recessed border border-default rounded-2xl text-[13px] text-primary placeholder:text-quaternary focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-all"
              disabled={isDeleting}
            />

            {deleteError && (
              <p className="text-[12px] text-rose-500 mt-2 text-center">{deleteError}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowDeleteModal(false); setSecretKey(""); setDeleteError(""); }}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-2xl border border-default text-secondary text-[13px] font-semibold hover:bg-recessed disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white text-[13px] font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
