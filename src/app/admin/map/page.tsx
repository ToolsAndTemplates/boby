import { db } from '@/lib/db'
import BranchMap from '@/components/admin/BranchMap'

export default async function MapPage() {
  const branches = await db.branch.findMany({
    include: {
      _count: {
        select: { feedbacks: true },
      },
    },
  })

  const branchesWithStats = await Promise.all(
    branches.map(async (branch) => {
      const avgRating = await db.feedback.aggregate({
        where: { branchId: branch.id },
        _avg: { rating: true },
      })

      return {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        type: branch.type,
        latitude: branch.latitude,
        longitude: branch.longitude,
        feedbackCount: branch._count.feedbacks,
        averageRating: avgRating._avg.rating || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Branch Map</h1>
        <div className="text-sm text-gray-600">
          Total Branches: {branches.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <BranchMap branches={branchesWithStats} />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Legend</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-600"></div>
            <span>ATMs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-green-600"></div>
            <span>Branches</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-orange-600"></div>
            <span>Payment Terminals</span>
          </div>
        </div>
      </div>
    </div>
  )
}
