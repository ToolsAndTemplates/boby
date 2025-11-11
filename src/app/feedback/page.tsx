'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import FeedbackForm from '@/components/feedback/FeedbackForm'

const BranchSelector = dynamic(() => import('@/components/feedback/BranchSelector'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>,
})

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

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
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
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map/Branch Selector Section */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-6 sticky top-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Select Your Branch
                  </h2>
                  {selectedBranch && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        ✓ Selected: {branches.find(b => b.id === selectedBranch)?.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {branches.find(b => b.id === selectedBranch)?.address}
                      </p>
                    </div>
                  )}
                </div>
                <BranchSelector
                  branches={branches}
                  onBranchSelect={handleBranchSelect}
                  selectedBranchId={selectedBranch}
                />
              </div>
            </div>

            {/* Feedback Form Section */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
                <FeedbackForm
                  branches={branches}
                  initialBranchId={selectedBranch}
                />
              </div>
            </div>
          </div>
        )}

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
