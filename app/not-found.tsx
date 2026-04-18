import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-4xl bg-recessed flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-quaternary">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="8" x2="14" y2="14" />
          <line x1="14" y1="8" x2="8" y2="14" />
        </svg>
      </div>
      <h2 className="font-serif text-[24px] text-primary tracking-[-0.02em]">Tidak Ditemukan</h2>
      <p className="text-[13px] text-tertiary mt-2 mb-8 max-w-[240px] leading-relaxed">
        Halaman yang kamu cari tidak ada atau sudah dipindah.
      </p>
      <Link
        href="/"
        className="bg-[rgb(var(--accent))] text-white px-7 py-3.5 rounded-2xl font-semibold text-[13px] hover:shadow-accent-sm active:scale-[0.97] transition-all duration-200"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
