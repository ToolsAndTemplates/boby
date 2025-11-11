# Feedback Collection System

A comprehensive feedback collection and management system for bank branches, built with Next.js, PostgreSQL (NeonDB), and deployed on Vercel.

## Features

- **User Authentication**: Secure login system with NextAuth.js
- **Admin Panel**: Complete dashboard for managing feedback and branches
- **Branch Management**: View and manage all ATM, branch, and payment terminal locations
- **QR Code Generation**: Generate and share QR codes for each branch
- **Feedback Form**: Public-facing form with file upload support
- **Analytics Dashboard**: Comprehensive analytics with charts and visualizations
- **Interactive Map**: Leaflet-based map showing all branch locations
- **Multi-language Support**: Database ready for multilingual content

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (NeonDB)
- **Hosting**: Vercel
- **Authentication**: NextAuth.js v5
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **QR Codes**: qrcode library

## Project Structure

```
feedback-system/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/           # Admin panel pages
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── branches/    # Branch management
│   │   │   ├── map/         # Interactive map
│   │   │   ├── analytics/   # Analytics & reports
│   │   │   └── users/       # User management (admin only)
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # NextAuth endpoints
│   │   │   ├── branches/    # Branch data API
│   │   │   └── feedback/    # Feedback submission API
│   │   ├── auth/            # Auth pages
│   │   │   └── login/       # Login page
│   │   └── feedback/        # Public feedback form
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   ├── feedback/        # Feedback form components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility libraries
│   │   ├── auth.ts          # NextAuth configuration
│   │   └── db.ts            # Prisma client
│   └── types/               # TypeScript types
├── prisma/                  # Database schema & seed
│   ├── schema.prisma        # Database models
│   └── seed.ts              # Initial data seeding
└── public/                  # Static assets
    └── uploads/             # User uploaded files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (NeonDB recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database (NeonDB)
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR="./public/uploads"
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Push database schema**
   ```bash
   npm run prisma:push
   ```

6. **Seed the database**

   Copy bank locations from the parent directory:
   ```bash
   npm run prisma:seed
   ```

7. **Run development server**
   ```bash
   npm run dev
   ```

8. **Open browser**

   Navigate to http://localhost:3000

### Default Credentials

After seeding, use these credentials to log in:
- **Email**: admin@bankofbaku.com
- **Password**: admin123

## Database Setup (NeonDB)

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Add to `.env` as `DATABASE_URL`
4. Run migrations: `npm run prisma:push`
5. Seed data: `npm run prisma:seed`

## Deployment (Vercel)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your NeonDB connection string
     - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
     - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - Click "Deploy"

3. **Post-Deployment**
   ```bash
   # Run database migrations (from Vercel dashboard or locally)
   npx prisma db push

   # Seed database (one-time)
   npx prisma db seed
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_URL` | Application URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generate with openssl |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` (10MB) |
| `UPLOAD_DIR` | Upload directory path | `./public/uploads` |

## Features Overview

### Admin Panel
- **Dashboard**: Overview of feedback statistics
- **Branch Management**: View all branches with QR codes and stats
- **Map View**: Interactive map with all branch locations
- **Analytics**: Charts showing rating distribution, feedback trends, and more
- **User Management**: Create and manage admin/user accounts (admin only)

### Public Features
- **Feedback Form**: Easy-to-use form with branch selection
- **Star Rating**: 1-5 star rating system
- **Categories**: Predefined feedback categories
- **File Upload**: Attach images or documents (max 5 files)
- **Optional Contact**: Users can provide contact information

### QR Code Features
- **Generate QR**: Each branch gets a unique QR code
- **Download**: Download QR code as PNG
- **Share**: Native sharing on mobile devices
- **Direct Link**: QR codes link directly to branch-specific feedback form

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:push     # Push schema to database
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database with initial data

# Other
npm run lint            # Run ESLint
```

## API Endpoints

### Public
- `GET /api/branches` - Get all branches
- `POST /api/feedback` - Submit feedback (with file upload)

### Protected (requires authentication)
- `GET /api/feedback` - Get all feedback (admin)
- Additional admin endpoints as needed

## Database Schema

### Models
- **User**: Admin and user accounts
- **Branch**: Bank branch/ATM locations
- **Feedback**: Customer feedback entries
- **FeedbackFile**: Uploaded file attachments

See `prisma/schema.prisma` for complete schema.

## Troubleshooting

### Prisma Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Environment Variables Not Loading
- Ensure `.env` is in the root directory
- Restart the development server after changes
- Check for typos in variable names

### File Upload Issues
- Ensure `public/uploads` directory exists
- Check file size limits in `next.config.js`
- Verify write permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
