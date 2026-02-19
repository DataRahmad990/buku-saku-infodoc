# 🚀 Setup Guide — Buku Saku Infodoc

## 1. Setup Supabase (5 menit)

### A. Buat project Supabase
1. Buka https://supabase.com → Login
2. Klik **New Project**
3. Isi nama project, password database, pilih region terdekat (Singapore)
4. Tunggu project siap (~2 menit)

### B. Buat tabel `documents`
1. Di Supabase Dashboard → klik **SQL Editor**
2. Copy-paste SQL ini, lalu klik **Run**:

```sql
CREATE TABLE documents (
  id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT    NOT NULL,
  category    TEXT    NOT NULL,
  month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year        INTEGER NOT NULL,
  description TEXT,
  file_url    TEXT    NOT NULL,
  file_name   TEXT    NOT NULL,
  file_type   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query cepat
CREATE INDEX idx_documents_category ON documents (category);
CREATE INDEX idx_documents_month_year ON documents (month, year);
CREATE INDEX idx_documents_created ON documents (created_at DESC);
```

### C. Buat Storage Bucket
1. Di Supabase Dashboard → klik **Storage**
2. Klik **New Bucket**
3. Nama: `documents`
4. Centang **Public bucket** → Save
5. Klik bucket `documents` → **Policies** → **New Policy**
6. Pilih **For full customization** → isi:
   - Policy name: `Allow public read`
   - Allowed operation: `SELECT`
   - Target roles: `public`
   - USING expression: `true`
   - Klik **Save policy**

### D. Ambil API Keys
1. Di Supabase Dashboard → **Settings** → **API**
2. Catat:
   - **Project URL** (contoh: `https://abcxyz.supabase.co`)
   - **anon public** key
   - **service_role** key (jangan share ini!)

---

## 2. Setup Environment Variables

Buat file `.env.local` di folder project ini:

```bash
# Isi sesuai data Supabase lo
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# Service Role Key (rahasia, untuk server-side upload)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# Secret URL untuk halaman upload
# Ini yang jadi bagian URL: websitelo.com/upload/NILAI_INI
# Contoh: ojk-infodoc-2026-rahasia
UPLOAD_SECRET_KEY=ganti-dengan-kode-rahasia-lo
```

---

## 3. Jalankan Lokal

```bash
npm run dev
```

Buka: http://localhost:3000

---

## 4. Test Upload

Buka: `http://localhost:3000/upload/NILAI_UPLOAD_SECRET_KEY_LO`

Contoh kalau secret key lo `ojk-infodoc-2026`:
→ `http://localhost:3000/upload/ojk-infodoc-2026`

---

## 5. Deploy ke Vercel (gratis)

1. Push project ke GitHub
2. Buka https://vercel.com → New Project → Import repo
3. Di **Environment Variables**, tambahkan semua key dari `.env.local`
4. Deploy!

URL upload akan jadi: `https://nama-project.vercel.app/upload/NILAI_SECRET_KEY`

---

## Struktur URL

| Halaman | URL |
|---------|-----|
| Beranda | `/` |
| Siaran Pers | `/siaran-pers` |
| Laporan Bulanan | `/laporan-bulanan` |
| Arsip | `/arsip` |
| Upload (admin) | `/upload/UPLOAD_SECRET_KEY` |
| Info | `/tentang` |

---

## Tambah Kategori Baru

Edit file `lib/supabase.ts`, tambahkan di `CATEGORIES`:

```typescript
nama_kategori: {
  label: "Nama Kategori",
  icon: "📌",
  description: "Deskripsi singkat",
},
```

Otomatis muncul di halaman beranda. Upload dokumen dengan kategori baru → langsung tersedia.
