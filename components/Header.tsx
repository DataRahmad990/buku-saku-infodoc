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
    <header className="sticky top-0 z-50 bg-[rgb(var(--surface-0))]/70 backdrop-blur-2xl border-b border-default">
      <div className="flex items-center gap-3 px-4 py-3 max-w-[430px] mx-auto">
        {showBack ? (
          <Link
            href={backHref}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-recessed hover:bg-accent-soft text-secondary hover:text-accent transition-all duration-200 active:scale-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-elevated shadow-subtle border border-default flex items-center justify-center overflow-hidden">
              <Image src="/ojk.png" alt="OJK" width={28} height={28} className="object-contain" />
            </div>
            <div className="w-[2.5px] h-5 rounded-full bg-gradient-to-b from-ojk-red to-ojk-red-dark" />
            <div className="w-9 h-9 rounded-xl bg-elevated shadow-subtle border border-default flex items-center justify-center overflow-hidden">
              <Image src="/kopw.png" alt="KOPW" width={28} height={28} className="object-contain" />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 ml-0.5">
          <h1 className="text-[16px] font-bold text-primary tracking-[-0.02em] truncate">{title}</h1>
          {!showBack && (
            <p className="text-[10px] text-quaternary font-semibold tracking-[0.08em] uppercase mt-0.5">Kantor OJK Purwokerto</p>
          )}
        </div>
      </div>
    </header>
  );
}
