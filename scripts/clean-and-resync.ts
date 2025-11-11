import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function cleanAndResync() {
  console.log('Cleaning old API data...')

  // Delete all branches that came from the API (have qrCode starting with 'bank-api-')
  const deleted = await prisma.branch.deleteMany({
    where: {
      qrCode: {
        startsWith: 'bank-api-',
      },
    },
  })

  console.log(`Deleted ${deleted.count} old API locations`)

  console.log('\nNow run the sync API to import fresh data from Bank of Baku API')
  console.log('POST /api/branches/sync')

  await prisma.$disconnect()
}

cleanAndResync()
