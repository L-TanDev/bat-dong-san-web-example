'use client';

import { MessageCircle } from 'lucide-react';

export default function ZaloFloat() {
  const zaloPhone = process.env.NEXT_PUBLIC_ADMIN_ZALO || '0912345678';
  
  return (
    <a 
      href={`https://zalo.me/${zaloPhone}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-7 right-7 w-[58px] h-[58px] rounded-full bg-gradient-to-br from-[#0068FF] to-[#0099FF] flex items-center justify-center text-white z-[500] shadow-2xl shadow-blue-500/40 zalo-pulse group"
      title="Liên hệ Zalo Admin"
    >
      <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-[#111118] border border-[#2A2A3A] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat với Admin qua Zalo
      </span>
    </a>
  );
}
