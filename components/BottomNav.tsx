"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Beranda",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
        {active && <rect x="9" y="12" width="6" height="10" fill="rgb(var(--surface-1))" rx="1" />}
        {!active && <polyline points="9 22 9 12 15 12 15 22" />}
      </svg>
    ),
  },
  {
    href: "/siaran-pers",
    label: "Dokumen",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.75" fill="none" />
        <line x1="16" y1="13" x2="8" y2="13" stroke={active ? "rgb(var(--surface-1))" : "currentColor"} strokeWidth="1.75" />
        <line x1="16" y1="17" x2="8" y2="17" stroke={active ? "rgb(var(--surface-1))" : "currentColor"} strokeWidth="1.75" />
      </svg>
    ),
  },
  {
    href: "/tentang",
    label: "Info",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="8.01" stroke={active ? "rgb(var(--surface-1))" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="12" x2="12" y2="16" stroke={active ? "rgb(var(--surface-1))" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-[430px] mx-auto px-4 pb-4 pointer-events-auto">
        <div className="bg-[rgb(var(--glass))]/80 backdrop-blur-2xl border border-default rounded-3xl shadow-dock safe-bottom overflow-hidden">
          <div className="flex items-center px-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all duration-250 relative ${
                    isActive ? "text-accent" : "text-tertiary"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full bg-[rgb(var(--accent))]" />
                  )}
                  <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                    {item.icon(isActive)}
                  </div>
                  <span className={`text-[9px] font-semibold tracking-wide transition-colors ${
                    isActive ? "text-accent" : "text-quaternary"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
