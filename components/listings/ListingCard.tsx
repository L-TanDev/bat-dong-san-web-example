'use client';

import Link from 'next/link';
import { MapPin, Maximize2, BedDouble, Bath, Heart, MessageSquare, ArrowRight, Eye } from 'lucide-react';
import { useState } from 'react';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    price_unit: string;
    area: string;
    bedrooms: number | null;
    bathrooms: number | null;
    location: string;
    type: string;
    tag: string;
    tag_color: string;
    views: number;
    thumbnail?: string;
    likes?: number;
    comments_count?: number;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `${(price / 1000).toFixed(1)} tỷ`;
    return `${price} triệu`;
  };

  return (
    <div className="card-hover group">
      {/* Image Area */}
      <div className="h-[200px] bg-gradient-to-br from-[#1A1A2E] to-[#16213E] relative flex items-center justify-center overflow-hidden">
        {listing.thumbnail ? (
          <img 
            src={listing.thumbnail} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
            {listing.type === 'Căn hộ' ? '🏙️' : listing.type === 'Nhà phố' ? '🏠' : '🏖️'}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span 
            className="tag-badge backdrop-blur-md"
            style={{ 
              backgroundColor: `${listing.tag_color}25`, 
              color: listing.tag_color, 
              borderColor: `${listing.tag_color}40` 
            }}
          >
            {listing.tag}
          </span>
          <span className="bg-[#0F0F1E]/80 backdrop-blur-md border border-[#2A2A3A] px-2.5 py-0.5 rounded-full text-[10px] text-[#888] font-medium tracking-wider uppercase">
            {listing.type}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] text-[#AAA] border border-white/10">
          <Eye className="w-3 h-3" />
          {listing.views || 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2 min-h-[44px]">
            {listing.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 text-[#555] text-xs mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{listing.location}</span>
        </div>

        <div className="flex gap-2.5 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#1A1A2A] px-2.5 py-1.5 rounded-lg border border-[#2A2A3A]/50 text-[11px] text-[#888]">
            <Maximize2 className="w-3 h-3" /> {listing.area}m²
          </div>
          {listing.bedrooms && (
            <div className="flex items-center gap-1.5 bg-[#1A1A2A] px-2.5 py-1.5 rounded-lg border border-[#2A2A3A]/50 text-[11px] text-[#888]">
              <BedDouble className="w-3 h-3" /> {listing.bedrooms} PN
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center gap-1.5 bg-[#1A1A2A] px-2.5 py-1.5 rounded-lg border border-[#2A2A3A]/50 text-[11px] text-[#888]">
              <Bath className="w-3 h-3" /> {listing.bathrooms} WC
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1E1E2E]">
          <div>
            <div className="text-xl font-black text-[#FF6B35] tracking-tight">
              {formatPrice(listing.price)}
            </div>
            <div className="text-[10px] text-[#444] font-bold uppercase tracking-widest -mt-0.5">
              {listing.price_unit}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-xl border transition-all ${isLiked ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-[#1A1A2A] border-[#2A2A3A] text-[#666] hover:border-orange-500/50'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <Link 
              href={`/listings/${listing.id}#comments`}
              className="p-2.5 rounded-xl bg-[#1A1A2A] border border-[#2A2A3A] text-[#666] hover:border-blue-500/50 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <Link 
          href={`/listings/${listing.id}`}
          className="mt-5 w-full btn-primary !py-2.5 !px-4 !text-xs flex items-center justify-center gap-2 group/btn"
        >
          Xem chi tiết
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
