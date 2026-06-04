# PrajapatiParivar.in - Community Web Platform

Welcome to the official repository for **PrajapatiParivar.in**, a modern, responsive, production-ready community website built for the Prajapati Samaj. 

This repository is split into two directories:
* `/backend`: Holds database schema definitions, triggers, Row-Level Security (RLS) configurations, and initial mockup seeds.
* `/frontend`: A Next.js 15 App Router application styled with a cultural terracotta/clay themed Tailwind CSS configuration, Lucide React icons, and Zod/Hook Form validation.

---

## Tech Stack Overview

* **Core Framework:** Next.js 15 (App Router, Server & Client Components)
* **Language:** TypeScript
* **Database & Auth:** Supabase (PostgreSQL database, Auth services, RLS policies, and triggers)
* **Styling:** Tailwind CSS v4, customized with Outfit and Inter fonts
* **Forms & Validation:** React Hook Form + Zod resolvers
* **Icons:** Lucide React

---

## Quick Setup Instructions

### 1. Database Configuration (Backend)
1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your Supabase Dashboard, open the **SQL Editor**.
3. Copy the contents of [`backend/schema.sql`](./backend/schema.sql) and execute it. This initializes all the tables (`member_profiles`, `matrimony_profiles`, `events`, `news`, etc.), registers security functions, and installs row-level access security.
4. *(Optional)* To seed your database with sample news, events, and matrimony groom/bride profiles, copy the contents of [`backend/seeds.sql`](./backend/seeds.sql) and execute it in the SQL Editor.

### 2. Frontend Configuration
1. Open the `/frontend` directory.
2. Create a copy of `.env.example` and name it `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Enter your Supabase Project API URL and Anonymous Key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run Locally
Inside the `/frontend` directory, install packages and start the Next.js development server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note on testing:* The authentication panel is built with dynamic local mock fallbacks. If the Supabase URL is not configured, you can log in using `test@prajapatiparivar.in` or any email containing the word `test` (with any password). The dashboard and protected views will immediately unlock.

---

## Production Deployment Instructions

### Deploying the Frontend (Vercel)
The Next.js 15 application is fully optimized for static exporting and serverless SSR, making Vercel the recommended target:
1. Push your repository code to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and import the repository.
3. Select the **Framework Preset** as `Next.js`.
4. Set the **Root Directory** as `frontend`.
5. Under **Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**. Vercel will build and assign a production URL for your site.

### Deploying the Database (Supabase Production)
Since database schemas are already configured in `schema.sql`, you can secure your database for production by:
1. Keeping Row Level Security (RLS) enabled on all tables (which our `schema.sql` handles automatically).
2. Configuring your **SMTP Server** settings in Supabase Auth -> Providers -> Email, so registration links send from your official custom domain (`info@prajapatiparivar.in`).
3. Configuring database backup intervals from your Supabase Project Settings page.
