# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A light, professional developer portfolio (Next.js 16) whose every section is edited from a Supabase-backed `/admin` dashboard.

**Architecture:** Server-rendered public pages read Supabase through a small data layer (`lib/data.js`). Admin pages call server actions that check auth, write to Supabase, then `revalidatePath` the affected public routes. RLS on every table is the real security boundary; the proxy only redirects.

**Tech Stack:** Next.js 16.4 (App Router, JS), React 19.3, Tailwind CSS 4, `@supabase/supabase-js` + `@supabase/ssr`, Vitest (unit tests for pure logic), Vercel Cron.

**Spec:** `docs/superpowers/specs/2026-11-02-portfolio-design.md` (read it first; this plan argues from it).

## Global Constraints

- **No git operations.** The owner does all commits and pushes. Skip any "commit" habit.
- JavaScript only, no TypeScript. Keep the scaffold's structure (`app/`, root-level config).
- No paid services. No new dependency beyond: `@supabase/supabase-js`, `@supabase/ssr`, `vitest`. Long text is plain text split into paragraphs on blank lines (no markdown library).
- Palette tokens exactly: `bg #F3F5F8`, `surface #FFFFFF`, `surface-2 #E4E9F0`, `ink #1C2533`, `muted #5C6677`, `accent #2A4A7F`, `accent-tint #E2E8F2`, `line #DDE2EA`. Light theme only; delete the scaffold's dark-mode CSS.
- Fonts: Newsreader (headings, weight 400) and Hanken Grotesk (body/UI) via `next/font/google`. Remove Geist.
- Copy: sentence case, no all-caps labels, no "→" appended to links, no buzzwords. Button labels: "Start a project", "See case studies", "Download CV", "Send message".
- Motion: one hero load moment at most; everything else only responds to user action; honour `prefers-reduced-motion`.
- All frontend/UI work (Tasks 4, 5, 8–11 UI) is done with the `frontend-design` skill loaded.
- Visible keyboard focus (`accent` outline), responsive to 360px wide, images have alt text.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`. Never use the service-role key in the app.

## Review Focus

1. **Unpublished project visited by URL** (`/work/draft-slug`) → 404, not the content. Test in Task 3 (`getProjectBySlug` filters `published`) and RLS check in Task 2.
2. **Signed-out request calling an admin server action directly** (bypassing the proxy) → rejected with no write. Every admin action calls `requireAdmin()` (Task 7); RLS denies anon writes (Task 2).
3. **Admin changes a project's slug** → old `/work/old` path revalidated and 404s; new path works; home and `/work` update immediately. Test in Task 3 (`pathsFor`).
4. **Missing optional data** (no photo, no CV, no live/GitHub URL, empty testimonials, empty profile fields) → no broken `<img>`, no dead links, empty sections and their nav links hidden. Test in Task 3 (`visibleSections`).
5. **Contact form abuse**: honeypot filled → reported as sent but not stored; message over 5000 chars or bad email → field error, nothing stored. Test in Task 3 (`validateContact`).

---

## File Structure

```
app/
  layout.js                 fonts, metadata from profile, header/footer
  globals.css               tokens (@theme), base styles
  page.js                   home: composes section components
  work/page.js              all published projects
  work/[slug]/page.js       case study + generateMetadata
  not-found.js
  sitemap.js, robots.js
  actions/contact.js        sendMessage server action
  api/keepalive/route.js    cron ping
  admin/login/page.js
  admin/(panel)/layout.js   requireAdmin + sidebar nav
  admin/(panel)/page.js     redirects to /admin/messages
  admin/(panel)/{profile,projects,experience,skills,services,testimonials,messages}/page.js
  admin/(panel)/projects/[id]/page.js   edit/create ("new") project
  admin/actions.js          all admin server actions
components/
  site/  Header, Footer, Hero, WorkList, ProjectCard, About, Experience, Skills, Services, Testimonials, Contact, ContactForm (client), Paragraphs
  admin/ Field, ImageInput, ListRow (up/down/edit/delete), SubmitButton (client)
lib/
  supabase/server.js        createClient() — cookie-aware server client
  supabase/browser.js       createBrowserClient() (login form only)
  data.js                   read functions for public pages
  auth.js                   requireAdmin()
  validation.js             validateContact, slugify
  sections.js               visibleSections
  paths.js                  pathsFor
  *.test.js                 Vitest tests next to the module
proxy.js                    refresh session; redirect /admin/* → /admin/login when signed out
supabase/migrations/0001_init.sql
supabase/seed.sql
vercel.json                 cron
.env.example
README.md                   setup steps (Supabase project, SQL, admin user, env, Vercel)
```

---

### Task 1: Foundation — tokens, fonts, test runner

**Files:**
- Modify: `package.json`, `app/globals.css`, `app/layout.js`, `next.config.mjs`
- Create: `vitest.config.mjs`, `.env.example`

**Interfaces:**
- Produces: Tailwind colour utilities `bg-bg`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `bg-accent`/`text-accent`, `bg-accent-tint`, `border-line`; font utilities `font-serif` (Newsreader) and `font-sans` (Hanken Grotesk); `npm test` runs Vitest.

- [ ] **Step 1:** `npm i @supabase/supabase-js @supabase/ssr` and `npm i -D vitest`. Add script `"test": "vitest run"`.
- [ ] **Step 2:** `vitest.config.mjs` with `test.environment: 'node'`, include `lib/**/*.test.js`.
- [ ] **Step 3:** Rewrite `app/globals.css`: `@import "tailwindcss";` plus `@theme` with the eight palette tokens from Global Constraints and `--font-serif: var(--font-newsreader)`, `--font-sans: var(--font-hanken)`. `body` uses `bg-bg text-ink font-sans`. Global `:focus-visible` outline 2px `accent`, offset 2px. Remove the dark-mode media query.
- [ ] **Step 4:** In `app/layout.js` replace Geist with `Newsreader({ variable: '--font-newsreader', weight: '400' })` and `Hanken_Grotesk({ variable: '--font-hanken' })`. Keep `lang="en"`.
- [ ] **Step 5:** `next.config.mjs`: `images.remotePatterns` for `https://*.supabase.co/storage/v1/object/public/**`.
- [ ] **Step 6:** `.env.example` listing the four env vars with comments.
- [ ] **Step 7:** Verify `npm test` (exits 0, "no test files" is acceptable now) and `npm run build` succeed.

---

### Task 2: Database schema, RLS, storage, seed

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `supabase/seed.sql`, `README.md` (setup section)

**Interfaces:**
- Produces tables (all with `id uuid default gen_random_uuid() primary key`, `created_at timestamptz default now()`, and `sort_order int not null default 0` on every list table):
  - `profile` (single row, `id int primary key default 1 check (id = 1)`): `name, headline, intro, about, photo_url, about_image_url, cv_url, email, location, github_url, linkedin_url, x_url, available boolean default true, seo_title, seo_description` (text unless stated).
  - `projects`: `slug text unique not null, title text not null, summary, role, year int, tech text[] default '{}', problem, built, outcome, cover_url, live_url, repo_url, featured boolean default false, published boolean default false`.
  - `project_images`: `project_id uuid references projects on delete cascade, url text not null, alt text, sort_order`.
  - `experience`: `role, company, start_date date, end_date date null (null = Present), description`.
  - `skill_categories`: `name text not null`. `skills`: `category_id uuid references skill_categories on delete cascade, name text not null`.
  - `services`: `title, description`. `testimonials`: `quote not null, name not null, role, avatar_url`.
  - `messages`: `name, email, body not null, read boolean default false`.
- Storage bucket `media` (public read).

- [ ] **Step 1:** Write the migration with the tables above.
- [ ] **Step 2:** RLS: enable on every table. Policies: `anon, authenticated` can `select` on all content tables, except `projects` where `anon` sees only `published = true` and `project_images` only where the parent project is published. `authenticated` gets `all` on every table. `messages`: `anon` may `insert` only; only `authenticated` may `select/update/delete`. Storage `media`: public read; insert/update/delete for `authenticated`.
- [ ] **Step 3:** `seed.sql`: one profile row with plain placeholder copy, three projects (two featured, one published-but-not-featured, one unpublished draft), two experience rows, four skill categories with skills, three services, zero testimonials (so empty-section hiding is visible).
- [ ] **Step 4:** README setup: create Supabase project → run migration then seed in SQL editor → Auth: disable sign-ups, create the admin user by hand → copy URL and anon key to `.env.local` → Vercel env vars.
- [ ] **Step 5: Verify RLS** in the SQL editor with `set role anon;`: `select count(*) from projects` returns only published rows; `insert into projects (slug,title) values ('x','x')` fails; `select * from messages` returns 0 rows/denied; `insert into messages (name,email,body) values ('a','a@b.co','hi')` succeeds. Record results in the task report. *(Needs the owner's Supabase project; if it does not exist yet, stop and ask for it.)*

---

### Task 3: Supabase clients, data layer, pure helpers

**Files:**
- Create: `lib/supabase/server.js`, `lib/supabase/browser.js`, `lib/data.js`, `lib/validation.js`, `lib/sections.js`, `lib/paths.js`, and `lib/validation.test.js`, `lib/sections.test.js`, `lib/paths.test.js`

**Interfaces:**
- Produces:
  - `createClient(): Promise<SupabaseClient>` (server, uses `cookies()` from `next/headers` with `@supabase/ssr` `createServerClient`).
  - `createBrowserClient(): SupabaseClient`.
  - `lib/data.js` (all `async`, return `[]`/`null` on empty, throw on Supabase error): `getProfile()`, `getFeaturedProjects()`, `getPublishedProjects()`, `getProjectBySlug(slug)` (published only, includes `images` ordered by `sort_order`), `getExperience()` (by `sort_order`), `getSkillGroups()` → `[{ id, name, skills: [{id,name}] }]`, `getServices()`, `getTestimonials()`, `getHomeData()` → `{ profile, featured, experience, skillGroups, services, testimonials }`.
  - `validateContact({ name, email, message, website }) → { ok: true, data: {name,email,body} } | { ok: false, errors: {field: string} } | { ok: true, spam: true }`.
  - `slugify(str) → string`.
  - `visibleSections(homeData) → [{ id, label }]` in spec order: `work/Work, about/About, experience/Experience, skills/Skills, services/Services, testimonials/Testimonials, contact/Contact`.
  - `pathsFor(project, previousSlug?) → string[]`.

- [ ] **Step 1: Write failing tests.**

```js
// lib/validation.test.js
expect(validateContact({ name: 'Ali', email: 'ali@x.com', message: 'Hello there', website: '' }))
  .toEqual({ ok: true, data: { name: 'Ali', email: 'ali@x.com', body: 'Hello there' } });
expect(validateContact({ name: '', email: 'nope', message: '', website: '' }).errors)
  .toEqual({ name: 'Enter your name.', email: 'Enter a valid email address.', message: 'Write a message.' });
expect(validateContact({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5001), website: '' }).errors.message)
  .toBe('Keep the message under 5000 characters.');
expect(validateContact({ name: 'A', email: 'a@b.co', message: 'hi', website: 'spam.com' })).toEqual({ ok: true, spam: true });
// trims whitespace; name max 100 chars → 'Keep your name under 100 characters.'
expect(slugify('  My SaaS Dashboard! v2 ')).toBe('my-saas-dashboard-v2');

// lib/sections.test.js
const full = { profile: { about: 'x' }, featured: [{}], experience: [{}], skillGroups: [{ skills: [{}] }], services: [{}], testimonials: [{}] };
expect(visibleSections(full).map(s => s.id)).toEqual(['work','about','experience','skills','services','testimonials','contact']);
expect(visibleSections({ ...full, testimonials: [], featured: [], profile: { about: '' } }).map(s => s.id))
  .toEqual(['experience','skills','services','contact']);
expect(visibleSections({ ...full, skillGroups: [{ skills: [] }] }).map(s => s.id)).not.toContain('skills');

// lib/paths.test.js
expect(pathsFor({ slug: 'new' }, 'old')).toEqual(['/', '/work', '/work/new', '/work/old']);
expect(pathsFor({ slug: 'same' }, 'same')).toEqual(['/', '/work', '/work/same']);
```

- [ ] **Step 2:** `npm test` → FAIL (modules missing).
- [ ] **Step 3:** Implement the helpers and clients. Contact is always visible. Email check: one `@`, a dot in the domain, no spaces.
- [ ] **Step 4:** Implement `lib/data.js` against the Task 2 schema.
- [ ] **Step 5:** `npm test` → all PASS.

---

### Task 4: Home page (load `frontend-design` skill first)

**Files:**
- Modify: `app/layout.js`, `app/page.js`
- Create: `components/site/*` (Header, Footer, Hero, WorkList, ProjectCard, About, Experience, Skills, Services, Testimonials, Contact, Paragraphs)

**Interfaces:**
- Consumes: `getHomeData()`, `visibleSections()`, `getProfile()`.
- Produces: `<ProjectCard project />` (reused on `/work`), `<Paragraphs text />` (splits on blank lines), section ids matching `visibleSections` ids for anchor nav.

- [ ] **Step 1:** `app/layout.js`: `generateMetadata()` from `profile.seo_title/seo_description` (fallback to `name`/`headline`), OG tags; render `<Header sections>` and `<Footer profile>`.
- [ ] **Step 2:** Hero per spec layout B: status pill "Open to new projects" only when `available`; serif headline = `profile.headline`; intro; "Start a project" (→ `#contact`), "See case studies" (→ `/work`), "Download CV" only when `cv_url`; photo right on desktop, `next/image` with `priority`, omitted cleanly when `photo_url` is empty.
- [ ] **Step 3:** Remaining sections in spec order, each rendered only if in `visibleSections`. Work section ends with "See all projects" → `/work`. Experience shows "Present" when `end_date` is null, dates as "Mar 2023".
- [ ] **Step 4:** `app/page.js` is a server component; `export const revalidate = false` is not needed — rely on `revalidatePath` from admin actions (default static + on-demand revalidation).
- [ ] **Step 5: Verify** with seed data: `npm run dev`, Playwright screenshots at 1440px and 390px. Check: Testimonials section and nav link absent (seed has none); no console errors; focus ring visible when tabbing; layout has no horizontal scroll at 360px. Self-critique against the spec's anti-goals and fix before finishing.

---

### Task 5: Work pages, SEO files, 404

**Files:**
- Create: `app/work/page.js`, `app/work/[slug]/page.js`, `app/not-found.js`, `app/sitemap.js`, `app/robots.js`

**Interfaces:**
- Consumes: `getPublishedProjects()`, `getProjectBySlug()`, `<ProjectCard>`, `<Paragraphs>`.

- [ ] **Step 1:** `/work`: heading, every published project in `sort_order`, using `ProjectCard`.
- [ ] **Step 2:** `/work/[slug]`: `generateStaticParams` from published projects; `notFound()` when `getProjectBySlug` returns null; sections "The problem", "What I built", "Outcome" (each hidden if empty); meta row with role, year, tech; gallery of `images`; "Live site" / "Source code" links only when URLs exist (`target="_blank" rel="noopener"`); `generateMetadata` with title, summary, cover as OG image.
- [ ] **Step 3:** `not-found.js` in the site style with a link home. `sitemap.js` lists `/`, `/work`, and each published project using `NEXT_PUBLIC_SITE_URL`. `robots.js` allows all, disallows `/admin`.
- [ ] **Step 4: Verify:** seed's unpublished draft slug returns 404; non-featured published project appears on `/work` but not home; screenshots at 1440/390.

---

### Task 6: Contact form

**Files:**
- Create: `app/actions/contact.js`, `components/site/ContactForm.js` (client)
- Modify: `components/site/Contact.js`

**Interfaces:**
- Consumes: `validateContact()`, `createClient()`.
- Produces: `sendMessage(prevState, formData) → { status: 'idle'|'sent'|'error', errors?: {}, message?: string }`.

- [ ] **Step 1:** Server action: read fields incl. hidden `website` honeypot; on `spam` return `{status:'sent'}` without insert; on validation errors return them; insert into `messages`; on DB error return `{status:'error', message:'Your message could not be sent. Email me directly at <profile.email>.'}`.
- [ ] **Step 2:** `ContactForm` uses `useActionState`; inline field errors with `aria-describedby`; honeypot visually hidden and `tabIndex={-1}` `autoComplete="off"`; button "Send message" → "Sending…" while pending; success replaces form with "Message sent. I'll reply to <email> soon." 
- [ ] **Step 3: Verify** in the browser: empty submit shows three field errors; valid submit creates a row (check in Supabase); filling the honeypot via devtools shows success and creates no row.

---

### Task 7: Admin auth

**Files:**
- Create: `proxy.js`, `lib/auth.js`, `app/admin/login/page.js` (client form), `app/admin/(panel)/layout.js`, `app/admin/(panel)/page.js`

**Interfaces:**
- Produces: `requireAdmin(): Promise<{ supabase, user }>` — gets the user via `supabase.auth.getUser()`, `redirect('/admin/login')` if none. **Every admin page and every admin server action calls it first.** `signOut()` server action in `app/admin/actions.js`.

- [ ] **Step 1:** `proxy.js` (Next 16 name for middleware; `export function proxy(request)`, `config.matcher: ['/admin/:path*']`): refresh the Supabase session cookies per `@supabase/ssr` docs; redirect to `/admin/login` when no user and path is not the login page.
- [ ] **Step 2:** Login page: email + password, `signInWithPassword` via browser client, error "Email or password is incorrect.", on success `router.replace('/admin')`. Add `robots: { index: false }` metadata to all admin routes.
- [ ] **Step 3:** Panel layout: `requireAdmin()`, sidebar links (Messages, Profile, Projects, Experience, Skills, Services, Testimonials), unread-messages count badge, "Sign out", "View site".
- [ ] **Step 4: Verify:** signed out, `/admin/projects` redirects to login; wrong password shows the error; correct login lands on `/admin/messages`; sign out returns to login.

---

### Task 8: Admin shared pieces + Profile (load `frontend-design` skill)

**Files:**
- Create: `app/admin/actions.js`, `components/admin/{Field,ImageInput,ListRow,SubmitButton}.js`, `app/admin/(panel)/profile/page.js`

**Interfaces:**
- Produces (in `app/admin/actions.js`, all start with `requireAdmin()` and return `{ ok: true } | { ok: false, message }`):
  - `uploadFile(file: File, folder: string) → string` (public URL; stores at `media/<folder>/<uuid>-<filename>`; rejects >5 MB and non-image types except PDF for `cv`).
  - `saveProfile(prevState, formData)` → revalidate `'/'` with `'layout'`.
  - `saveRow(table, id|null, values, paths)`, `deleteRow(table, id, paths)`, `moveRow(table, id, direction: 'up'|'down', paths)` (swaps `sort_order` with the neighbour; new rows get `max(sort_order)+1`).
- `ImageInput` shows the current image, a file input, and a "Remove" checkbox.
- `ListRow` renders title + up/down/edit/delete buttons; delete asks `confirm()`.

- [ ] **Step 1:** Implement shared actions and components.
- [ ] **Step 2:** Profile form with every `profile` column, photo/about image/CV uploads, availability toggle; success toast "Profile saved."
- [ ] **Step 3: Verify:** change the headline → home shows it on reload without redeploy; upload a photo → hero shows it; toggle availability off → pill disappears.

---

### Task 9: Admin projects

**Files:**
- Create: `app/admin/(panel)/projects/page.js`, `app/admin/(panel)/projects/[id]/page.js`
- Modify: `app/admin/actions.js` (add `saveProject`, `deleteProject`, `addProjectImages`, `deleteProjectImage`)

**Interfaces:**
- Consumes: `saveRow`, `deleteRow`, `moveRow`, `uploadFile`, `slugify`, `pathsFor`.
- Produces: `saveProject(prevState, formData)` — slug defaults to `slugify(title)`, unique-violation returns `{ ok:false, message:'Another project already uses this URL slug.' }`; revalidates `pathsFor(project, previousSlug)`.

- [ ] **Step 1:** List page: ordered rows with featured/published badges, up/down, "New project" (→ `/admin/projects/new`).
- [ ] **Step 2:** Edit page: all project fields; tech as comma-separated input stored as `text[]`; cover upload; gallery upload (multiple) with per-image alt and delete; featured and published checkboxes.
- [ ] **Step 3: Verify:** create a draft → not on site; publish → on `/work`; feature → on home; rename slug → old URL 404s, new works; duplicate slug shows the error.

---

### Task 10: Admin experience, skills, services, testimonials

**Files:**
- Create: `app/admin/(panel)/{experience,skills,services,testimonials}/page.js`

**Interfaces:**
- Consumes: `saveRow`, `deleteRow`, `moveRow`, `uploadFile` with paths `['/']`.

- [ ] **Step 1:** Each page: ordered list with `ListRow` and an inline add/edit form (edit via `?edit=<id>` search param). Experience has a "Current role" checkbox that sets `end_date` null. Skills page manages categories and the skills inside each. Testimonials has avatar upload.
- [ ] **Step 2: Verify:** add a testimonial → Testimonials section and nav link appear on home; delete it → both disappear; reorder services → order changes on home.

---

### Task 11: Messages inbox

**Files:**
- Create: `app/admin/(panel)/messages/page.js`
- Modify: `app/admin/actions.js` (`setMessageRead(id, read)`, `deleteMessage(id)`)

- [ ] **Step 1:** Newest first; unread in bold; expand shows full body plus a `mailto:` "Reply by email" link; mark read/unread; delete with confirm. Empty state: "No messages yet. They'll show up here when someone uses the contact form."
- [ ] **Step 2: Verify:** a message sent via the public form appears; marking it read updates the sidebar badge.

---

### Task 12: Keep-alive cron and final check

**Files:**
- Create: `app/api/keepalive/route.js`, `vercel.json`
- Modify: `README.md` (deploy section)

- [ ] **Step 1:** `GET` handler: return 401 unless `Authorization === 'Bearer ' + process.env.CRON_SECRET`; run `select id from profile limit 1`; return `{ ok: true }`. `vercel.json`: `{"crons":[{"path":"/api/keepalive","schedule":"0 6 * * *"}]}`.
- [ ] **Step 2:** README deploy steps: import repo in Vercel, set the four env vars, set Supabase Auth site URL to the Vercel domain.
- [ ] **Step 3: Final verification:** `npm test`, `npm run lint`, `npm run build` all pass; Playwright pass at 1440px and 390px across `/`, `/work`, one case study, 404, `/admin/login`; walk Review Focus items 1–5 and record the result of each.
