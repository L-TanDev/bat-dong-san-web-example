'use client';

import ListingForm from '@/components/listings/ListingForm';
import { ChevronLeft, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DangTinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-[5%]">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#555] hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Quay lại</span>
            </button>
            <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-4">
              Đăng tin <span className="bg-gradient-to-br from-[#FF6B35] to-[#FF9500] bg-clip-text text-transparent italic">mới</span>
            </h1>
            <p className="text-[#666] text-sm">Điền đầy đủ thông tin bên dưới để tiếp cận hàng nghìn khách hàng tiềm năng.</p>
          </div>

          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-4 flex items-start gap-4 max-w-sm">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">
              <span className="text-white font-bold">Mẹo:</span> Hình ảnh rõ nét và mô tả chi tiết sẽ giúp bài đăng của bạn được ưu tiên và thu hút nhiều cuộc gọi hơn.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-[#0D0D14] border border-[#1E1E2E] rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[100px] pointer-events-none" />
          
          <ListingForm />
        </div>
        
        {/* Footer info */}
        <div className="mt-12 text-center text-[#444] text-[10px] uppercase font-bold tracking-[2px]">
          BĐSViệt – Nền tảng Bất động sản Hiện đại & Uy tín
        </div>
      </div>
    </div>
  );
}
