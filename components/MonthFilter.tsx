"use client";

import { MONTHS } from "@/lib/supabase";

interface MonthFilterProps {
  availableMonths: number[];
  selectedMonth: number | null;
  onSelect: (month: number | null) => void;
}

export default function MonthFilter({ availableMonths, selectedMonth, onSelect }: MonthFilterProps) {
  return (
    <div className="overflow-x-auto -mx-5 px-5 scrollbar-hide">
      <div className="flex gap-1.5 w-max">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-all whitespace-nowrap active:scale-95 ${
            selectedMonth === null
              ? "bg-[rgb(var(--accent))] text-white shadow-accent-sm"
              : "bg-[rgb(var(--surface-1))] border border-default text-secondary hover:border-[rgb(var(--accent))]/30 hover:text-accent"
          }`}
        >
          Semua
        </button>
        {availableMonths.map((month) => (
          <button
            key={month}
            onClick={() => onSelect(month)}
            className={`px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-all whitespace-nowrap active:scale-95 ${
              selectedMonth === month
                ? "bg-[rgb(var(--accent))] text-white shadow-accent-sm"
                : "bg-[rgb(var(--surface-1))] border border-default text-secondary hover:border-[rgb(var(--accent))]/30 hover:text-accent"
            }`}
          >
            {MONTHS[month]}
          </button>
        ))}
      </div>
    </div>
  );
}
