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
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data)
        setLoading(false)
        if (branchId && data.some((b: any) => b.id === branchId)) {
          setSelectedBranch(branchId)
          setShowMap(false)
        }
      })
      .catch((err) => {
        console.error('Error loading branches:', err)
        setLoading(false)
      })
  }, [branchId])

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId)
    setShowMap(false)
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Your Branch
                </h2>
                {showMap ? (
                  <BranchSelector
                    branches={branches}
                    onBranchSelect={handleBranchSelect}
                    selectedBranchId={selectedBranch}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        Branch Selected: {branches.find(b => b.id === selectedBranch)?.name}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {branches.find(b => b.id === selectedBranch)?.address}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowMap(true)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Change Branch
                    </button>
                  </div>
                )}
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
