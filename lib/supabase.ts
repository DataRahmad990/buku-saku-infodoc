import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Document = {
  id: string;
  title: string;
  category: string;
  month: number;
  year: number;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
};

export const CATEGORIES: Record<string, { label: string; icon: string; description: string }> = {
  siaran_pers: {
    label: "Siaran Pers",
    icon: "📰",
    description: "Dokumen siaran pers resmi",
  },
  laporan_bulanan: {
    label: "Laporan Bulanan",
    icon: "📊",
    description: "Laporan kegiatan bulanan",
  },
  info_pegawai: {
    label: "Info Pegawai",
    icon: "👥",
    description: "Informasi dan kebijakan kepegawaian",
  },
  arsip: {
    label: "Arsip",
    icon: "📂",
    description: "Dokumen arsip dan referensi",
  },
};

export const MONTHS: Record<number, string> = {
  1: "Januari",
  2: "Februari",
  3: "Maret",
  4: "April",
  5: "Mei",
  6: "Juni",
  7: "Juli",
  8: "Agustus",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};
