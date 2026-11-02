# Portfolio — Design

Date: 2026-11-02
Owner: full stack developer (site owner, sole admin)

## Intent

A personal portfolio for a full stack developer. Three kinds of visitor land on it: recruiters, clients and agencies. When they close the tab, the one thing they should think is: **"this person is talented; we can hire them or give them work."** The site's job is trust, not spectacle: proof of work up front, calm and professional design, nothing that looks AI-generated or templated.

All content must be editable by the owner from an admin dashboard, with no code changes and no redeploy.

## Goals

- Premium, modern, professional look on a **light** theme.
- Every public section is driven by data the owner edits in `/admin`.
- Zero running cost: free tiers of Supabase and Vercel only.
- Fast, accessible, responsive down to mobile, with good SEO (metadata and OG tags per page).

## Non-goals

- Blog (dropped: it needs constant writing, and an empty blog hurts).
- Dark mode.
- Multiple admin users, roles, or public sign-up.
- Analytics, newsletter, i18n.
- Paid services of any kind.

## Anti-goals (failure even if it works)

- Looks like an AI or template portfolio: dark background with neon accent, gradient blobs, cream + terracotta, identical rounded cards with the same shadow everywhere, ALL-CAPS eyebrow labels over every heading, fade-up animation on every section, "01 / 02 / 03" numbering on non-sequential content.
- Dark or odd colours.
- An admin panel that's painful to use, so the owner stops updating the site.

## Constraints (decided)

- **Framework:** Next.js 16 (App Router), already scaffolded in this repo, JavaScript (not TypeScript, matching the scaffold), Tailwind CSS 4, React 19 with the React Compiler.
- **Backend:** Supabase (free tier), using Postgres for data, Supabase Auth for the admin login, and Supabase Storage for images, the profile photo and the CV PDF.
- **Hosting:** Vercel (free tier).
- **Frontend work** is done with the `frontend-design` skill.

## Visual direction (approved via mockups)

Layout **B** in the **Ink blue** palette.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `bg` | `#F3F5F8` | page background (cool light grey) |
| `surface` | `#FFFFFF` / `#E4E9F0` | raised areas / quiet blocks (project thumbnails, tags) |
| `ink` | `#1C2533` | headings and body text (navy-ink) |
| `muted` | `#5C6677` | secondary text |
| `accent` | `#2A4A7F` | primary buttons, links, focus ring |
| `accent-tint` | `#E2E8F2` | status pill and tag backgrounds |
| `line` | `#DDE2EA` | borders and dividers |

**Type:** headings in **Newsreader** (serif, regular weight 400, slight negative tracking); body and UI in **Hanken Grotesk**. Both via `next/font/google`, replacing Geist. Sentence case everywhere; no all-caps labels.

**Hero (layout B):** two columns on desktop. Left: an "Open to new projects" status pill (shown only when availability is on), a large serif headline, a one-line intro, a primary button ("Start a project", goes to Contact), a text link ("See case studies"), and a CV download link. Right: the owner's photo. On mobile it stacks with the photo first or second (builder's call).

**Motion:** one orchestrated hero load moment at most; otherwise only motion that answers user actions (hover, open, submit). Respect `prefers-reduced-motion`.

## Public site

Single home page with sections in this order, plus a detail page per project.

1. **Hero:** see above.
2. **Selected work:** featured projects (owner-chosen order). Each shows thumbnail, title, one-line summary and tech tags, and links to `/work/[slug]`. Ends with a link to `/work`.

**All work page `/work`:** every published project (featured or not), same order. The nav "Work" item and the hero "See case studies" link go here. `featured` = on the home page; `published` = live anywhere on the site. *(Owner's decision.)*
3. **About:** short story and how the owner works, with an optional second image (separate profile field from the hero photo). *(My call.)*
4. **Experience:** timeline of jobs and freelance work (role, company, dates or "Present", short description). A timeline is a real sequence, so visual ordering cues are fine here.
5. **Skills / Stack:** grouped by category (Frontend, Backend, Database, DevOps, Tools; categories editable).
6. **Services:** what the owner offers clients (title plus short description).
7. **Testimonials:** quote, name, role/company, optional avatar.
8. **Contact:** form (name, email, message) plus email and social links.

Plus a header nav and footer.

**Project detail page `/work/[slug]`:** title, summary, role, year, tech stack, problem / what I built / outcome (rich text or markdown), screenshot gallery, live URL and GitHub URL (each optional).

**Empty sections are hidden**, e.g. no testimonials means no Testimonials section and no nav link. *(Builder's call, confirmed as default.)*

## Admin dashboard (`/admin`)

- Login with Supabase Auth email + password. Only one admin account, created manually in the Supabase dashboard; public sign-up disabled.
- All `/admin` routes protected (redirect to login when signed out).
- CRUD screens for: **Profile / site settings** (name, headline, intro, about text, photo, CV PDF, email, social links, availability on/off, SEO title/description), **Projects** (all fields above, images, featured flag, published flag, sort order), **Experience**, **Skill categories and skills**, **Services**, **Testimonials**.
- Reordering for projects, experience, skills, services and testimonials (up/down buttons or drag; builder's call).
- **Messages inbox:** contact-form submissions saved to the DB; owner can read, mark read, and delete. No email notification (keeps cost at zero; can be added later).
- Image and PDF uploads go to Supabase Storage.
- The admin UI uses the same palette and type but stays plain and functional.

## Data and security

- Postgres tables roughly matching the admin sections: `profile` (single row), `projects`, `project_images`, `experience`, `skill_categories`, `skills`, `services`, `testimonials`, `messages`. Exact schema is the builder's call.
- **Row Level Security on every table:** public (anon) can only read published content and can only insert into `messages`; only the authenticated admin can write anything or read `messages`.
- Contact form validated on the server (required fields, email format, length limits) with a basic spam guard (honeypot field). *(My call.)*
- Storage bucket public-read for images and CV, write only for the admin.

## Freshness

Public pages are rendered on the server and must reflect admin edits immediately. After each admin save, revalidate the affected paths (e.g. `revalidatePath`), rather than relying on a timer.

## Keep-alive

Supabase free projects pause after about a week without activity, which would break the contact form and admin on a quiet site. Add a daily Vercel Cron job (free) that runs a trivial DB query. *(My call.)*

## Left to the builder

- Design of every section beyond the hero (the mockups only cover the hero), using the `frontend-design` skill within the palette and type above.

- Exact schema, column names and migrations approach (SQL files committed in repo).
- Component structure, form library (or none), markdown/rich-text approach for long text.
- Mobile layout details, exact spacing scale, hover and focus styles within the palette.
- Seed/demo content so the site looks complete before the owner fills it in.
- Placeholder copy (written in plain, specific language; no buzzwords).
