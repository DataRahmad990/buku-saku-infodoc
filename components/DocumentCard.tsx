"use client";

import { Document, MONTHS } from "@/lib/supabase";

const FILE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  pdf: { icon: "📄", color: "text-red-600", bg: "bg-red-50" },
  ppt: { icon: "📊", color: "text-orange-600", bg: "bg-orange-50" },
  pptx: { icon: "📊", color: "text-orange-600", bg: "bg-orange-50" },
  default: { icon: "📁", color: "text-gray-600", bg: "bg-gray-100" },
};

interface DocumentCardProps {
  doc: Document;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getViewerUrl(fileUrl: string, fileType: string): string {
  const encoded = encodeURIComponent(fileUrl);
  if (fileType === "pdf") {
    // PDF bisa langsung dibuka di browser
    return fileUrl;
  }
  // PPT/PPTX pakai Microsoft Office Online Viewer
  return `https://view.officeapps.live.com/op/view.aspx?src=${encoded}`;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
  const fileType = doc.file_type?.toLowerCase() || "default";
  const typeInfo = FILE_ICONS[fileType] || FILE_ICONS.default;

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
    const viewUrl = getViewerUrl(doc.file_url, fileType);
    window.open(viewUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-50 p-4">
      <div className="flex gap-3 items-start">
        <div className={`w-12 h-12 ${typeInfo.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
          {typeInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{doc.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
              {fileType !== "default" ? fileType.toUpperCase() : "FILE"}
            </span>
            <span className="text-[10px] text-gray-400">
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
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-ojk-red text-ojk-red text-xs font-semibold hover:bg-ojk-red-pale active:scale-95 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Baca
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-ojk-red text-white text-xs font-semibold hover:bg-ojk-red-dark active:scale-95 transition-all shadow-sm"
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
  );
}
