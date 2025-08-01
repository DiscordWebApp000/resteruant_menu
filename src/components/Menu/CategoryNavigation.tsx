'use client';

import { MenuCategory } from '@/types';

interface CategoryNavigationProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryNavigation({ categories, activeCategory, onCategoryChange }: CategoryNavigationProps) {
  // Kategorileri sıraya göre sırala
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-white/40 to-orange-50/30" />
      
      <div className="relative overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 min-w-max">
          {sortedCategories.map((category, index) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-500 min-w-0 touch-manipulation group overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white shadow-xl shadow-orange-500/40 scale-105 transform'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-white hover:text-gray-900 hover:scale-105 hover:shadow-lg'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active button glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 animate-pulse" />
                )}
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                
                <span className="relative z-10">{category.name}</span>
                
                {/* Item count badge */}
                <span className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs font-bold transition-colors duration-300
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                  }
                `}>
                  {category.items.filter(item => item.available).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
    </div>
  );
} 