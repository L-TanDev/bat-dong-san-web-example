import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: '/Users/le-tan/Code vui/batdongsan/bat-dong-san-web-example/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const mockListings = [
  {
    title: "Căn hộ cao cấp Vinhomes Central Park",
    price: 4500,
    price_unit: "VNĐ",
    area: "85",
    bedrooms: 3,
    bathrooms: 2,
    location: "Bình Thạnh, TP.HCM",
    type: "Căn hộ",
    tag: "Nổi bật",
    tag_color: "#FF6B35",
    description: "Căn hộ view sông Sài Gòn, nội thất cao cấp, tầng 18, ban công rộng 8m².",
    views: 312,
  },
  {
    title: "Nhà phố 3 tầng Quận 7 – Gần Phú Mỹ Hưng",
    price: 8200,
    price_unit: "VNĐ",
    area: "120",
    bedrooms: 4,
    bathrooms: 3,
    location: "Quận 7, TP.HCM",
    type: "Nhà phố",
    tag: "Mới đăng",
    tag_color: "#22C55E",
    description: "Nhà mới xây, đường 12m, ô tô vào tận nhà, an ninh 24/7, gần trường quốc tế.",
    views: 145,
  },
  {
    title: "Đất nền biệt thự Đà Nẵng – View biển Mỹ Khê",
    price: 6800,
    price_unit: "VNĐ",
    area: "200",
    bedrooms: null,
    bathrooms: null,
    location: "Ngũ Hành Sơn, Đà Nẵng",
    type: "Đất nền",
    tag: "Hot",
    tag_color: "#EF4444",
    description: "Lô đất MT 10m, sổ đỏ riêng, cách biển 200m, pháp lý sạch, thổ cư 100%.",
    views: 891,
  },
  {
    title: "Văn phòng cho thuê Quận 1 – Tòa nhà hạng A",
    price: 45,
    price_unit: "/tháng",
    area: "150",
    bedrooms: null,
    bathrooms: 2,
    location: "Quận 1, TP.HCM",
    type: "Văn phòng",
    tag: "Cho thuê",
    tag_color: "#8B5CF6",
    description: "Văn phòng tầng 15, view nhìn trung tâm Q1, đầy đủ tiện ích, thang máy riêng.",
    views: 88,
  },
  {
    title: "Biệt thự nghỉ dưỡng Đà Lạt – Thung lũng xanh",
    price: 12000,
    price_unit: "VNĐ",
    area: "350",
    bedrooms: 5,
    bathrooms: 4,
    location: "Lạc Dương, Đà Lạt",
    type: "Biệt thự",
    tag: "Cao cấp",
    tag_color: "#F59E0B",
    description: "Biệt thự giữa rừng thông, sân vườn 200m², hồ bơi riêng, không khí trong lành.",
    views: 1204,
  },
  {
    title: "Shophouse Mặt tiền Nguyễn Huệ",
    price: 25000,
    price_unit: "VNĐ",
    area: "90",
    bedrooms: 3,
    bathrooms: 2,
    location: "Quận 1, TP.HCM",
    type: "Shophouse",
    tag: "Đầu tư",
    tag_color: "#06B6D4",
    description: "Mặt tiền đường đi bộ Nguyễn Huệ, kinh doanh đỉnh cao, đầu tư sinh lời cao.",
    views: 567,
  },
  {
    title: "Eco Green Sài Gòn – Căn hộ xanh giữa lòng thành phố",
    price: 3200,
    price_unit: "VNĐ",
    area: "65",
    bedrooms: 2,
    bathrooms: 2,
    location: "Quận 7, TP.HCM",
    type: "Căn hộ",
    tag: "Giá tốt",
    tag_color: "#22C55E",
    description: "Căn hộ bàn giao nội thất cao cấp, tiện ích 5 sao, công viên 22ha.",
    views: 245,
  },
  {
    title: "Penthouse Ciputra Hà Nội – Đẳng cấp thượng lưu",
    price: 18000,
    price_unit: "VNĐ",
    area: "450",
    bedrooms: 6,
    bathrooms: 5,
    location: "Tây Hồ, Hà Nội",
    type: "Căn hộ",
    tag: "Siêu sang",
    tag_color: "#F59E0B",
    description: "Căn hộ thông tầng, view trọn hồ Tây, thiết kế tân cổ điển sang trọng.",
    views: 432,
  },
  {
    title: "Đất nền sổ đỏ Vũng Tàu – Gần tổ hợp casino",
    price: 2100,
    price_unit: "VNĐ",
    area: "100",
    bedrooms: null,
    bathrooms: null,
    location: "Xuyên Mộc, Vũng Tàu",
    type: "Đất nền",
    tag: "Tiềm năng",
    tag_color: "#8B5CF6",
    description: "Đất thổ cư 100%, gần dự án biển, hạ tầng hoàn thiện, sổ đỏ sẵn sàng.",
    views: 120,
  },
  {
    title: "Nhà phố cổ Hội An – Kinh doanh du lịch cực tốt",
    price: 15000,
    price_unit: "VNĐ",
    area: "110",
    bedrooms: 3,
    bathrooms: 3,
    location: "Hội An, Quảng Nam",
    type: "Nhà phố",
    tag: "Cực hot",
    tag_color: "#EF4444",
    description: "Nhà cổ được bảo tồn tốt, vị trí trung tâm du lịch, doanh thu ổn định.",
    views: 742,
  },
  {
    title: "Văn phòng Landmark 81 – Tầm nhìn ra mây",
    price: 85,
    price_unit: "/tháng",
    area: "200",
    bedrooms: null,
    bathrooms: 1,
    location: "Bình Thạnh, TP.HCM",
    type: "Văn phòng",
    tag: "Đẳng cấp",
    tag_color: "#06B6D4",
    description: "Văn phòng hạng A+, đầy đủ dịch vụ, địa chỉ kinh doanh uy tín nhất VN.",
    views: 981,
  },
  {
    title: "Villa Sunset Phú Quốc – View biển hoàng hôn",
    price: 42000,
    price_unit: "VNĐ",
    area: "600",
    bedrooms: 8,
    bathrooms: 10,
    location: "An Thới, Phú Quốc",
    type: "Biệt thự",
    tag: "Đặc biệt",
    tag_color: "#FF6B35",
    description: "Biệt thự biển sang trọng bậc nhất, hồ bơi vô cực, sở hữu lâu dài.",
    views: 1540,
  }
]

async function seed() {
  console.log('🚀 Starting database seed...')

  // 1. Create a default admin user/profile if none exists
  // Since we use service role, we can insert into profiles directly if RLS allows or via bypass
  // But wait, profiles has a foreign key to auth.users.
  // We should try to find an existing user first, or just use a fixed ID if we're brave.
  
  // Let's get the first user from auth.users (if any)
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  
  let targetUserId
  if (users && users.length > 0) {
    targetUserId = users[0].id
    console.log(`Using existing user ID: ${targetUserId}`)
  } else {
    // Create a dummy user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@bdsviet.com',
      password: 'adminpassword123',
      email_confirm: true,
      user_metadata: { full_name: 'BĐSViệt Admin' }
    })
    
    if (createError) {
      console.error('Error creating admin user:', createError.message)
      process.exit(1)
    }
    targetUserId = newUser.user.id
    console.log(`Created new admin user ID: ${targetUserId}`)
  }

  // 2. Insert listings
  const listingsWithUser = mockListings.map(l => ({ ...l, user_id: targetUserId }))
  
  const { data, error } = await supabase
    .from('listings')
    .insert(listingsWithUser)
    .select()

  if (error) {
    console.error('Error inserting listings:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} listings into database!`)
  }
}

seed()
