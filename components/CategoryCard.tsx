import Link from "next/link";

interface CategoryCardProps {
  href: string;
  icon: string;
  label: string;
  description: string;
  count?: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  siaran_pers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
    </svg>
  ),
  laporan_bulanan: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2v4H8zM12 11h2v6h-2z" />
    </svg>
  ),
  info_pegawai: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  arsip: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
};

function getCategoryKey(href: string): string {
  return href.replace("/", "").replace(/-/g, "_");
}

export default function CategoryCard({ href, icon, label, description, count }: CategoryCardProps) {
  const key = getCategoryKey(href);
  const svgIcon = ICON_MAP[key];

  return (
    <Link href={href} className="block group">
      <div className="glass p-4 active:scale-[0.98]">
        <div className="flex items-center gap-3.5">
          {/* Icon container */}
          <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-[rgb(var(--accent))] group-hover:text-white group-hover:shadow-accent-sm transition-all duration-300 group-hover:scale-105">
            {svgIcon || <span className="text-lg">{icon}</span>}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-primary text-[14px] tracking-[-0.01em] truncate group-hover:text-accent transition-colors duration-200">
                {label}
              </h3>
              {count !== undefined && count > 0 && (
                <span className="badge bg-accent-soft text-accent text-[10px] font-bold">
                  {count}
                </span>
              )}
            </div>
            <p className="text-[11px] text-tertiary mt-0.5 line-clamp-1 leading-relaxed">{description}</p>
          </div>

          {/* Chevron */}
          <div className="w-8 h-8 rounded-xl bg-recessed flex items-center justify-center text-quaternary group-hover:text-accent group-hover:bg-accent-soft flex-shrink-0 group-hover:translate-x-0.5 transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
