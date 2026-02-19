"use client";

import { MONTHS } from "@/lib/supabase";

interface MonthFilterProps {
  availableMonths: number[];
  selectedMonth: number | null;
  onSelect: (month: number | null) => void;
}

export default function MonthFilter({ availableMonths, selectedMonth, onSelect }: MonthFilterProps) {
  return (
    <div className="overflow-x-auto pb-1 -mx-4 px-4">
      <div className="flex gap-2 w-max">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            selectedMonth === null
              ? "bg-ojk-red text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Semua
        </button>
        {availableMonths.map((month) => (
          <button
            key={month}
            onClick={() => onSelect(month)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedMonth === month
                ? "bg-ojk-red text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {MONTHS[month]}
          </button>
        ))}
      </div>
    </div>
  );
}
