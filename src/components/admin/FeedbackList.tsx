'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface FeedbackFile {
  id: string
  filename: string
  filepath: string
  mimetype: string
  size: number
}

interface Feedback {
  id: string
  branchId: string
  rating: number
  category: string
  comment: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  createdAt: Date
  branch: {
    id: string
    name: string
    address: string
  }
  files: FeedbackFile[]
}

interface FeedbackListProps {
  feedbacks: Feedback[]
  isAdmin: boolean
}

export default function FeedbackList({ feedbacks, isAdmin }: FeedbackListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(feedbacks.map((f) => f.category)))

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = filterRating === 'all' || feedback.rating === filterRating
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory

    return matchesSearch && matchesRating && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete feedback')
      }
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('An error occurred while deleting')
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by branch, comment, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFeedbacks.length} of {feedbacks.length} feedback responses
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No feedback found</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feedback.branch.name}
                      </h3>
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-bold text-yellow-700">{feedback.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{feedback.branch.address}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deletingId === feedback.id}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {deletingId === feedback.id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {feedback.category}
                  </span>
                </div>

                {/* Comment */}
                {feedback.comment && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                  </div>
                )}

                {/* Customer Info */}
                {(feedback.customerName || feedback.customerEmail || feedback.customerPhone) && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {feedback.customerName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">👤</span>
                        <span className="text-gray-700">{feedback.customerName}</span>
                      </div>
                    )}
                    {feedback.customerEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">📧</span>
                        <span className="text-gray-700">{feedback.customerEmail}</span>
                      </div>
                    )}
                    {feedback.customerPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">📱</span>
                        <span className="text-gray-700">{feedback.customerPhone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Files */}
                {feedback.files.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Attached Files ({feedback.files.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {feedback.files.map((file) => (
                        <a
                          key={file.id}
                          href={file.filepath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition group"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xl">
                              {file.mimetype.startsWith('image/') ? '🖼️' : '📄'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {file.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <span className="text-blue-600 group-hover:text-blue-700 text-sm font-medium ml-2">
                            Download ↓
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Submitted on {format(new Date(feedback.createdAt), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
