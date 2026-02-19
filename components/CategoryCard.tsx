import Link from "next/link";

interface CategoryCardProps {
  href: string;
  icon: string;
  label: string;
  description: string;
  count?: number;
}

export default function CategoryCard({ href, icon, label, description, count }: CategoryCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 active:scale-95 p-4 border border-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-ojk-red-pale rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{label}</h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{description}</p>
            {count !== undefined && (
              <div className="mt-2 inline-flex items-center gap-1 bg-ojk-red-pale px-2 py-0.5 rounded-full">
                <span className="text-[10px] font-medium text-ojk-red">{count} dokumen</span>
              </div>
            )}
          </div>
          <div className="text-gray-300 flex-shrink-0 mt-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
