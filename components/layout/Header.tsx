'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Plus, User, LogOut } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-[100] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-[#1A1A2E] px-[5%]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[68px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
            🏘️
          </div>
          <div className="hidden sm:block">
            <div className="font-extrabold text-lg tracking-tighter">
              BĐS<span className="text-[#FF6B35]">Việt</span>
            </div>
            <div className="text-[10px] text-[#555] tracking-[1px] uppercase -mt-1">
              Real Estate
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-10 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bất động sản..."
              className="w-full bg-[#141420] border border-[#2A2A3A] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#E8E8F0] outline-none focus:border-[#FF6B35] transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/tai-khoan" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center font-bold text-sm">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm text-[#CCC] hidden lg:block group-hover:text-white transition-colors">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-[#555] hover:text-red-500 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/?login=1" 
              className="px-5 py-2 rounded-xl border border-[#2A2A3A] text-sm text-[#888] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            >
              Đăng nhập
            </Link>
          )}
          
          <Link href="/dang-tin" className="btn-primary flex items-center gap-2 text-sm !px-4">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Đăng tin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
