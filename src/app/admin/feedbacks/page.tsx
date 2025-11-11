import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import FeedbackList from '@/components/admin/FeedbackList'

export default async function FeedbacksPage() {
  const session = await auth()

  // Get all feedback with files and branch info
  const feedbacks = await db.feedback.findMany({
    include: {
      branch: true,
      files: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Feedback</h1>
        <div className="text-sm text-gray-500">
          Total: {feedbacks.length} responses
        </div>
      </div>

      <FeedbackList
        feedbacks={feedbacks}
        isAdmin={session?.user?.role === 'ADMIN'}
      />
    </div>
  )
}
