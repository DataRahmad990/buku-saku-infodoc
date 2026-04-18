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
      {availableMonths.length > 1 && (
        <div className="px-5 mb-4">
          <MonthFilter
            availableMonths={availableMonths}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </div>
      )}

      <div className="px-4 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="glass p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-3xl bg-recessed flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-secondary">
              {selectedMonth ? "Tidak ada dokumen" : "Belum ada dokumen"}
            </p>
            <p className="text-[12px] text-tertiary mt-1">
              {selectedMonth ? "Coba pilih bulan lain" : "Upload dokumen lewat admin"}
            </p>
          </div>
        ) : (
          filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-[10px] text-quaternary mt-4 px-4">
          {filtered.length} dari {documents.length} dokumen
        </p>
      )}
    </div>
  );
}
