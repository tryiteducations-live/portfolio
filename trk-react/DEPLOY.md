# tatulabs.in — Deployment Guide

## Stack
- React 18 + Vite + TypeScript
- GSAP (ScrollTrigger animations)
- Lenis (butter-smooth scrolling)
- Framer Motion (page animations)
- Supabase (certifications + gallery database)
- Tailwind CSS v4
- Cloudflare Pages (hosting)

## Step 1 — Add your photo
Copy your profile photo as `public/photo.jpg`

## Step 2 — Configure Supabase
1. Go to supabase.com → your project → Settings → API
2. Copy Project URL and anon key
3. Edit `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_PASSWORD=your-secure-password
   ```
4. Run `SUPABASE_SETUP.sql` in Supabase SQL Editor

## Step 3 — Run locally
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Step 4 — Add HCL Guvi cert number
Go to `/admin` → Certs tab → Add New Certification:
- Issuer: HCL · GUVI
- Name: Full Stack Web Development
- Cert Number: your-actual-number
- Issued Date: 2024
- Skill Domain: Web Development
- Sector: aigrc

## Step 5 — Deploy to Cloudflare Pages
Your repo is already on GitHub and connected to Cloudflare.

Build settings in Cloudflare Pages:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 18 (set in Environment variables: NODE_VERSION=18)

Add environment variables in Cloudflare Pages dashboard:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_ADMIN_PASSWORD

Then push to GitHub — Cloudflare auto-deploys.

## Step 6 — Admin panel
Visit `tatulabs.in/admin`
- Add certifications (they appear live on the site)
- Add gallery images (paste any image URL)
- Check build status

## Future updates
- Push to GitHub = auto-deploy
- Add certs via /admin — no code needed
- Add gallery images via /admin — no code needed
- Substack articles load automatically from RSS
