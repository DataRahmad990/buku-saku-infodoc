import Header from "@/components/Header";

export const metadata = {
  title: "Tentang — Buku Saku Infodoc",
};

export default function TentangPage() {
  return (
    <main className="pb-32">
      <Header title="Tentang" showBack backHref="/" />

      <div className="px-4 mt-3 flex flex-col gap-3">
        {/* Identity card */}
        <div className="rounded-4xl overflow-hidden relative noise" style={{ minHeight: 180 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-ojk-red via-ojk-red-dark to-stone-950" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 p-7 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-medium mb-4">
              <span className="text-ojk-red text-[14px] font-extrabold tracking-tight">OJK</span>
            </div>
            <h2 className="font-serif text-[24px] font-normal text-white tracking-[-0.02em]">Buku Saku Infodoc</h2>
            <p className="text-white/40 text-[12px] font-medium mt-1">Portal Dokumen Internal</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-[10px] font-medium text-white/65">v1.0 &middot; OJK Purwokerto</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-4 bg-[rgb(var(--accent))] rounded-full" />
            <h3 className="text-[13px] font-bold text-primary tracking-[-0.01em]">Tentang Aplikasi</h3>
          </div>
          <p className="text-[13px] text-secondary leading-[1.7]">
            Portal dokumen internal yang memudahkan distribusi laporan, siaran pers, dan dokumen kerja antar staf. Buka link di HP kapanpun.
          </p>
        </div>

        {/* How to use */}
        <div className="glass p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-1 h-4 bg-[rgb(var(--accent))] rounded-full" />
            <h3 className="text-[13px] font-bold text-primary tracking-[-0.01em]">Cara Penggunaan</h3>
          </div>
          <div className="flex flex-col gap-5">
            {[
              {
                step: "01",
                title: "Pilih Kategori",
                desc: "Buka kategori dari halaman beranda",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Filter Bulan",
                desc: "Filter untuk menemukan dokumen yang tepat",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Baca atau Download",
                desc: "Baca di browser atau simpan ke perangkat",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-accent-soft flex items-center justify-center flex-shrink-0 text-accent">
                  {item.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-quaternary tracking-widest">{item.step}</span>
                    <h4 className="text-[13px] font-semibold text-primary tracking-[-0.01em]">{item.title}</h4>
                  </div>
                  <p className="text-[12px] text-tertiary mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="glass p-4 border-dashed border-default">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-recessed flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-[11px] text-tertiary leading-relaxed">
              Hanya untuk penggunaan internal OJK. Dilarang menyebarkan link ke pihak luar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
