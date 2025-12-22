# Deploying MyReddit to Vercel

This guide will walk you through deploying your MyReddit application to Vercel.

## ⚠️ Important: Database Migration Required

**Your project currently uses SQLite, which DOES NOT work on Vercel** (serverless environment has no persistent file storage).

You have two options:

### Option A: Use Vercel Postgres (Recommended)
- Free tier available
- Managed by Vercel
- Easy setup

### Option B: Use External PostgreSQL
- Neon (free tier)
- Supabase (free tier)
- PlanetScale (MySQL - requires schema changes)
- Railway

---

## Step-by-Step Deployment Guide

### Phase 1: Prepare Your Database (Choose Option A or B)

#### **Option A: Vercel Postgres**

1. **Install Vercel Postgres Package**
   ```bash
   npm install @vercel/postgres
   ```

2. **Update Prisma Schema**
   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }
   ```

3. **You'll set up the database after connecting to Vercel** (see Phase 3)

#### **Option B: Neon (Free PostgreSQL)**

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up with GitHub
   - Create a new project

2. **Get Connection String**
   - Copy the connection string (looks like: `postgresql://user:pass@host/db`)

3. **Update Prisma Schema**
   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update `.env` locally** (for testing):
   ```
   DATABASE_URL="your-neon-connection-string"
   ```

5. **Run Migration**
   ```bash
   npx prisma migrate dev --name init_postgres
   ```

---

### Phase 2: Prepare GitHub Repository

1. **Check Git Status**
   ```bash
   git status
   ```

2. **Remove Test Error Page** (optional, recommended for production)
   ```bash
   rm -rf src/app/test-errors
   git add .
   git commit -m "Remove test error page for production"
   ```

3. **Ensure .gitignore is Correct**
   Make sure these are in `.gitignore`:
   ```
   .env.local
   .env
   node_modules/
   .next/
   prisma/dev.db
   ```

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

   If you don't have a GitHub repository yet:
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/myreddit.git
   git branch -M main
   git push -u origin main
   ```

---

### Phase 3: Deploy to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Authorize Vercel to access your repositories

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `myreddit` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   AUTH_SECRET=generate_random_secret_here
   ```

   **Generate AUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

   **If using Option A (Vercel Postgres):**
   - Don't add DATABASE_URL yet, we'll do this in Phase 4

   **If using Option B (Neon or other):**
   - Add `DATABASE_URL=your_connection_string`

5. **Click "Deploy"**
   - Wait for the build to complete (2-5 minutes)
   - Note the deployment URL (e.g., `myreddit-xyz.vercel.app`)

---

### Phase 4: Set Up Database (If Using Vercel Postgres)

1. **Add Vercel Postgres**
   - Go to your Vercel project dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Create"

2. **Connect to Project**
   - Vercel automatically adds these environment variables:
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - And others

3. **Run Prisma Migration**
   - Go to project settings → Environment Variables
   - Copy the `POSTGRES_PRISMA_URL` value
   - Run locally:
     ```bash
     DATABASE_URL="your_postgres_prisma_url" npx prisma migrate dev --name init
     ```
   - Or use Vercel CLI:
     ```bash
     npx vercel env pull .env.local
     npx prisma migrate deploy
     ```

4. **Redeploy**
   - Push a commit or trigger a redeploy in Vercel dashboard

---

### Phase 5: Configure GitHub OAuth

Your deployed app needs updated OAuth callback URLs:

1. **Go to GitHub Developer Settings**
   - https://github.com/settings/developers
   - Click on your OAuth App

2. **Update URLs**
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

3. **For Development** (keep existing):
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:3000/api/auth/callback/github`

   *Note: You may need to create a separate OAuth app for production*

---

### Phase 6: Test Your Deployment

1. **Visit Your Site**
   - Go to `https://your-app.vercel.app`

2. **Test Authentication**
   - Click "Sign In"
   - Authorize with GitHub
   - Verify you're signed in

3. **Test Error Pages**
   - Visit `/this-does-not-exist` (should show 404)

4. **Check Logs**
   - Vercel Dashboard → Your Project → Logs
   - Check for any errors

---

## Post-Deployment Checklist

- [ ] Database is connected and working
- [ ] GitHub OAuth is working
- [ ] Environment variables are set
- [ ] Site loads without errors
- [ ] Authentication works
- [ ] Error pages display correctly
- [ ] Update CLAUDE.md with production URL

---

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Check that `DATABASE_URL` environment variable is set correctly in Vercel

### Issue: "OAuth redirect_uri mismatch"
**Solution**: Update GitHub OAuth app callback URL to match your Vercel domain

### Issue: "Module not found" errors
**Solution**:
- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy

### Issue: "Prisma Client not generated"
**Solution**: Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

---

## Useful Vercel Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from command line
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View logs
vercel logs
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `POSTGRES_PRISMA_URL` | Yes (Vercel Postgres) | Prisma connection string |
| `POSTGRES_URL_NON_POOLING` | Yes (Vercel Postgres) | Direct connection string |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app secret |
| `AUTH_SECRET` | Yes | Random secret for NextAuth |

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure monitoring/analytics
3. Set up error tracking (Sentry)
4. Enable HTTPS (automatic on Vercel)
5. Set up CI/CD for automated deployments

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org
