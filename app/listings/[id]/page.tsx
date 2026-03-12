'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ChevronLeft, MapPin, Maximize2, BedDouble, Bath, 
  Share2, Heart, Calendar, Eye, Loader2 
} from 'lucide-react';
import CommentSection from '@/components/comments/CommentSection';
import ContactDrawer from '@/components/listings/ContactDrawer';

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch Listing
      const { data: listingData } = await supabase
        .from('listings')
        .select('*, profiles(full_name, avatar_url, phone, email)')
        .eq('id', id)
        .single();

      // Fetch Comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('listing_id', id)
        .order('created_at', { ascending: false });

      if (listingData) {
        setListing(listingData);
      } else {
        // Mock fallback for demo
        setListing({
          id,
          title: "Căn hộ cao cấp Vinhomes Central Park",
          description: "Căn hộ view sông Sài Gòn, nội thất cao cấp, tầng 18, ban công rộng 8m². Đầy đủ tiện ích hồ bơi, gym, công viên ven sông.\n\nThông tin chi tiết:\n- Tình trạng: Sẵn sàng dọn vào\n- Pháp lý: Sổ hồng riêng\n- Hướng: Đông Nam mát mẻ\n- Phí quản lý: Miễn phí năm đầu",
          price: 4500,
          price_unit: "VNĐ",
          area: "85",
          bedrooms: 3,
          bathrooms: 2,
          location: "Bình Thạnh, TP.HCM",
          type: "Căn hộ",
          tag: "Nổi bật",
          tag_color: "#FF6B35",
          views: 312,
          created_at: "2024-03-12T00:00:00.000Z",
          profiles: {
            full_name: "Nguyễn Văn An",
            phone: "0912345678",
            email: "an.nguyen@example.com"
          }
        });
      }

      if (commentsData) setComments(commentsData);
      
      setLoading(false);
    }

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
        <span className="text-xs font-bold text-[#444] uppercase tracking-[3px]">Đang tải chi tiết...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-[5%] py-8 animate-fadeIn">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#555] hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2">
          {/* Gallery Mockup */}
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl relative flex items-center justify-center overflow-hidden mb-8 border border-[#1E1E2E]">
            <div className="text-9xl opacity-20 transform -rotate-12 transition-transform hover:scale-110 duration-700">
              {listing.type === 'Căn hộ' ? '🏙️' : '🏠'}
            </div>
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="tag-badge bg-white/10 backdrop-blur-md border-white/20 text-white !px-4 !py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {listing.status || 'Đang mở'}
              </span>
            </div>
          </div>

          {/* Title & Stats */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4 tracking-tight">
              {listing.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#888]">
              <div className="flex items-center gap-2 text-[#CCC]">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                {listing.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Đăng ngày <span suppressHydrationWarning>{new Date(listing.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {listing.views} lượt xem
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Maximize2 />, label: 'Diện tích', value: `${listing.area}m²` },
              { icon: <BedDouble />, label: 'Phòng ngủ', value: listing.bedrooms ? `${listing.bedrooms} PN` : 'N/A' },
              { icon: <Bath />, label: 'Phòng tắm', value: listing.bathrooms ? `${listing.bathrooms} WC` : 'N/A' },
              { icon: <Arrow90 />, label: 'Loại hình', value: listing.type },
            ].map((item, i) => (
              <div key={i} className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-4 hover:border-[#FF6B35]/30 transition-all">
                <div className="text-[#FF6B35] mb-2">{item.icon}</div>
                <div className="text-[10px] text-[#444] uppercase font-bold tracking-widest mb-1">{item.label}</div>
                <div className="font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">Mô tả chi tiết</h3>
            <div className="bg-[#111118]/50 border border-[#1E1E2E] rounded-3xl p-8 text-[#AAA] leading-relaxed text-sm whitespace-pre-wrap">
              {listing.description}
            </div>
          </div>

          {/* Comment Section Component */}
          <CommentSection listingId={listing.id} initialComments={comments} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <ContactDrawer 
            listingId={listing.id} 
            posterInfo={{
              name: listing.profiles?.full_name || 'Người đăng',
              phone: listing.profiles?.phone || '0912345678',
              email: listing.profiles?.email || 'contact@example.com'
            }} 
          />

          <div className="mt-8 flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A2A] border border-[#2A2A3A] rounded-2xl text-xs font-bold text-[#888] hover:text-white hover:border-[#FF6B35]/50 transition-all">
              <Share2 className="w-4 h-4" /> Chia sẻ
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A2A] border border-[#2A2A3A] rounded-2xl text-xs font-bold text-[#888] hover:text-white hover:border-[#FF6B35]/50 transition-all">
              <Heart className="w-4 h-4" /> Yêu thích
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Icon for type info
function Arrow90() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20" />
    </svg>
  );
}
