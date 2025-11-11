# Deployment Guide

## Step-by-Step Deployment to Vercel with NeonDB

### 1. Set up NeonDB (Database)

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Choose a project name (e.g., "feedback-system")
4. Select a region (closest to your users)
5. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. Keep this safe - you'll need it for Vercel

### 2. Prepare Your Code

1. Initialize git repository (if not already done):
   ```bash
   cd feedback-system
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/YOUR_USERNAME/feedback-system.git
   git branch -M main
   git push -u origin main
   ```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your NeonDB connection string |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` (will be provided after first deploy) |
   | `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
   | `NODE_ENV` | `production` |

   **Note**: For `NEXTAUTH_URL`, you can initially use a placeholder, then update it after deployment.

6. Click "Deploy"

### 4. Post-Deployment Setup

After the first deployment:

1. **Update NEXTAUTH_URL**:
   - Note your Vercel URL (e.g., `https://feedback-system-abc123.vercel.app`)
   - Go to Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` with your actual URL
   - Redeploy

2. **Set up Database**:

   Option A - Using Vercel CLI (Recommended):
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   vercel link

   # Run database setup
   vercel env pull .env.local
   npm run prisma:push
   npm run prisma:seed
   ```

   Option B - Using your local machine:
   ```bash
   # Create .env.production
   echo "DATABASE_URL=your-neondb-connection-string" > .env.production

   # Push schema
   npx prisma db push

   # Seed data
   npx prisma db seed
   ```

3. **Verify Deployment**:
   - Visit your Vercel URL
   - Go to `/auth/login`
   - Use default credentials:
     - Email: `admin@bankofbaku.com`
     - Password: `admin123`

### 5. Import Bank Locations

If you have the bank locations JSON file:

1. **Upload via Prisma Studio**:
   ```bash
   npx prisma studio
   ```
   Then manually import branches

2. **Or modify seed script** to read from a different location

### 6. Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

## Environment Variables Explained

### Required Variables

**DATABASE_URL**
- Your PostgreSQL connection string from NeonDB
- Must include `?sslmode=require` for NeonDB
- Example: `postgresql://user:pass@host.neon.tech/db?sslmode=require`

**NEXTAUTH_URL**
- Your application's public URL
- Development: `http://localhost:3000`
- Production: `https://your-app.vercel.app`

**NEXTAUTH_SECRET**
- Secret key for signing JWTs
- Generate: `openssl rand -base64 32`
- Keep this secret and never commit to git

### Optional Variables

**MAX_FILE_SIZE**
- Maximum file upload size in bytes
- Default: `10485760` (10MB)

**UPLOAD_DIR**
- Directory for uploaded files
- Default: `./public/uploads`

**NODE_ENV**
- Environment mode
- Production: `production`

## Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push
```

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"
- Verify `DATABASE_URL` is correct
- Ensure `?sslmode=require` is in the connection string
- Check NeonDB dashboard for database status

**Solution**:
```bash
# Test connection locally
npx prisma db push
```

### NextAuth Issues

**Error**: "Invalid callback URL"
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure it includes `https://` for production

**Solution**:
1. Update `NEXTAUTH_URL` in Vercel settings
2. Redeploy

### Build Failures

**Error**: "Module not found"
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### File Upload Issues

**Note**: Vercel has a read-only filesystem except for `/tmp`

For production file uploads, consider:
1. **AWS S3**: Use for persistent storage
2. **Cloudinary**: Image hosting service
3. **Vercel Blob**: Vercel's file storage solution

Update `src/app/api/feedback/route.ts` to use cloud storage.

## Monitoring

1. **Vercel Dashboard**:
   - View deployment logs
   - Monitor performance
   - Check analytics

2. **Prisma Studio**:
   ```bash
   npx prisma studio
   ```
   - View database content
   - Make manual changes

3. **Logs**:
   ```bash
   vercel logs
   ```

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and random
- [ ] `.env` is in `.gitignore`
- [ ] Database connection uses SSL (`?sslmode=require`)
- [ ] Admin password changed from default
- [ ] File upload limits configured
- [ ] CORS settings reviewed

## Updating the Application

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys
# Monitor at: https://vercel.com/dashboard
```

## Backup Strategy

1. **Database Backups**:
   - NeonDB provides automatic backups
   - Configure backup schedule in NeonDB dashboard

2. **Export Data**:
   ```bash
   # Export database
   npx prisma db pull

   # Dump data
   pg_dump $DATABASE_URL > backup.sql
   ```

## Production Checklist

- [ ] Database is set up on NeonDB
- [ ] All environment variables configured
- [ ] Database schema pushed
- [ ] Initial data seeded
- [ ] Default admin password changed
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error monitoring set up
- [ ] Backup strategy implemented

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- NeonDB: [neon.tech/docs](https://neon.tech/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

## Cost Estimate

- **Vercel**: Free tier includes 100GB bandwidth
- **NeonDB**: Free tier includes 0.5GB storage
- **Total**: $0/month for small-scale usage

Both scale with usage on paid plans.
