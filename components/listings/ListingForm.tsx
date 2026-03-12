'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Upload, X, Loader2, MapPin, DollarSign, 
  Maximize2, BedDouble, Bath, Plus, Building2 
} from 'lucide-react';

const categories = ["Căn hộ", "Nhà phố", "Đất nền", "Biệt thự", "Văn phòng", "Shophouse"];

export default function ListingForm() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    type: 'Căn hộ',
    tag: 'Mới đăng'
  });

  const supabase = createClient();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vui lòng đăng nhập để đăng tin');

      // 1. Insert Listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          area: formData.area,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          location: formData.location,
          type: formData.type,
          tag: formData.tag,
          status: 'active'
        }])
        .select()
        .single();

      if (listingError) throw listingError;

      // 2. Upload Images
      if (images.length > 0) {
        for (const [index, file] of images.entries()) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${listing.id}/${Date.now()}_${index}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(fileName, file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('listings')
              .getPublicUrl(fileName);

            await supabase.from('listing_images').insert([{
              listing_id: listing.id,
              url: publicUrl,
              order_index: index
            }]);
          }
        }
      }

      router.push(`/listings/${listing.id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fadeIn">
      {/* Photo Upload */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          📸 Hình ảnh bất động sản
          <span className="text-xs text-[#555] font-normal tracking-widest uppercase ml-2">Tối đa 10 ảnh</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="aspect-square relative rounded-2xl overflow-hidden border border-[#2A2A3A] group">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {previews.length < 10 && (
            <label className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#2A2A3A] rounded-2xl cursor-pointer hover:border-[#FF6B35] hover:bg-orange-500/5 transition-all text-[#555] hover:text-[#FF6B35]">
              <Upload className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-wider text-center px-4">Tải ảnh lên</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </section>

      {/* Basic Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Tiêu đề tin đăng *</label>
          <input 
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="VD: Căn hộ cao cấp Vinhomes view CBD tầng 20..."
            className="w-full input-dark py-4 text-lg font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Loại bất động sản</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({...formData, type: cat})}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  formData.type === cat 
                    ? 'bg-[#FF6B35] border-transparent text-white' 
                    : 'bg-[#1A1A2A] border-[#2A2A3A] text-[#888] hover:border-[#FF6B35]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Địa chỉ / Khu vực *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input 
                required
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="VD: Quận 2, TP. Hồ Chí Minh"
                className="w-full input-dark pl-12 py-3.5"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Giá bán (Triệu VNĐ)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input 
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="VD: 4500 (là 4.5 tỷ)"
                  className="w-full input-dark pl-12 py-3.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Diện tích (m²)</label>
              <div className="relative">
                <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input 
                  type="number"
                  required
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  placeholder="VD: 85"
                  className="w-full input-dark pl-12 py-3.5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Số phòng ngủ</label>
            <div className="relative">
              <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input 
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                placeholder="Số PN"
                className="w-full input-dark pl-12 py-3.5"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Số phòng tắm</label>
            <div className="relative">
              <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input 
                type="number"
                value={formData.bathrooms}
                onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                placeholder="Số WC"
                className="w-full input-dark pl-12 py-3.5"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Mô tả nội dung *</label>
          <textarea 
            required
            rows={5}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả chi tiết về tiện ích, nội thất, pháp lý..."
            className="w-full input-dark py-4 resize-none"
          />
        </div>
      </section>

      {/* Footer Actions */}
      <div className="pt-10 border-t border-[#1E1E2E] flex items-center justify-between gap-6">
        <div className="hidden md:block">
          <p className="text-xs text-[#555] leading-relaxed max-w-sm">
            📌 Tin đăng của bạn sẽ được hiển thị ngay sau khi nhấn xác nhận. Bạn có thể chỉnh sửa hoặc xóa tin bất cứ lúc nào trong trang cá nhân.
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-[#1A1A2A] border border-[#2A2A3A] text-sm font-bold text-[#888] hover:text-white transition-all"
          >
            Huỷ bỏ
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 md:flex-none btn-primary !px-12 !py-4 flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Đăng tin ngay</>}
          </button>
        </div>
      </div>
    </form>
  );
}
