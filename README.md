# Portfolio

Personal portfolio with an admin dashboard. Next.js 16, Tailwind CSS 4, Supabase (database, auth, storage), deployed on Vercel. Everything runs on free tiers.

## Setup

1. **Create a Supabase project** at supabase.com (free plan).
2. **Create the database.** In the Supabase dashboard open *SQL Editor*, paste and run `supabase/migrations/0001_init.sql`. To start with demo content, then run `supabase/seed.sql`.
3. **Admin account.** *Authentication → Sign In / Providers*: turn off "Allow new users to sign up". Then *Authentication → Users → Add user*: your email and a strong password. This is the only account that can open `/admin`.
4. **Environment.** Copy `.env.example` to `.env.local` and fill in the values from *Project settings → API* (project URL and anon/publishable key).
5. **Run it.** `npm install`, then `npm run dev` and open http://localhost:3000. The admin is at http://localhost:3000/admin.

## Commands

- `npm run dev` — development server
- `npm test` — unit tests
- `npm run build` — production build
- `npm run lint` — lint

## Deploy to Vercel

1. Import the repository in Vercel.
2. Add the four variables from `.env.example` in *Project → Settings → Environment Variables*. Set `NEXT_PUBLIC_SITE_URL` to your live domain and `CRON_SECRET` to a long random string.
3. Deploy. In Supabase, *Authentication → URL Configuration*, set the site URL to your live domain.

A daily Vercel Cron job calls `/api/keepalive` so the free Supabase project is not paused for inactivity.
