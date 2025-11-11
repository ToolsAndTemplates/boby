import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function findDuplicates() {
  const branches = await prisma.branch.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      qrCode: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { name: 'asc' },
  })

  // Group by name
  const grouped = branches.reduce((acc, branch) => {
    if (!acc[branch.name]) {
      acc[branch.name] = []
    }
    acc[branch.name].push(branch)
    return acc
  }, {} as Record<string, typeof branches>)

  console.log('Branches with duplicates:\n')

  let totalDuplicates = 0
  Object.entries(grouped).forEach(([name, branchList]) => {
    if (branchList.length > 1) {
      console.log(`${name} (${branchList.length} times):`)
      branchList.forEach((b) => {
        const source = b.qrCode && b.qrCode.startsWith('bank-api-') ? 'API' : 'Manual'
        console.log(`  - ${source}: ${b.address} [${b.latitude}, ${b.longitude}] (qrCode: ${b.qrCode || 'null'})`)
      })
      console.log()
      totalDuplicates += branchList.length - 1
    }
  })

  console.log(`\nTotal duplicate entries: ${totalDuplicates}`)
  console.log(`Unique branches: ${Object.keys(grouped).length}`)
  console.log(`Total in database: ${branches.length}`)

  await prisma.$disconnect()
}

findDuplicates()
