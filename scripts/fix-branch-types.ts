import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function fixBranchTypes() {
  console.log('Starting to fix branch types...')

  // Get all branches with their current types
  const branches = await prisma.branch.findMany()

  const typeMapping: Record<string, string> = {
    'Branch': 'Branches',
    'branch': 'Branches',
    'Branches': 'Branches',
    'branches': 'Branches',

    'ATM': 'ATMs',
    'atm': 'ATMs',
    'ATMs': 'ATMs',
    'atms': 'ATMs',

    'Payment Terminal': 'Payment Terminals',
    'Payment terminal': 'Payment Terminals',
    'Payment terminals': 'Payment Terminals',
    'payment terminal': 'Payment Terminals',
    'payment terminals': 'Payment Terminals',
  }

  let updated = 0
  let skipped = 0

  for (const branch of branches) {
    const normalizedType = typeMapping[branch.type] || branch.type

    if (normalizedType !== branch.type) {
      await prisma.branch.update({
        where: { id: branch.id },
        data: { type: normalizedType },
      })
      console.log(`Updated: "${branch.type}" → "${normalizedType}" for ${branch.name}`)
      updated++
    } else {
      skipped++
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`)

  // Show final distribution
  const finalTypes = await prisma.branch.groupBy({
    by: ['type'],
    _count: { type: true },
  })

  console.log('\nFinal type distribution:')
  finalTypes.forEach((type) => {
    console.log(`  ${type.type}: ${type._count.type}`)
  })
}

fixBranchTypes()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
