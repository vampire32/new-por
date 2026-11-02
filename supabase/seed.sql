-- Demo content so the site looks complete before real content is added.
-- Replace everything from /admin. Safe to skip in production.

insert into profile (id, name, headline, intro, about, email, location, github_url, linkedin_url, available, seo_title, seo_description)
values (1,
  'Your Name',
  'I build web products people actually use.',
  'Full stack developer. I take ideas from a rough sketch to a fast, reliable app in production.',
  E'I started building websites for local businesses and stayed for the problem solving. Today I work across the stack: React and Next.js on the front, Node and Postgres on the back, and whatever it takes to ship.\n\nI like small teams, clear goals and code that the next person can read. I write things down, I ask questions early, and I care about the details users notice.',
  'hello@example.com',
  'Remote',
  'https://github.com/',
  'https://www.linkedin.com/',
  true,
  'Your Name — Full stack developer',
  'Full stack developer building SaaS products, dashboards and APIs with Next.js, Node and Postgres.'
);

insert into projects (slug, title, summary, role, year, tech, problem, built, outcome, featured, published, sort_order) values
('clinic-booking', 'Clinic booking platform', 'Online appointments and reminders for a chain of five clinics.', 'Full stack developer', 2025,
  '{Next.js,Node.js,PostgreSQL,Stripe}',
  'Receptionists booked every appointment by phone, and no-shows cost the clinics about a fifth of their slots.',
  'A booking site with live availability, SMS reminders and a staff dashboard for managing schedules across locations.',
  'No-shows dropped by 38% in the first three months, and phone bookings fell by half.',
  true, true, 1),
('inventory-dashboard', 'Inventory dashboard', 'Real-time stock tracking for a wholesale distributor.', 'Lead developer', 2024,
  '{React,Express,PostgreSQL,Redis}',
  'Stock counts lived in spreadsheets that were out of date by lunchtime.',
  'A dashboard that syncs with the warehouse scanners, flags low stock and generates purchase orders.',
  'Stock-outs went from weekly to rare, and the monthly count takes two hours instead of two days.',
  true, true, 2),
('invoice-api', 'Invoice API', 'A small REST API that turns order data into PDF invoices.', 'Backend developer', 2023,
  '{Node.js,Fastify,PostgreSQL}',
  'A client generated invoices by hand in a word processor.',
  'An API with templates, numbering rules and PDF output, plus a simple admin page.',
  'Invoices go out automatically when an order ships.',
  false, true, 3),
('draft-project', 'Unpublished draft', 'This project is not published and must not appear anywhere.', null, 2026,
  '{}', null, null, null, false, false, 4);

insert into experience (role, company, start_date, end_date, description, sort_order) values
('Full stack developer', 'Freelance', '2023-01-01', null, 'Building web apps for clinics, retailers and startups: from first call to production and support.', 1),
('Software engineer', 'Example Agency', '2020-06-01', '2022-12-31', 'Built and maintained client sites and internal tools in React, Node and PostgreSQL.', 2);

with c as (
  insert into skill_categories (name, sort_order) values
  ('Frontend', 1), ('Backend', 2), ('Database', 3), ('DevOps', 4)
  returning id, name
)
insert into skills (category_id, name, sort_order)
select c.id, s.name, s.ord from c join (values
  ('Frontend', 'React', 1), ('Frontend', 'Next.js', 2), ('Frontend', 'Tailwind CSS', 3),
  ('Backend', 'Node.js', 1), ('Backend', 'Express', 2), ('Backend', 'REST APIs', 3),
  ('Database', 'PostgreSQL', 1), ('Database', 'Supabase', 2), ('Database', 'Redis', 3),
  ('DevOps', 'Vercel', 1), ('DevOps', 'Docker', 2), ('DevOps', 'GitHub Actions', 3)
) as s(cat, name, ord) on s.cat = c.name;

insert into services (title, description, sort_order) values
('Web applications', 'Dashboards, booking systems and internal tools, built end to end.', 1),
('APIs and integrations', 'REST APIs, payment and third-party integrations, and data syncs.', 2),
('Performance and fixes', 'Speeding up slow apps and fixing the bugs nobody else could.', 3);

-- No testimonials on purpose: the Testimonials section stays hidden until one is added.
