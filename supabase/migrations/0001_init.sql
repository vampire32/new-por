-- Portfolio schema. Run once in the Supabase SQL editor.

create table profile (
  id int primary key default 1 check (id = 1),
  name text,
  headline text,
  intro text,
  about text,
  photo_url text,
  about_image_url text,
  cv_url text,
  email text,
  location text,
  github_url text,
  linkedin_url text,
  x_url text,
  available boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  role text,
  year int,
  tech text[] not null default '{}',
  problem text,
  built text,
  outcome text,
  cover_url text,
  live_url text,
  repo_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  start_date date,
  end_date date, -- null means "Present"
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text,
  avatar_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 200),
  body text not null check (char_length(body) <= 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: anon reads published content and can only insert messages.
-- The only authenticated user is the admin (sign-ups are disabled).
alter table profile enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table experience enable row level security;
alter table skill_categories enable row level security;
alter table skills enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table messages enable row level security;

create policy "public read" on profile for select using (true);
create policy "public read" on experience for select using (true);
create policy "public read" on skill_categories for select using (true);
create policy "public read" on skills for select using (true);
create policy "public read" on services for select using (true);
create policy "public read" on testimonials for select using (true);
create policy "public read published" on projects for select
  using (published or auth.role() = 'authenticated');
create policy "public read published" on project_images for select
  using (exists (select 1 from projects p where p.id = project_id and (p.published or auth.role() = 'authenticated')));
create policy "public insert" on messages for insert to anon, authenticated with check (true);

create policy "admin all" on profile for all to authenticated using (true) with check (true);
create policy "admin all" on projects for all to authenticated using (true) with check (true);
create policy "admin all" on project_images for all to authenticated using (true) with check (true);
create policy "admin all" on experience for all to authenticated using (true) with check (true);
create policy "admin all" on skill_categories for all to authenticated using (true) with check (true);
create policy "admin all" on skills for all to authenticated using (true) with check (true);
create policy "admin all" on services for all to authenticated using (true) with check (true);
create policy "admin all" on testimonials for all to authenticated using (true) with check (true);
create policy "admin all" on messages for all to authenticated using (true) with check (true);

-- Storage: public bucket for images and the CV; only the admin writes.
insert into storage.buckets (id, name, public) values ('media', 'media', true);
create policy "admin write media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
