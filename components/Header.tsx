"use client";

import Link from "next/link";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ title, showBack = false, backHref = "/" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 max-w-[430px] mx-auto">
        {showBack && (
          <Link
            href={backHref}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        {!showBack && (
          <div className="w-9 h-9 flex items-center justify-center">
            <div className="w-7 h-7 bg-ojk-red rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-none">OJK</span>
            </div>
          </div>
        )}
        <h1 className="text-base font-semibold text-gray-800 flex-1 truncate">{title}</h1>
      </div>
    </header>
  );
}
