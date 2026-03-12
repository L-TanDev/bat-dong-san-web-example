'use client';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const categories = ["Tất cả", "Căn hộ", "Nhà phố", "Đất nền", "Biệt thự", "Văn phòng", "Shophouse"];

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  count: number;
}

export default function FilterBar({ activeCategory, setActiveCategory, count }: FilterBarProps) {
  return (
    <div className="sticky top-[68px] z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#1A1A2E] px-[5%] py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF9500] border-transparent text-white shadow-lg shadow-orange-500/20'
                  : 'bg-transparent border-[#2A2A3A] text-[#888] hover:border-[#FF6B35] hover:text-[#FF6B35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Count */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-[#1A1A2E] pt-3 md:pt-0">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-white transition-colors group">
              <SlidersHorizontal className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              Lọc nâng cao
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-white transition-colors">
              Mới nhất
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-[#1A1A2E] hidden md:block" />
          
          <div className="text-[10px] font-black uppercase tracking-[1.5px] text-[#444]">
            {count} <span className="text-[#333]">kết quả</span>
          </div>
        </div>
      </div>
    </div>
  );
}
