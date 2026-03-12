'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Phone, Mail, MessageCircle, Lock, Loader2, CheckCircle2 } from 'lucide-react';

interface ContactDrawerProps {
  listingId: string;
  posterInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function ContactDrawer({ listingId, posterInfo }: ContactDrawerProps) {
  const [showRealInfo, setShowRealInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const supabase = createClient();

  const handleReveal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      window.location.href = `/?login=1`;
      return;
    }

    setLoading(true);
    
    // Log contact request in DB
    const { error } = await supabase
      .from('contact_requests')
      .insert([{
        listing_id: listingId,
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        phone: user.phone || '',
        email: user.email || ''
      }]);

    setShowRealInfo(true);
    setLoading(false);
    setHasSubmitted(true);
  };

  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-6 shadow-2xl sticky top-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center text-xl">
          👤
        </div>
        <div>
          <div className="text-xs text-[#555] uppercase font-bold tracking-widest mb-0.5">Người đăng</div>
          <div className="font-bold text-lg">{posterInfo.name}</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Zalo - Always available if configured */}
        <a 
          href={`https://zalo.me/${posterInfo.phone}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#0068FF] hover:bg-[#0058DD] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
        >
          <MessageCircle className="w-5 h-5" />
          Chat qua Zalo
        </a>

        {/* Protected Info */}
        {!showRealInfo ? (
          <button 
            onClick={handleReveal}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2.5 !py-3.5 !rounded-2xl"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Hiện SĐT & Email
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            <div className="bg-[#1A1A2A] border border-[#22C55E]/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-2.5 bg-green-500/10 rounded-xl text-green-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-green-500/60 uppercase font-bold tracking-widest mb-0.5">Số điện thoại</div>
                <div className="font-black text-white tracking-widest">{posterInfo.phone}</div>
              </div>
            </div>

            <div className="bg-[#1A1A2A] border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-blue-500/60 uppercase font-bold tracking-widest mb-0.5">Email liên hệ</div>
                <div className="font-bold text-white text-sm truncate">{posterInfo.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-center text-[10px] text-green-500 font-bold uppercase tracking-wider py-2">
              <CheckCircle2 className="w-3 h-3" /> Đã gửi thông tin của bạn cho chủ nhà
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-[10px] text-[#444] text-center leading-relaxed">
        Bằng việc nhấn Xem SĐT, chúng tôi sẽ chia sẻ thông tin liên hệ của bạn với chủ bài đăng này để họ có thể liên hệ lại.
      </p>
    </div>
  );
}
