'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/layout/Hero';
import FilterBar from '@/components/filters/FilterBar';
import ListingCard from '@/components/listings/ListingCard';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// Mock data until DB is populated
const mockListings = [
  {
    id: '1',
    title: "Căn hộ cao cấp Vinhomes Central Park",
    price: 4500, // mil
    price_unit: "VNĐ",
    area: "85",
    bedrooms: 3,
    bathrooms: 2,
    location: "Bình Thạnh, TP.HCM",
    type: "Căn hộ",
    tag: "Nổi bật",
    tag_color: "#FF6B35",
    views: 312,
  },
  {
    id: '2',
    title: "Nhà phố 3 tầng Quận 7 – Gần Phú Mỹ Hưng",
    price: 8200,
    price_unit: "VNĐ",
    area: "120",
    bedrooms: 4,
    bathrooms: 3,
    location: "Quận 7, TP.HCM",
    type: "Nhà phố",
    tag: "Mới đăng",
    tag_color: "#22C55E",
    views: 145,
  },
  {
    id: '3',
    title: "Đất nền biệt thự Đà Nẵng – View biển Mỹ Khê",
    price: 6800,
    price_unit: "VNĐ",
    area: "200",
    bedrooms: null,
    bathrooms: null,
    location: "Ngũ Hành Sơn, Đà Nẵng",
    type: "Đất nền",
    tag: "Hot",
    tag_color: "#EF4444",
    views: 891,
  },
  {
    id: '4',
    title: "Văn phòng cho thuê Quận 1 – Tòa nhà hạng A",
    price: 45,
    price_unit: "/tháng",
    area: "150",
    bedrooms: null,
    bathrooms: 2,
    location: "Quận 1, TP.HCM",
    type: "Văn phòng",
    tag: "Cho thuê",
    tag_color: "#8B5CF6",
    views: 88,
  },
  {
    id: '5',
    title: "Biệt thự nghỉ dưỡng Đà Lạt – Thung lũng xanh",
    price: 12000,
    price_unit: "VNĐ",
    area: "350",
    bedrooms: 5,
    bathrooms: 4,
    location: "Lạc Dương, Đà Lạt",
    type: "Biệt thự",
    tag: "Cao cấp",
    tag_color: "#F59E0B",
    views: 1204,
  },
  {
    id: '6',
    title: "Shophouse Mặt tiền Nguyễn Huệ",
    price: 25000,
    price_unit: "VNĐ",
    area: "90",
    bedrooms: 3,
    bathrooms: 2,
    location: "Quận 1, TP.HCM",
    type: "Shophouse",
    tag: "Đầu tư",
    tag_color: "#06B6D4",
    views: 567,
  },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      
      // Try fetching from real Supabase
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setListings(data);
      } else {
        // Fallback to mock data if DB is empty
        setListings(mockListings);
      }
      
      setLoading(false);
    }

    fetchListings();
  }, []);

  const filteredListings = activeCategory === "Tất cả" 
    ? listings 
    : listings.filter(l => l.type === activeCategory);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <Hero />

      {/* Filter Section */}
      <FilterBar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        count={filteredListings.length}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-[5%] py-12 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
            <span className="text-sm font-bold text-[#444] uppercase tracking-widest">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
        
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🏜️</div>
            <h3 className="text-xl font-bold mb-2">Không tìm thấy bài đăng nào</h3>
            <p className="text-[#666] text-sm md:text-base">Hãy thử đổi bộ lọc hoặc quay lại sau nhé!</p>
          </div>
        )}
      </main>
    </div>
  );
}
