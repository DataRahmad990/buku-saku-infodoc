import { supabase, CATEGORIES } from "@/lib/supabase";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import DocumentCard from "@/components/DocumentCard";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from "next/image";
import type { Document } from "@/lib/supabase";

async function getCategoryCounts() {
  const { data, error } = await supabase
    .from("documents")
    .select("category");

  if (error || !data) return {} as Record<string, number>;

  const counts: Record<string, number> = {};
  data.forEach((row) => {
    counts[row.category] = (counts[row.category] || 0) + 1;
  });
  return counts;
}

async function getRecentDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !data) return [];
  return data;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoryCounts, recentDocs] = await Promise.all([
    getCategoryCounts(),
    getRecentDocuments(),
  ]);

  const activeCategories = Object.entries(CATEGORIES).filter(
    ([key]) => (categoryCounts[key] || 0) > 0 || key === "siaran_pers"
  );

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : "Selamat Sore";

  return (
    <main className="pb-24 relative">
      <AnimatedBackground />
      <Header title="Buku Saku Infodoc" />

      {/* Hero Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-ojk-red to-ojk-red-dark rounded-2xl p-5 text-white shadow-lg animate-fadeIn relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 animate-pulse"></div>

        <div className="relative z-10">
          {/* Logos */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/kopw.png"
              alt="KOPW"
              width={80}
              height={80}
              className="drop-shadow-lg animate-slideInLeft"
            />
            <Image
              src="/ojk.png"
              alt="OJK"
              width={80}
              height={80}
              className="drop-shadow-lg animate-slideInRight"
            />
          </div>

          <p className="text-sm font-medium opacity-90 mb-1">{greeting} 👋</p>
          <h2 className="text-xl font-bold leading-tight mb-1">
            Portal Dokumen<br />Internal OJK
          </h2>
          <p className="text-xs opacity-80 leading-relaxed">
            Akses laporan & siaran pers terkini dari satu tempat. Download kapan saja, di mana saja.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Kategori Dokumen</h2>
          <span className="text-xs text-gray-400">{activeCategories.length} kategori</span>
        </div>
        <div className="flex flex-col gap-3">
          {activeCategories.map(([key, cat]) => (
            <CategoryCard
              key={key}
              href={`/${key.replace("_", "-")}`}
              icon={cat.icon}
              label={cat.label}
              description={cat.description}
              count={categoryCounts[key]}
            />
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      {recentDocs.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Terbaru</h2>
            <span className="text-xs text-gray-400">Update otomatis</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      )}

      {recentDocs.length === 0 && (
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm font-medium text-gray-500">Belum ada dokumen</p>
            <p className="text-xs text-gray-400 mt-1">
              Dokumen akan muncul di sini setelah di-upload oleh admin
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 mt-8 pb-2">
        <p className="text-center text-[10px] text-gray-300">
          Buku Saku Infodoc · Khusus Internal
        </p>
      </div>
    </main>
  );
}
