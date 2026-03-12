-- =============================================
-- BĐSViệt – Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  phone       text,
  email       text,
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'agent', 'admin')),
  zalo_link   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.phone
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. LISTINGS
create table if not exists public.listings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  price        numeric,
  price_unit   text default 'VNĐ',
  area         text,
  bedrooms     int,
  bathrooms    int,
  location     text,
  province     text,
  district     text,
  address      text,
  type         text check (type in ('Căn hộ','Nhà phố','Đất nền','Biệt thự','Văn phòng','Shophouse')),
  status       text default 'active' check (status in ('active','sold','rented','hidden')),
  tag          text,
  tag_color    text default '#FF6B35',
  views        int default 0,
  is_featured  boolean default false,
  latitude     numeric,
  longitude    numeric,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger listings_updated_at before update on public.listings
  for each row execute procedure public.update_updated_at();

-- 3. LISTING IMAGES
create table if not exists public.listing_images (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references public.listings(id) on delete cascade,
  url         text not null,
  order_index int default 0,
  created_at  timestamptz default now()
);

-- 4. LIKES
create table if not exists public.likes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  listing_id  uuid references public.listings(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, listing_id)
);

-- 5. COMMENTS
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  listing_id  uuid references public.listings(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now()
);

-- 6. CONTACT REQUESTS
create table if not exists public.contact_requests (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references public.listings(id) on delete cascade,
  user_id     uuid references public.profiles(id),
  name        text,
  phone       text,
  email       text,
  message     text,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- 7. SITE SETTINGS
create table if not exists public.site_settings (
  key   text primary key,
  value text
);

insert into public.site_settings (key, value) values
  ('admin_zalo', '0912345678'),
  ('site_name', 'BĐSViệt'),
  ('contact_email', 'admin@bdsviet.com')
on conflict (key) do nothing;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Listings
alter table public.listings enable row level security;
create policy "Active listings are public" on public.listings for select using (status != 'hidden');
create policy "Authenticated users can insert" on public.listings for insert with check (auth.uid() = user_id);
create policy "Owners can update" on public.listings for update using (auth.uid() = user_id);
create policy "Owners can delete" on public.listings for delete using (auth.uid() = user_id);

-- Listing Images
alter table public.listing_images enable row level security;
create policy "Listing images are public" on public.listing_images for select using (true);
create policy "Listing owner can manage images" on public.listing_images for all
  using (listing_id in (select id from public.listings where user_id = auth.uid()));

-- Likes
alter table public.likes enable row level security;
create policy "Likes are public" on public.likes for select using (true);
create policy "Users can manage own likes" on public.likes for all using (auth.uid() = user_id);

-- Comments
alter table public.comments enable row level security;
create policy "Comments are public" on public.comments for select using (true);
create policy "Authenticated users can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Contact Requests
alter table public.contact_requests enable row level security;
create policy "Listing owners can view contact requests" on public.contact_requests for select
  using (listing_id in (select id from public.listings where user_id = auth.uid()));
create policy "Authenticated users can submit contact" on public.contact_requests for insert
  with check (auth.uid() is not null);

-- Site Settings
alter table public.site_settings enable row level security;
create policy "Settings are public" on public.site_settings for select using (true);
create policy "Only admins can modify" on public.site_settings for all
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- =============================================
-- STORAGE BUCKET
-- =============================================
insert into storage.buckets (id, name, public) values ('listings', 'listings', true)
on conflict do nothing;

create policy "Public can view listing images" on storage.objects
  for select using (bucket_id = 'listings');
create policy "Auth users can upload listing images" on storage.objects
  for insert with check (bucket_id = 'listings' and auth.uid() is not null);
create policy "Users can delete own images" on storage.objects
  for delete using (bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- SAMPLE DATA (optional)
-- =============================================
-- Uncomment to add sample listings after auth setup
