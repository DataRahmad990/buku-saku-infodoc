"use client";

import { useState } from "react";
import MonthFilter from "@/components/MonthFilter";
import DocumentCard from "@/components/DocumentCard";
import type { Document } from "@/lib/supabase";

interface CategoryClientProps {
  documents: Document[];
  availableMonths: number[];
}

export default function CategoryClient({ documents, availableMonths }: CategoryClientProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const filtered = selectedMonth
    ? documents.filter((d) => d.month === selectedMonth)
    : documents;

  return (
    <div>
      {availableMonths.length > 0 && (
        <div className="px-4 mt-4">
          <MonthFilter
            availableMonths={availableMonths}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </div>
      )}

      <div className="px-4 mt-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm font-medium text-gray-500">
              {selectedMonth ? "Tidak ada dokumen di bulan ini" : "Belum ada dokumen"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Dokumen akan muncul setelah di-upload oleh admin
            </p>
          </div>
        ) : (
          filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
      </div>

      {filtered.length > 0 && (
        <div className="px-4 mt-4 pb-2">
          <p className="text-center text-[10px] text-gray-300">
            Menampilkan {filtered.length} dari {documents.length} dokumen
          </p>
        </div>
      )}
    </div>
  );
}
