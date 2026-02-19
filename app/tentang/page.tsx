import Header from "@/components/Header";

export const metadata = {
  title: "Tentang — Buku Saku Infodoc",
};

export default function TentangPage() {
  return (
    <main className="pb-24">
      <Header title="Tentang" showBack backHref="/" />

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* App Info */}
        <div className="bg-gradient-to-br from-ojk-red to-ojk-red-dark rounded-2xl p-6 text-white text-center shadow-md">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-ojk-red text-xl font-bold">OJK</span>
          </div>
          <h2 className="text-lg font-bold">Buku Saku Infodoc</h2>
          <p className="text-xs opacity-75 mt-1">Portal Dokumen Internal</p>
        </div>

        {/* Info Cards */}
        <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">Tentang Aplikasi</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Buku Saku Infodoc adalah portal dokumen internal yang memudahkan
            distribusi laporan, siaran pers, dan dokumen kerja antar staf.
            Cukup buka link di HP — dokumen tersedia kapan saja.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Cara Penggunaan</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: "📂", title: "Pilih Kategori", desc: "Buka kategori dokumen yang diinginkan dari halaman beranda" },
              { icon: "📅", title: "Filter Bulan", desc: "Gunakan filter bulan untuk menemukan dokumen yang relevan" },
              { icon: "⬇️", title: "Download", desc: "Tekan tombol download untuk menyimpan file ke perangkat" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Aplikasi ini hanya untuk penggunaan internal.<br />
            Dilarang menyebarkan link ke pihak luar.
          </p>
        </div>
      </div>
    </main>
  );
}
