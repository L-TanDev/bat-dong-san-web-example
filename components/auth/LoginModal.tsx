'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === '1') {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    // Clear URL param without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('login');
    window.history.replaceState({}, '', url.toString());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        // Option to sign up if not exists (simplified for demo)
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: email.split('@')[0] }
          }
        });
        
        if (signUpError) {
          setMessage({ type: 'error', text: signUpError.message });
        } else {
          setMessage({ type: 'success', text: 'Tài khoản mới đã được tạo! Hãy đăng nhập.' });
        }
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    } else {
      handleClose();
      router.refresh();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-[#111118] border border-[#2A2A3A] w-full max-w-md rounded-2xl p-8 shadow-2xl relative animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#555] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF9500] mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
            🔐
          </div>
          <h2 className="text-2xl font-bold mb-2">Đăng nhập tài khoản</h2>
          <p className="text-sm text-[#666]">
            Đăng nhập để bình luận, yêu thích và đăng tin bất động sản
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#1A1A2A] border border-[#2A2A3A] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#FF6B35] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1A2A] border border-[#2A2A3A] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#FF6B35] transition-all"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-primary !py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận đăng nhập'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#444] leading-relaxed">
          📌 Thông tin của bạn được bảo mật. Chúng tôi sử dụng Supabase Auth để đảm bảo an toàn dữ liệu.
        </p>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
}
