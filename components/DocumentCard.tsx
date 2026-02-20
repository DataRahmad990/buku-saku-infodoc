"use client";

import { Document, MONTHS } from "@/lib/supabase";
import { useState } from "react";

const FILE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  pdf: { icon: "📄", color: "text-red-600", bg: "bg-red-50" },
  ppt: { icon: "📊", color: "text-orange-600", bg: "bg-orange-50" },
  pptx: { icon: "📊", color: "text-orange-600", bg: "bg-orange-50" },
  default: { icon: "📁", color: "text-gray-600", bg: "bg-gray-100" },
};

interface DocumentCardProps {
  doc: Document;
  onDelete?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const fileType = doc.file_type?.toLowerCase() || "default";
  const typeInfo = FILE_ICONS[fileType] || FILE_ICONS.default;
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
      // PDF pakai flipbook viewer
      window.open(`/view/${doc.id}`, "_blank");
    } else {
      // PPT/PPTX pakai Microsoft Office Online Viewer
      const encoded = encodeURIComponent(doc.file_url);
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encoded}`, "_blank");
    }
  };

  const handleDelete = async () => {
    if (!secretKey.trim()) {
      setDeleteError("Masukkan secret key");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: doc.id,
          secretKey: secretKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || "Gagal menghapus dokumen");
        setIsDeleting(false);
        return;
      }

      // Success
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete();
      } else {
        // Refresh page if no callback provided
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("Terjadi kesalahan saat menghapus dokumen");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 p-4 relative group hover:shadow-card-hover transition-all duration-300 hover:border-ojk-red/10">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-ojk-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

        {/* Delete button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 z-10"
          title="Hapus dokumen"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>

        <div className="flex gap-3 items-start relative z-10">
          <div className={`w-12 h-12 ${typeInfo.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
            {typeInfo.icon}
          </div>
          <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-ojk-red transition-colors duration-200">{doc.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeInfo.bg} ${typeInfo.color} shadow-sm`}>
              {fileType !== "default" ? fileType.toUpperCase() : "FILE"}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {MONTHS[doc.month]} {doc.year}
            </span>
          </div>
          {doc.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{doc.description}</p>
          )}
          <p className="text-[10px] text-gray-300 mt-0.5">Diupload {formatDate(doc.created_at)}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3 relative z-10">
        <button
          onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-ojk-red text-ojk-red text-xs font-bold hover:bg-ojk-red-pale active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Baca
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-ojk-red to-ojk-red-dark text-white text-xs font-bold hover:from-ojk-red-dark hover:to-ojk-red active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Dokumen?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Dokumen <span className="font-semibold">{doc.title}</span> akan dihapus permanen. Masukkan secret key untuk konfirmasi.
            </p>

            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret key"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-ojk-red"
              disabled={isDeleting}
            />

            {deleteError && (
              <p className="text-xs text-red-600 mb-3">{deleteError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSecretKey("");
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
