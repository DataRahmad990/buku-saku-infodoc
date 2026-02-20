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
      <div className="mx-4 mt-4 bg-gradient-to-br from-ojk-red via-ojk-red-dark to-ojk-red rounded-2xl p-6 text-white shadow-2xl animate-fadeIn relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-50 animate-pulse"></div>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-ojk-red-light/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logos with dark background container */}
          <div className="flex items-center justify-center gap-4 mb-5 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10">
            <div className="bg-white rounded-lg p-2 shadow-md hover:scale-110 transition-transform duration-300 animate-slideInLeft">
              <Image
                src="/kopw.png"
                alt="KOPW"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-lg p-2 shadow-md hover:scale-110 transition-transform duration-300 animate-slideInRight">
              <Image
                src="/ojk.png"
                alt="OJK"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
          </div>

          <p className="text-sm font-medium opacity-90 mb-2 flex items-center gap-2">
            <span className="text-xl animate-bounce">👋</span>
            <span>{greeting}</span>
          </p>
          <h2 className="text-2xl font-bold leading-tight mb-2 tracking-tight">
            Portal Dokumen<br />Internal OJK
          </h2>
          <p className="text-xs opacity-90 leading-relaxed mb-3">
            Akses laporan & siaran pers terkini dari satu tempat. Download kapan saja, di mana saja.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] opacity-80">Update otomatis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span className="text-[10px] opacity-80">Akses 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori Dokumen</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">{activeCategories.length} kategori</span>
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
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Terbaru</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">Update otomatis</span>
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
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-card p-8 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada dokumen</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Dokumen akan muncul di sini setelah di-upload oleh admin
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 mt-8 pb-2">
        <p className="text-center text-[10px] text-gray-300 dark:text-gray-600">
          Buku Saku Infodoc · Khusus Internal
        </p>
      </div>
    </main>
  );
}
