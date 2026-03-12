export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-[#0F0F1E] to-[#0A0A0F] pt-20 pb-12 px-[5%] text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#FF6B35] text-[11px] font-bold tracking-[2px] uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Nền tảng bất động sản #1 Việt Nam
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          Tìm ngôi nhà <span className="bg-gradient-to-br from-[#FF6B35] to-[#FF9500] bg-clip-text text-transparent italic">mơ ước</span><br />
          của bạn tại <span className="text-white">Việt Nam</span>
        </h1>

        <p className="text-[#666] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Khám phá hàng nghìn bất động sản chính chủ, từ căn hộ hạng sang đến đất nền tiềm năng. Kết nối trực tiếp, giao dịch minh bạch.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {[
            { label: 'Tin đăng mới', value: '2,400+' },
            { label: 'Chủ nhà uy tín', value: '850+' },
            { label: 'Hài lòng', value: '98%' },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-2xl font-black text-[#FF6B35] mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-[10px] text-[#444] font-bold uppercase tracking-widest leading-none">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
