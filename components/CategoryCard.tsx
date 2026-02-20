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
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-[0.98] p-4 border border-gray-50 hover:border-ojk-red/20 relative overflow-hidden">
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-ojk-red/5 to-ojk-red-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-ojk-red-pale to-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-ojk-red transition-colors duration-200">{label}</h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">{description}</p>
            {count !== undefined && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-ojk-red-pale to-white px-2.5 py-1 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <div className="w-1.5 h-1.5 bg-ojk-red rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-ojk-red">{count} dokumen</span>
              </div>
            )}
          </div>
          <div className="text-gray-300 group-hover:text-ojk-red flex-shrink-0 mt-1 group-hover:translate-x-1 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
