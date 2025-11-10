import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  // Get statistics
  const [totalBranches, totalFeedback, recentFeedback] = await Promise.all([
    db.branch.count(),
    db.feedback.count(),
    db.feedback.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        branch: true,
      },
    }),
  ])

  const averageRating = await db.feedback.aggregate({
    _avg: {
      rating: true,
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Branches</h3>
          <p className="text-3xl font-bold mt-2">{totalBranches}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Feedback</h3>
          <p className="text-3xl font-bold mt-2">{totalFeedback}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-3xl font-bold mt-2">
            {averageRating._avg.rating?.toFixed(1) || 'N/A'}
          </p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Feedback</h2>
        </div>
        <div className="p-6">
          {recentFeedback.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No feedback yet</p>
          ) : (
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{feedback.branch.name}</h3>
                      <p className="text-sm text-gray-500">{feedback.category}</p>
                      {feedback.comment && (
                        <p className="text-gray-700 mt-2">{feedback.comment}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-bold">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/branches"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition text-center"
        >
          <h3 className="text-xl font-semibold">Manage Branches</h3>
          <p className="text-sm mt-2 opacity-90">View and manage all branches</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition text-center"
        >
          <h3 className="text-xl font-semibold">View Analytics</h3>
          <p className="text-sm mt-2 opacity-90">Detailed feedback analytics</p>
        </Link>
      </div>
    </div>
  )
}
