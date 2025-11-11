import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function reset() {
  console.log('Deleting all branches...')

  // Delete all branches (this will cascade delete feedbacks too)
  const deleted = await prisma.branch.deleteMany({})

  console.log(`Deleted ${deleted.count} branches`)
  console.log('\nNow run: curl -X POST http://localhost:3000/api/branches/sync')

  await prisma.$disconnect()
}

reset()
