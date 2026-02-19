"use client";

import { useState, useRef } from "react";
import { MONTHS, CATEGORIES } from "@/lib/supabase";

interface UploadFormProps {
  secretKey: string;
}

export default function UploadForm({ secretKey }: UploadFormProps) {
  const [form, setForm] = useState({
    title: "",
    category: "siaran_pers",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const MAX_SIZE_MB = 50;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setErrorMsg("Format tidak didukung. Gunakan PDF, PPT, atau PPTX.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`);
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Pilih file terlebih dahulu."); return; }

    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("month", String(form.month));
      formData.append("year", String(form.year));
      formData.append("description", form.description);
      formData.append("secretKey", secretKey);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload gagal");

      setStatus("success");
      setForm({
        title: "",
        category: "siaran_pers",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        description: "",
      });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const years = [2024, 2025, 2026, 2027];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-700">Upload berhasil!</p>
            <p className="text-xs text-green-600 mt-0.5">Dokumen sudah tersedia di website.</p>
          </div>
        </div>
      )}

      {(status === "error" || errorMsg) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <p className="text-sm text-red-700">{errorMsg || "Upload gagal, coba lagi."}</p>
        </div>
      )}

      {/* Judul */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Judul Dokumen *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Contoh: Siaran Pers Februari 2026"
          required
          className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-ojk-red focus:ring-1 focus:ring-ojk-red/20"
        />
      </div>

      {/* Kategori + Bulan + Tahun */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Kategori *
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-ojk-red"
          >
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Bulan *
            </label>
            <select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-ojk-red"
            >
              {Object.entries(MONTHS).map(([num, name]) => (
                <option key={num} value={num}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Tahun *
            </label>
            <select
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-ojk-red"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Deskripsi (opsional)
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ringkasan singkat isi dokumen..."
          rows={3}
          className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-ojk-red focus:ring-1 focus:ring-ojk-red/20 resize-none"
        />
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          File Dokumen * (PDF, PPT, PPTX — maks. 50MB)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition-colors ${
            file ? "border-ojk-red bg-ojk-red-pale" : "border-gray-200 hover:border-ojk-red/40 bg-gray-50"
          }`}
        >
          <span className="text-3xl mb-2">{file ? "📄" : "☁️"}</span>
          {file ? (
            <>
              <p className="text-sm font-semibold text-ojk-red">{file.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-500">Tap untuk pilih file</p>
              <p className="text-xs text-gray-400 mt-0.5">PDF, PPT, atau PPTX</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !file || !form.title}
        className="w-full bg-ojk-red text-white font-semibold py-4 rounded-2xl shadow-md hover:bg-ojk-red-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Mengupload...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Dokumen
          </>
        )}
      </button>
    </form>
  );
}
