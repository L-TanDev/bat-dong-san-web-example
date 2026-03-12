'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, Loader2 } from 'lucide-react';

interface CommentSectionProps {
  listingId: string;
  initialComments: any[];
}

export default function CommentSection({ listingId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login or open modal (handled by query param usually)
      window.location.href = `/?login=1`;
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          listing_id: listingId, 
          user_id: user.id, 
          content: text 
        }
      ])
      .select('*, profiles(full_name, avatar_url)')
      .single();

    if (data) {
      setComments([data, ...comments]);
      setText('');
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 bg-[#111118] border border-[#1E1E2E] rounded-3xl p-8 shadow-xl">
      <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
        Bình luận 
        <span className="text-[#555] font-medium text-sm">({comments.length})</span>
      </h3>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center font-bold flex-shrink-0">
          ?
        </div>
        <div className="flex-1 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={3}
            className="w-full bg-[#1A1A2A] border border-[#2A2A3A] rounded-2xl p-4 text-sm outline-none focus:border-[#FF6B35] transition-all resize-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary flex items-center gap-2 py-2 px-6 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Gửi bình luận</>}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-6">
        {comments.map((c: any) => (
          <div key={c.id} className="flex gap-4 group animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B35FF] to-[#9B59B6] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              {c.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="bg-[#1A1A2A] border border-[#2A2A3A] rounded-2xl p-4 group-hover:border-[#FF6B35]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{c.profiles?.full_name || 'Người dùng'}</span>
                  <span suppressHydrationWarning className="text-[10px] text-[#555] uppercase font-bold tracking-wider">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#AAA] leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8 text-[#444] text-sm italic">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
}
