"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ title, showBack = false, backHref = "/" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 max-w-[430px] mx-auto">
        {showBack && (
          <Link
            href={backHref}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ojk-red-pale hover:text-ojk-red transition-all duration-200 text-gray-600 active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        {!showBack && (
          <div className="flex items-center gap-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-1.5 shadow-md">
            <Image
              src="/kopw.png"
              alt="KOPW Logo"
              width={36}
              height={36}
              className="object-contain bg-white rounded p-0.5"
            />
          </div>
        )}
        <h1 className="text-base font-bold text-gray-800 flex-1 truncate bg-gradient-to-r from-gray-800 to-ojk-red bg-clip-text text-transparent">{title}</h1>
      </div>
    </header>
  );
}
