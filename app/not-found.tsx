import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-gray-400 mb-6">
        Halaman yang kamu cari tidak ada atau sudah dipindah.
      </p>
      <Link
        href="/"
        className="bg-ojk-red text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-ojk-red-dark transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
