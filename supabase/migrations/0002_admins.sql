-- Only users listed in `admins` can write or read messages, even if public sign-ups get turned on by mistake.

create table admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table admins enable row level security; -- no policies: only is_admin() (security definer) reads it

create function is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- Existing projects: the single user created in the dashboard becomes the admin.
-- To add an admin later: insert into admins (user_id) select id from auth.users where email = '...';
insert into admins (user_id) select id from auth.users order by created_at limit 1;

drop policy "public read published" on projects;
create policy "public read published" on projects for select using (published or is_admin());
drop policy "public read published" on project_images;
create policy "public read published" on project_images for select
  using (exists (select 1 from projects p where p.id = project_id and (p.published or is_admin())));

drop policy "public insert" on messages;
create policy "public insert" on messages for insert to anon, authenticated with check (read = false);

do $$
declare t text;
begin
  foreach t in array array['profile','projects','project_images','experience','skill_categories','skills','services','testimonials','messages'] loop
    execute format('drop policy "admin all" on %I', t);
    execute format('create policy "admin all" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

drop policy "admin write media" on storage.objects;
drop policy "admin update media" on storage.objects;
drop policy "admin delete media" on storage.objects;
create policy "admin write media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and is_admin());
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and is_admin());
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and is_admin());
