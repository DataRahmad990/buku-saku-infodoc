import { notFound } from "next/navigation";
import { supabase, CATEGORIES } from "@/lib/supabase";
import Header from "@/components/Header";
import CategoryClient from "./CategoryClient";
import type { Document } from "@/lib/supabase";

// Convert URL slug (siaran-pers) → DB key (siaran_pers)
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const key = slugToKey(category);
  const cat = CATEGORIES[key];
  return {
    title: cat ? `${cat.label} — Buku Saku Infodoc` : "Kategori",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const key = slugToKey(category);
  const cat = CATEGORIES[key];

  if (!cat) notFound();

  const documents = await getDocuments(key);

  // Unique sorted months ascending
  const availableMonths = [...new Set(documents.map((d) => d.month))].sort(
    (a, b) => a - b
  );

  return (
    <main className="pb-24">
      <Header title={cat.label} showBack backHref="/" />

      {/* Category Hero */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-ojk-red to-ojk-red-dark rounded-2xl p-5 text-white shadow-md flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {cat.icon}
        </div>
        <div>
          <h2 className="text-lg font-bold">{cat.label}</h2>
          <p className="text-xs opacity-75 mt-0.5">{cat.description}</p>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-medium">{documents.length} dokumen tersedia</span>
          </div>
        </div>
      </div>

      {/* Filter + Documents */}
      <div className="mt-4">
        <CategoryClient documents={documents} availableMonths={availableMonths} />
      </div>
    </main>
  );
}
