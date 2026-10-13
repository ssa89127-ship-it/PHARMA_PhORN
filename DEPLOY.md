# 🚀 PharmaHub Deployment Guide

**Project:** `pharma-ph-orn-pe1d` (already linked to Vercel)
**Local Path:** `/Users/saidavzaleshon/.claude/pharmacy-platform/`

---

## Prerequisites (5 min setup)

### 1. Create a Production PostgreSQL Database
**Recommended: Neon (free, serverless, 2 min)**
1. Go to https://neon.tech → Sign up (GitHub/Google)
2. Create Project → Name: `pharmahub-prod`
3. Copy **Connection String** (starts with `postgresql://`)

*Alternatives: Vercel Postgres, Supabase, Railway, Render*

### 2. Generate NextAuth Secret
```bash
openssl rand -base64 32
# Copy the output
```

---

## Deploy to Vercel (3 min)

### Option A: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Find **pharma-ph-orn-pe1d** → Click project
3. **Settings** → **Environment Variables** → Add:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Output from `openssl rand -base64 32` | All |
| `NEXTAUTH_URL` | `https://pharma-ph-orn-pe1d.vercel.app` | Production |
| `GOOGLE_CLIENT_ID` | (optional) | All |
| `GOOGLE_CLIENT_SECRET` | (optional) | All |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (optional) | All |
| `STRIPE_SECRET_KEY` | (optional) | All |
| `STRIPE_WEBHOOK_SECRET` | (optional) | All |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (optional) | All |
| `NEXT_PUBLIC_APP_URL` | `https://pharma-ph-orn-pe1d.vercel.app` | All |
| `NEXT_PUBLIC_APP_NAME` | `PharmaHub` | All |

4. **Deployments** → Click `...` on latest → **Promote to Production**

### Option B: Vercel CLI (From Terminal)
```bash
cd /Users/saidavzaleshon/.claude/pharmacy-platform

# Login if needed
vercel login

# Add environment variables (run each, paste value when prompted)
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... add others as needed

# Deploy to production
vercel --prod
```

---

## Post-Deploy Verification

1. **Visit your URL:** `https://pharma-ph-orn-pe1d.vercel.app`
2. **Test key pages:**
   - `/` — Homepage
   - `/pharmacies` — Pharmacy listings
   - `/medicines` — Medicine catalog
   - `/auth/signin` — Login
   - `/dashboard` — User dashboard

3. **Check database:** Run Prisma Studio locally against prod DB:
   ```bash
   DATABASE_URL="your-neon-url" npx prisma studio
   ```

---

## Google Search Indexing (SEO)

1. Go to https://search.google.com/search-console
2. **Add Property** → URL Prefix → `https://pharma-ph-orn-pe1d.vercel.app`
3. **Verify** (DNS or HTML tag)
4. **Sitemaps** → Add `https://pharma-ph-orn-pe1d.vercel.app/sitemap.xml`
5. **Request Indexing** for key pages

---

## Custom Domain (Optional)

1. Vercel Dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `pharmahub.uz`)
3. Configure DNS as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to new domain

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails: "DATABASE_URL not found" | Add DATABASE_URL in Vercel env vars |
| Prisma errors | Check `vercel-build` script runs `prisma db push` |
| Auth redirect loops | Ensure `NEXTAUTH_URL` matches deployed URL exactly |
| Maps not loading | Add Google Maps API key, enable required APIs |
| 500 errors | Check Vercel Function Logs (Dashboard → Functions) |

---

## Useful Commands

```bash
# Local development with prod DB
DATABASE_URL="neon-url" npm run dev

# Push schema changes to prod DB
DATABASE_URL="neon-url" npm run db:push

# View production logs
vercel logs --follow

# Redeploy without changes
vercel --prod --force
```

---

## File Checklist for Production

- [x] `package.json` — Added `postinstall` and `vercel-build` scripts
- [x] `.env.example` — All required variables documented
- [x] `prisma/schema.prisma` — PostgreSQL provider configured
- [x] `next.config.ts` — Image domains, etc.
- [x] `sitemap.ts` / `robots.ts` — Auto-generated SEO
- [ ] `vercel.json` — (Optional) Custom headers/rewrites

---

**Your live URL will be:** `https://pharma-ph-orn-pe1d.vercel.app`
(Or your custom domain once configured)