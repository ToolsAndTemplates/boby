'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import FeedbackForm from '@/components/feedback/FeedbackForm'

function FeedbackContent() {
  const searchParams = useSearchParams()
  const branchId = searchParams.get('branch')
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<string>(branchId || '')

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data)
        setLoading(false)
        if (branchId && data.some((b: any) => b.id === branchId)) {
          setSelectedBranch(branchId)
        }
      })
      .catch((err) => {
        console.error('Error loading branches:', err)
        setLoading(false)
      })
  }, [branchId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Customer Feedback
            </h1>
            <p className="text-gray-600">
              We value your feedback. Please share your experience with us.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <FeedbackForm
              branches={branches}
              initialBranchId={selectedBranch}
            />
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Your feedback helps us improve our services</p>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  )
}
