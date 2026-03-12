export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'BĐSViệt';
  
  return (
    <footer className="bg-[#050508] border-t border-[#1A1A2E] py-12 px-[5%]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF9500] flex items-center justify-center text-lg">
              🏘️
            </div>
            <div className="font-extrabold text-lg tracking-tighter">
              BĐS<span className="text-[#FF6B35]">Việt</span>
            </div>
          </div>
          <p className="text-sm text-[#666] leading-relaxed mb-6">
            Nền tảng đăng bài và tìm kiếm bất động sản hàng đầu Việt Nam. Kết nối trực tiếp giữa chủ nhà và người mua.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-white">Khám phá</h4>
          <ul className="space-y-4 text-sm text-[#555]">
            <li><a href="#" className="hover:text-white transition-colors">Căn hộ chung cư</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Nhà phố biệt thự</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Đất nền dự án</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Văn phòng cho thuê</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-white">Chính sách</h4>
          <ul className="space-y-4 text-sm text-[#555]">
            <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Giải quyết khiếu nại</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cài đặt cookie</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-white">Liên hệ</h4>
          <ul className="space-y-4 text-sm text-[#555]">
            <li className="flex items-center gap-3">📍 TP. Hồ Chí Minh</li>
            <li className="flex items-center gap-3">📞 0912 345 678</li>
            <li className="flex items-center gap-3">✉️ hotro@bdsviet.com</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#1A1A2E] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#444]">
        <p suppressHydrationWarning>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Zalo</a>
          <a href="#" className="hover:text-white">Youtube</a>
        </div>
      </div>
    </footer>
  );
}
