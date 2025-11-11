import { S3Client, ListBucketsCommand, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME

async function testR2Connection() {
  console.log('🔍 Testing Cloudflare R2 Connection...\n')

  // Check if environment variables are set
  console.log('1️⃣ Checking Environment Variables:')
  const envVars = {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  }

  let allVarsSet = true
  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.log(`   ❌ ${key}: NOT SET`)
      allVarsSet = false
    } else {
      console.log(`   ✅ ${key}: ${value.substring(0, 10)}...`)
    }
  }

  if (!allVarsSet) {
    console.log('\n❌ Missing environment variables. Please set them in .env.local')
    console.log('\nRequired variables:')
    console.log('- R2_ACCOUNT_ID')
    console.log('- R2_ACCESS_KEY_ID')
    console.log('- R2_SECRET_ACCESS_KEY')
    console.log('- R2_BUCKET_NAME')
    process.exit(1)
  }

  console.log('\n2️⃣ Creating R2 Client...')
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  })
  console.log(`   ✅ Client created with endpoint: ${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`)

  // Test bucket access
  console.log('\n3️⃣ Testing Bucket Access...')
  try {
    await r2Client.send(new HeadBucketCommand({ Bucket: R2_BUCKET_NAME }))
    console.log(`   ✅ Bucket "${R2_BUCKET_NAME}" is accessible`)
  } catch (error: any) {
    console.log(`   ❌ Cannot access bucket "${R2_BUCKET_NAME}"`)
    console.log(`   Error: ${error.message}`)
    console.log('\n📋 Troubleshooting:')
    console.log('   1. Check if bucket exists in Cloudflare R2 dashboard')
    console.log('   2. Verify bucket name is correct (case-sensitive)')
    console.log('   3. Check if API token has access to this bucket')
    process.exit(1)
  }

  // Test file upload
  console.log('\n4️⃣ Testing File Upload...')
  try {
    const testKey = `test/${Date.now()}-test.txt`
    const testContent = 'This is a test file from R2 connection test'

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: testKey,
        Body: testContent,
        ContentType: 'text/plain',
      })
    )
    console.log(`   ✅ Successfully uploaded test file: ${testKey}`)
    console.log(`   ✅ File upload permissions are working!`)
  } catch (error: any) {
    console.log(`   ❌ Failed to upload test file`)
    console.log(`   Error: ${error.message}`)
    console.log(`   Code: ${error.Code || 'Unknown'}`)
    console.log('\n📋 Common Issues:')
    console.log('   1. AccessDenied: API token lacks write permissions')
    console.log('   2. NoSuchBucket: Bucket name is incorrect')
    console.log('   3. InvalidAccessKeyId: Access key is wrong')
    console.log('   4. SignatureDoesNotMatch: Secret key is wrong')
    console.log('\n🔧 How to fix:')
    console.log('   1. Go to Cloudflare Dashboard → R2')
    console.log('   2. Click on "Manage R2 API Tokens"')
    console.log('   3. Create a new token with "Object Read & Write" permissions')
    console.log('   4. Update your .env.local with the new credentials')
    process.exit(1)
  }

  console.log('\n✅ All tests passed! R2 is configured correctly.')
  console.log('\n📝 Next steps:')
  console.log('   1. Make sure these same values are set in Vercel environment variables')
  console.log('   2. Redeploy your application')
}

testR2Connection()
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error)
    process.exit(1)
  })
