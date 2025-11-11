# Quick Start Guide

Get the feedback system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Git installed
- A NeonDB account (free tier is fine)

## Step 1: Database Setup (2 minutes)

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Login
3. Click "Create Project"
4. Copy your connection string

## Step 2: Project Setup (2 minutes)

```bash
# Navigate to project
cd feedback-system

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your database connection string:
```env
DATABASE_URL="your-neondb-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-openssl-rand-base64-32-to-generate"
```

Generate secret:
```bash
openssl rand -base64 32
```

## Step 3: Initialize Database (1 minute)

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed with initial data (including bank locations)
npm run prisma:seed
```

## Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Login

Go to http://localhost:3000/auth/login

**Default credentials:**
- Email: `admin@bankofbaku.com`
- Password: `admin123`

**IMPORTANT**: Change the password after first login!

## What's Next?

### Explore the Features

1. **Dashboard** (http://localhost:3000/admin/dashboard)
   - View feedback statistics
   - See recent submissions

2. **Branches** (http://localhost:3000/admin/branches)
   - View all bank locations
   - Generate QR codes for each branch
   - Download/share QR codes

3. **Map** (http://localhost:3000/admin/map)
   - Interactive map of all branches
   - Click markers for details

4. **Analytics** (http://localhost:3000/admin/analytics)
   - Rating distributions
   - Feedback by category
   - Trends over time

5. **Test Feedback Form** (http://localhost:3000/feedback)
   - Public-facing feedback form
   - Try submitting feedback
   - Test file uploads

### Customize

1. **Update Bank Locations**:
   - Locations are imported from `../locations/bank_locations.json`
   - Edit `prisma/seed.ts` to import from different source

2. **Change Branding**:
   - Update colors in `tailwind.config.ts`
   - Modify logo in `src/components/admin/AdminNav.tsx`

3. **Add More Users**:
   - Go to `/admin/users` (when implemented)
   - Or use Prisma Studio: `npm run prisma:studio`

## Development Tips

### View Database

```bash
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555

### Reset Database

```bash
# WARNING: This deletes all data!
npx prisma migrate reset
```

### Check Logs

```bash
# Development logs appear in terminal
# Check Vercel logs in production
```

## Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deploy:
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variables
# 4. Deploy
```

## Troubleshooting

### Port 3000 in use

```bash
# Use different port
PORT=3001 npm run dev
```

### Database connection error

- Check `DATABASE_URL` in `.env`
- Ensure NeonDB project is active
- Verify connection string includes `?sslmode=require`

### Prisma errors

```bash
# Regenerate client
npm run prisma:generate

# Reset if needed
npx prisma migrate reset
```

### Module not found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Open an issue on GitHub

## Project Structure

```
feedback-system/
├── src/app/          # Pages & API routes
├── src/components/   # React components
├── src/lib/          # Utilities
├── prisma/           # Database schema
└── public/           # Static files
```

## Key Files

- `prisma/schema.prisma` - Database models
- `src/lib/auth.ts` - Authentication config
- `src/app/api/` - API endpoints
- `.env` - Environment variables (don't commit!)

Enjoy building your feedback system!
