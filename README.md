# ROI Internal (MVP)

Next.js (App Router) + Supabase (Auth + Postgres). Internal multi-user app (no tenant isolation).

## Setup
1) Create project in Supabase. Enable Email/Password auth (disable confirmations for MVP).
2) Run `supabase.sql` in Supabase SQL Editor (keep RLS OFF on these tables).
3) Copy env from `.env.example` to `.env.local` with your Supabase URL and anon key.
4) Install & run:

```bash
npm i
npm run dev
```

Open http://localhost:3000

- Register a user at `/register`, login at `/login`.
- Create clients and portfolios under `/app`.

## Deploy
Use Vercel. Add env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in project settings.
Add your Vercel domain to Supabase Auth Redirect URLs.
