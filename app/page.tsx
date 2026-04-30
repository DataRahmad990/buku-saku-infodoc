import { supabase, CATEGORIES } from "@/lib/supabase";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import DocumentCard from "@/components/DocumentCard";
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
    ([key]) => (categoryCounts[key] || 0) > 0 || key === "siaran_pers" || key === "factsheet"
  );

  const totalDocs = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <main className="pb-32 relative">
      <Header title="Buku Saku" />

      {/* Hero Card */}
      <div className="mx-4 mt-3 rounded-4xl overflow-hidden relative noise" style={{ minHeight: 220 }}>
        {/* Photo background */}
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ojk-red/90 via-ojk-red-dark/85 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: 220 }}>
          {/* Top */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-md px-3 py-1 rounded-full mb-4">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-slow" />
              <span className="text-[10px] text-white/80 font-medium tracking-wide">{greeting}</span>
            </div>
            <h2 className="font-serif text-[32px] text-white leading-[0.95] tracking-[-0.03em]">
              Portal<br />Dokumen
            </h2>
            <p className="text-[12px] text-white/50 mt-2 max-w-[220px] leading-relaxed">
              Akses laporan & siaran pers terkini dari satu tempat.
            </p>
          </div>

          {/* Bottom stats row */}
          <div className="flex items-center gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 flex-1">
              <p className="text-[22px] font-bold text-white leading-none tracking-tight">{totalDocs}</p>
              <p className="text-[10px] text-white/45 font-medium mt-1 uppercase tracking-wider">Dokumen</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 flex-1">
              <p className="text-[22px] font-bold text-white leading-none tracking-tight">{activeCategories.length}</p>
              <p className="text-[10px] text-white/45 font-medium mt-1 uppercase tracking-wider">Kategori</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-glow" />
              </div>
              <p className="text-[10px] text-white/45 font-medium mt-1 uppercase tracking-wider">Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 mt-8">
        <div className="flex items-center gap-2.5 mb-4 pl-0.5">
          <div className="w-1 h-5 bg-ojk-red rounded-full" />
          <h2 className="text-[14px] font-bold text-primary tracking-[-0.01em]">Kategori</h2>
          <div className="flex-1" />
          <span className="text-[11px] text-tertiary">{activeCategories.length} aktif</span>
        </div>
        <div className="flex flex-col gap-2">
          {activeCategories.map(([key, cat], i) => (
            <div key={key} className={`animate-enter stagger-${i + 1}`} style={{ opacity: 0 }}>
              <CategoryCard
                href={`/${key.replace("_", "-")}`}
                icon={cat.icon}
                label={cat.label}
                description={cat.description}
                count={categoryCounts[key]}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Documents */}
      {recentDocs.length > 0 && (
        <section className="px-4 mt-8">
          <div className="flex items-center gap-2.5 mb-4 pl-0.5">
            <div className="w-1 h-5 bg-ojk-red rounded-full" />
            <h2 className="text-[14px] font-bold text-primary tracking-[-0.01em]">Terbaru</h2>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-slow" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Realtime</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {recentDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {recentDocs.length === 0 && (
        <section className="px-4 mt-8">
          <div className="glass p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-recessed flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-secondary">Belum ada dokumen</p>
            <p className="text-[12px] text-tertiary mt-1.5 max-w-[200px]">
              Dokumen akan muncul di sini setelah di-upload admin
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="px-8 mt-12 pb-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgb(var(--border-0))]" />
          <p className="text-[9px] text-quaternary font-semibold tracking-[0.15em] uppercase">
            Internal Only
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgb(var(--border-0))]" />
        </div>
      </div>
    </main>
  );
}
