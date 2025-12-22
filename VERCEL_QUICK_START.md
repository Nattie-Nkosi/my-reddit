# Vercel Deployment - Quick Start Checklist

Use this quick reference while deploying. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Pre-Deployment Checklist

### ⚠️ Critical: Fix Database First
- [ ] Your project uses **SQLite** which **DOES NOT WORK** on Vercel
- [ ] Choose: Vercel Postgres OR Neon (see DEPLOYMENT.md Phase 1)
- [ ] Update `prisma/schema.prisma` to use PostgreSQL
- [ ] Run migrations with new database

### Prepare Code
- [ ] Remove test error page (optional): `rm -rf src/app/test-errors`
- [ ] Run build locally: `npm run build` (fix any errors)
- [ ] Commit all changes: `git add . && git commit -m "Prepare for deployment"`
- [ ] Push to GitHub: `git push origin main`

### Environment Variables Needed
- [ ] `GITHUB_CLIENT_ID` - from GitHub OAuth app
- [ ] `GITHUB_CLIENT_SECRET` - from GitHub OAuth app
- [ ] `AUTH_SECRET` - generate with: `openssl rand -base64 32`
- [ ] `DATABASE_URL` - your PostgreSQL connection string (if using Neon/external)

---

## Deployment Steps

### 1. Vercel Setup
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `myreddit` repository

### 2. Configure & Deploy
1. Framework: **Next.js** (auto-detected)
2. Add environment variables (see above)
3. Click **Deploy**
4. Wait 2-5 minutes

### 3. Set Up Database (if using Vercel Postgres)
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Connect to your project (auto-adds env vars)
3. Run migration:
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

### 4. Update GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click your OAuth app
3. Update:
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

### 5. Test Deployment
- [ ] Visit your Vercel URL
- [ ] Test sign in
- [ ] Check 404 page works
- [ ] Review logs for errors

---

## Quick Commands

```bash
# Generate AUTH_SECRET
openssl rand -base64 32

# Deploy from CLI
npx vercel --prod

# Pull environment variables
npx vercel env pull .env.local

# Run Prisma migration
npx prisma migrate deploy

# View logs
npx vercel logs
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, ensure all env vars are set |
| Database connection fails | Verify DATABASE_URL is correct |
| OAuth error | Update GitHub OAuth callback URL |
| Prisma errors | Add `"postinstall": "prisma generate"` to package.json (already added) |

---

## After Deployment

- [ ] Update project README with production URL
- [ ] Set up custom domain (optional)
- [ ] Monitor error logs for issues
- [ ] Celebrate! 🎉

---

**Stuck?** See detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md)
