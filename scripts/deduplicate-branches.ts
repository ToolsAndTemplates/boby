import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

// Calculate distance between two coordinates in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function deduplicate() {
  console.log('Starting deduplication process...\n')

  // Get all branches
  const branches = await prisma.branch.findMany({
    include: {
      feedbacks: true,
    },
    orderBy: { createdAt: 'asc' }, // Keep older ones as primary
  })

  console.log(`Total branches: ${branches.length}`)

  // Group by name (case-insensitive, trimmed)
  const grouped = branches.reduce((acc, branch) => {
    const key = branch.name.trim().toLowerCase()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(branch)
    return acc
  }, {} as Record<string, typeof branches>)

  let totalDeleted = 0

  for (const [name, branchList] of Object.entries(grouped)) {
    if (branchList.length <= 1) continue

    console.log(`\n${name} (${branchList.length} duplicates):`)

    // Keep the one with bank-api- prefix if exists (API is more reliable)
    // Otherwise keep the first one (oldest)
    const apiEntry = branchList.find((b) => b.qrCode?.startsWith('bank-api-'))
    const primaryBranch = apiEntry || branchList[0]

    console.log(`  Keeping: ${primaryBranch.qrCode || 'manual'} [${primaryBranch.latitude}, ${primaryBranch.longitude}]`)

    // Delete all others, but first migrate their feedbacks
    for (const duplicate of branchList) {
      if (duplicate.id === primaryBranch.id) continue

      // Check if this is a true duplicate (within 500 meters)
      const distance = getDistance(
        primaryBranch.latitude,
        primaryBranch.longitude,
        duplicate.latitude,
        duplicate.longitude
      )

      if (distance > 0.5) {
        console.log(`  ⚠️  Skipping ${duplicate.qrCode || 'manual'} - too far (${distance.toFixed(2)} km)`)
        continue
      }

      // Migrate feedbacks to primary branch
      if (duplicate.feedbacks.length > 0) {
        await prisma.feedback.updateMany({
          where: { branchId: duplicate.id },
          data: { branchId: primaryBranch.id },
        })
        console.log(`  Migrated ${duplicate.feedbacks.length} feedbacks from duplicate`)
      }

      // Delete the duplicate
      await prisma.branch.delete({
        where: { id: duplicate.id },
      })

      console.log(`  Deleted: ${duplicate.qrCode || 'manual'} [${duplicate.latitude}, ${duplicate.longitude}]`)
      totalDeleted++
    }
  }

  console.log(`\n\nDeduplication complete!`)
  console.log(`Deleted: ${totalDeleted} duplicate entries`)

  // Show final counts
  const finalCount = await prisma.branch.count()
  const types = await prisma.branch.groupBy({
    by: ['type'],
    _count: { type: true },
  })

  console.log(`\nFinal count: ${finalCount}`)
  console.log('\nBy type:')
  types.forEach((type) => {
    console.log(`  ${type.type}: ${type._count.type}`)
  })

  await prisma.$disconnect()
}

deduplicate()
