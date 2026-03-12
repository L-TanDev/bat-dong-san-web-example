'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Building2, Users, Heart, Settings, 
  MapPin, Eye, MessageSquare, Phone, 
  Mail, Calendar, Loader2, ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function TaiKhoanPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'leads'>('listings');
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch User's Listings
        const { data: userListings } = await supabase
          .from('listings')
          .select('*, listing_images(url)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setListings(userListings || []);

        // Fetch Leads (Contact Requests) for User's Listings
        const { data: userLeads } = await supabase
          .from('contact_requests')
          .select('*, listings(title)')
          .in('listing_id', (userListings || []).map(l => l.id))
          .order('created_at', { ascending: false });

        setLeads(userLeads || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0A0A0F]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
        <span className="text-xs font-bold text-[#444] uppercase tracking-[3px]">Đang tải dữ liệu cá nhân...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-[5%]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-[40px] p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent" />
          
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20">
            {user?.email?.[0].toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black mb-2 tracking-tight">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#666]">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user?.phone || 'Chưa cập nhật SĐT'}</div>
              <div className="flex items-center gap-2 bg-[#1A1A2A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">Thành viên</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="p-4 bg-[#1A1A2A] border border-[#2A2A3A] rounded-2xl text-[#888] hover:text-white hover:border-white/20 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <Link href="/dang-tin" className="btn-primary flex items-center gap-2 py-4 px-8">
              <ArrowUpRight className="w-5 h-5" /> Đăng tin mới
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Tin đã đăng', value: listings.length, icon: <Building2 className="w-5 h-5" />, color: 'text-blue-500' },
            { label: 'Người quan tâm', value: leads.length, icon: <Users className="w-5 h-5" />, color: 'text-green-500' },
            { label: 'Lượt yêu thích', value: '124', icon: <Heart className="w-5 h-5" />, color: 'text-pink-500' },
            { label: 'Tổng lượt xem', value: listings.reduce((acc, l) => acc + (l.views || 0), 0), icon: <Eye className="w-5 h-5" />, color: 'text-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-6 hover:translate-y-[-4px] transition-all">
              <div className={`${stat.color} mb-4`}>{stat.icon}</div>
              <div className="text-2xl font-black mb-1">{stat.value}</div>
              <div className="text-[10px] text-[#444] font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-[#1E1E2E]">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'listings' ? 'text-[#FF6B35]' : 'text-[#444] hover:text-[#888]'}`}
          >
            Quản lý tin đăng
            {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B35] animate-fadeIn" />}
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'leads' ? 'text-[#FF6B35]' : 'text-[#444] hover:text-[#888]'}`}
          >
            Khách hàng quan tâm
            {activeTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B35] animate-fadeIn" />}
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'listings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map(l => (
                <div key={l.id} className="bg-[#111118] border border-[#1E1E2E] rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-xl group">
                  <div className="sm:w-48 h-40 bg-[#1A1A2A] relative flex items-center justify-center">
                    {l.listing_images?.[0] ? (
                      <img src={l.listing_images[0].url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="text-4xl opacity-20">🏘️</div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-[#AAA] font-bold">
                      {l.status === 'active' ? 'ĐANG HIỆN' : 'ĐÃ ẨN'}
                    </div>
                  </div>
                  <div className="flex-1 p-6 relative">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{l.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#555] mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {l.location}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-lg font-black text-[#FF6B35]">{l.price} {l.price_unit}</div>
                      <Link href={`/listings/${l.id}`} className="p-3 bg-[#1A1A2A] rounded-xl text-[#888] hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {listings.length === 0 && (
                <div className="col-span-1 md:col-span-2 py-20 bg-[#111118]/50 border-2 border-dashed border-[#1E1E2E] rounded-[40px] text-center">
                  <div className="text-4xl mb-4 opacity-20 text-center">🏜️</div>
                  <p className="text-[#666] font-bold uppercase tracking-widest text-xs">Bạn chưa đăng tin nào</p>
                  <Link href="/dang-tin" className="text-[#FF6B35] text-sm mt-4 inline-block font-bold hover:underline decoration-2">Đăng bài ngay →</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map(lead => (
                <div key={lead.id} className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 group animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A1A2A] flex items-center justify-center text-xl text-[#555] group-hover:bg-[#FF6B35]/10 group-hover:text-[#FF6B35] transition-all">
                    👤
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-xs text-[#444] font-bold uppercase tracking-widest mb-1">Tin: {lead.listings?.title}</div>
                    <h4 className="font-bold text-lg mb-1">{lead.name}</h4>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#666]">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#222]" /> {lead.phone}</div>
                      <div className="flex items-center gap-2 text-blue-500/80 underline decoration-blue-500/20"><Mail className="w-3.5 h-3.5" /> {lead.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#444] font-bold uppercase tracking-[2px] mb-2">{new Date(lead.created_at).toLocaleDateString()}</div>
                    <button className="text-xs font-bold text-[#FF6B35] bg-orange-500/10 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-all">
                      Ghi chú
                    </button>
                  </div>
                </div>
              ))}

              {leads.length === 0 && (
                <div className="py-20 text-center text-[#444] font-bold uppercase tracking-widest text-xs">
                  Chưa có ai liên hệ với bạn.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
