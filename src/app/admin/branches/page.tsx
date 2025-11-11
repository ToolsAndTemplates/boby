import { db } from '@/lib/db'
import BranchCard from '@/components/admin/BranchCard'
import Link from 'next/link'

export default async function BranchesPage() {
  const branches = await db.branch.findMany({
    include: {
      _count: {
        select: { feedbacks: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Get all ratings at once grouped by branch
  const ratings = await db.feedback.groupBy({
    by: ['branchId'],
    _avg: {
      rating: true,
    },
  })

  // Create a map for quick lookup
  const ratingsMap = new Map(
    ratings.map((r) => [r.branchId, r._avg.rating || 0])
  )

  // Combine branch data with ratings
  const branchesWithStats = branches.map((branch) => ({
    ...branch,
    feedbackCount: branch._count.feedbacks,
    averageRating: ratingsMap.get(branch.id) || 0,
  }))

  // Group by type
  const branchesByType = branchesWithStats.reduce((acc, branch) => {
    if (!acc[branch.type]) {
      acc[branch.type] = []
    }
    acc[branch.type].push(branch)
    return acc
  }, {} as Record<string, typeof branchesWithStats>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Branches</h1>
      </div>

      {Object.entries(branchesByType).map(([type, branchList]) => (
        <div key={type} className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">
            {type} ({branchList.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchList.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
