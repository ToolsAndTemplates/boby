# Cloudflare R2 Setup Guide

## Current Issue
You're seeing: `AccessDenied: Access Denied` when uploading files.

## Quick Fix Options

### Option 1: Disable File Uploads (Temporary)
If you don't need file uploads right now, they're already handled gracefully. Feedback submissions work without files.

### Option 2: Fix R2 Configuration (Recommended)

## Step-by-Step R2 Setup

### 1. Test Your Local Configuration

Run the diagnostic script:
```bash
npx tsx scripts/test-r2-connection.ts
```

This will check:
- ✅ Environment variables are set
- ✅ R2 client can connect
- ✅ Bucket exists and is accessible
- ✅ You have write permissions

### 2. Get R2 Credentials from Cloudflare

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Navigate to: **R2** → **Overview**

2. **Create or Check Your Bucket**
   - Click "Create bucket" or use existing bucket
   - Note the bucket name (case-sensitive!)
   - Example: `feedback-uploads`

3. **Create API Token**
   - Click "Manage R2 API Tokens"
   - Click "Create API Token"
   - **Important**: Select **"Object Read & Write"** permissions
   - Scope: Select your specific bucket or "All buckets"
   - Click "Create API Token"

4. **Copy Credentials**
   You'll see:
   ```
   Access Key ID: abc123...
   Secret Access Key: xyz789...
   Account ID: your-account-id
   ```
   ⚠️ **Save these immediately** - you can't see the secret key again!

### 3. Update Local Environment Variables

Edit `.env.local`:
```bash
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### 4. Test Again
```bash
npx tsx scripts/test-r2-connection.ts
```

You should see:
```
✅ All tests passed! R2 is configured correctly.
```

### 5. Update Vercel Environment Variables

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add/Update these variables:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
3. **Important**: Set them for "Production", "Preview", and "Development"
4. Redeploy your application

## Common Errors & Solutions

### Error: AccessDenied
**Cause**: API token doesn't have write permissions

**Fix**:
1. Go to R2 dashboard
2. Create new API token with "Object Read & Write"
3. Update credentials

### Error: NoSuchBucket
**Cause**: Bucket name is wrong or doesn't exist

**Fix**:
1. Check bucket name (case-sensitive!)
2. Verify bucket exists in R2 dashboard
3. Update `R2_BUCKET_NAME` in env

### Error: InvalidAccessKeyId
**Cause**: Access Key ID is incorrect

**Fix**:
1. Verify you copied the complete Access Key ID
2. No extra spaces or characters
3. Generate new token if needed

### Error: SignatureDoesNotMatch
**Cause**: Secret Access Key is incorrect

**Fix**:
1. Generate a new API token
2. Copy credentials carefully
3. Update both local and Vercel env vars

## Verify It's Working

1. **Local Test**: Run the diagnostic script ✅
2. **Production Test**:
   - Go to: https://boby-pied.vercel.app/feedback
   - Fill out form with an image attached
   - Submit
   - Check Vercel logs for success

## Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use different tokens for development and production
- ✅ Rotate API tokens regularly
- ✅ Use bucket-specific permissions (not "All buckets")

## Need Help?

If you're still seeing errors:
1. Check Vercel deployment logs
2. Look for the specific error code
3. Verify all environment variables are set correctly
4. Make sure you clicked "Redeploy" after updating env vars

## Alternative: Use Different Storage

If R2 is too complex, consider:
- AWS S3 (similar to R2)
- Vercel Blob Storage (simpler, built-in)
- Disable file uploads entirely (already handled in code)
