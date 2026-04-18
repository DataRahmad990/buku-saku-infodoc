import { notFound } from "next/navigation";
import { supabase, CATEGORIES } from "@/lib/supabase";
import Header from "@/components/Header";
import CategoryClient from "./CategoryClient";
import type { Document } from "@/lib/supabase";

function slugToKey(slug: string) {
  return slug.replace(/-/g, "_");
}

async function getDocuments(categoryKey: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("category", categoryKey)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const key = slugToKey(category);
  const cat = CATEGORIES[key];
  return { title: cat ? `${cat.label} — Buku Saku Infodoc` : "Kategori" };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  siaran_pers: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
    </svg>
  ),
  laporan_bulanan: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2v4H8zM12 11h2v6h-2z" />
    </svg>
  ),
  info_pegawai: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  arsip: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const key = slugToKey(category);
  const cat = CATEGORIES[key];

  if (!cat) notFound();

  const documents = await getDocuments(key);
  const availableMonths = [...new Set(documents.map((d) => d.month))].sort((a, b) => a - b);
  const icon = CATEGORY_ICONS[key];

  return (
    <main className="pb-32">
      <Header title={cat.label} showBack backHref="/" />

      {/* Category Hero */}
      <div className="mx-4 mt-3 rounded-4xl overflow-hidden relative noise" style={{ minHeight: 140 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-ojk-red via-ojk-red-dark to-stone-950" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.03] rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 p-6 flex items-start gap-4">
          <div className="w-14 h-14 rounded-3xl bg-white/12 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white">
            {icon || <span className="text-2xl">{cat.icon}</span>}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="font-serif text-[22px] text-white leading-tight tracking-[-0.02em]">{cat.label}</h2>
            <p className="text-[11px] text-white/45 mt-1 leading-relaxed">{cat.description}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[11px] font-semibold text-white/80">{documents.length} dokumen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        <CategoryClient documents={documents} availableMonths={availableMonths} />
      </div>
    </main>
  );
}
