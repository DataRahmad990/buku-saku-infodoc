"use client";

import { useState, useRef } from "react";
import { supabase, MONTHS, CATEGORIES } from "@/lib/supabase";

interface UploadFormProps {
  secretKey: string;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
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
  const [uploadProgress, setUploadProgress] = useState("");
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
      setUploadProgress("Mengupload file...");
      const timestamp = Date.now();
      const safeName = sanitizeFilename(file.name);
      const storagePath = `${form.category}/${form.year}/${String(form.month).padStart(2, "0")}/${timestamp}_${safeName}`;

      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (storageError) throw new Error(`Upload gagal: ${storageError.message}`);

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(storagePath);

      setUploadProgress("Menyimpan data...");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretKey,
          title: form.title,
          category: form.category,
          month: form.month,
          year: form.year,
          description: form.description || null,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_type: file.name.split(".").pop()?.toLowerCase() || "",
          storage_path: storagePath,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        await supabase.storage.from("documents").remove([storagePath]);
        throw new Error(json.error || "Gagal menyimpan data");
      }

      setStatus("success");
      setForm({ title: "", category: "siaran_pers", month: new Date().getMonth() + 1, year: new Date().getFullYear(), description: "" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  const years = [2024, 2025, 2026, 2027];

  const inputClass = "w-full text-[13px] text-primary bg-recessed border border-default rounded-2xl px-4 py-3 focus:outline-none focus:border-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/10 transition-all";
  const labelClass = "block text-[11px] font-bold text-tertiary mb-1.5 uppercase tracking-[0.06em]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {status === "success" && (
        <div className="glass p-4 flex items-center gap-3 border-emerald-200 dark:border-emerald-900">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">Upload berhasil!</p>
            <p className="text-[11px] text-emerald-600/60 mt-0.5">Dokumen sudah tersedia.</p>
          </div>
        </div>
      )}

      {(status === "error" || errorMsg) && (
        <div className="glass p-4 flex items-center gap-3 border-rose-200 dark:border-rose-900">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <p className="text-[13px] text-rose-600 dark:text-rose-400">{errorMsg || "Upload gagal."}</p>
        </div>
      )}

      {/* Title */}
      <div className="glass p-4">
        <label className={labelClass}>Judul Dokumen *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Contoh: Siaran Pers Februari 2026"
          required
          className={inputClass}
        />
      </div>

      {/* Category + Month + Year */}
      <div className="glass p-4 flex flex-col gap-3">
        <div>
          <label className={labelClass}>Kategori *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Bulan *</label>
            <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className={inputClass}>
              {Object.entries(MONTHS).map(([num, name]) => (
                <option key={num} value={num}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tahun *</label>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={inputClass}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="glass p-4">
        <label className={labelClass}>Deskripsi (opsional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ringkasan singkat..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* File Upload */}
      <div className="glass p-4">
        <label className={labelClass}>File * (PDF, PPT, PPTX — maks. 50MB)</label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-7 flex flex-col items-center text-center cursor-pointer transition-all ${
            file
              ? "border-[rgb(var(--accent))]/30 bg-accent-soft"
              : "border-default hover:border-[rgb(var(--accent))]/20 bg-recessed"
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
            file ? "bg-[rgb(var(--accent))]/10 text-accent" : "bg-[rgb(var(--surface-1))] border border-default text-quaternary"
          }`}>
            {file ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </div>
          {file ? (
            <>
              <p className="text-[13px] font-semibold text-accent">{file.name}</p>
              <p className="text-[11px] text-tertiary mt-0.5">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </>
          ) : (
            <>
              <p className="text-[13px] font-medium text-secondary">Tap untuk pilih file</p>
              <p className="text-[11px] text-quaternary mt-0.5">PDF, PPT, atau PPTX</p>
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
        className="w-full bg-[rgb(var(--accent))] text-white font-semibold text-[14px] py-4 rounded-3xl hover:shadow-accent-md active:scale-[0.97] transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {uploadProgress || "Mengupload..."}
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
