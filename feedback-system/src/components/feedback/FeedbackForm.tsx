'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedbackSchema, type FeedbackFormData } from '@/types'

interface FeedbackFormProps {
  branches: Array<{
    id: string
    name: string
    type: string
    address: string
  }>
  initialBranchId: string
}

const categories = [
  'Service Quality',
  'Cleanliness',
  'Speed of Service',
  'Staff Behavior',
  'Facilities',
  'Other',
]

export default function FeedbackForm({ branches, initialBranchId }: FeedbackFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      branchId: initialBranchId,
      rating: 0,
    },
  })

  const selectedRating = watch('rating')

  const onSubmit = async (data: FeedbackFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccess(true)
        reset()
        setTimeout(() => setSuccess(false), 5000)
      } else {
        alert('Failed to submit feedback. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Thank you for your feedback!
        </div>
      )}

      {/* Branch Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Branch <span className="text-red-500">*</span>
        </label>
        <select
          {...register('branchId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a branch...</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.type}
            </option>
          ))}
        </select>
        {errors.branchId && (
          <p className="text-red-500 text-sm mt-1">{errors.branchId.message}</p>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                {...register('rating', { valueAsNumber: true })}
                value={rating}
                className="sr-only"
              />
              <span
                className={`text-4xl ${
                  selectedRating >= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register('category')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Comments (Optional)
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us more about your experience..."
        />
      </div>

      {/* Contact Information */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Contact Information (Optional)</h3>
        <div className="space-y-3">
          <input
            type="text"
            {...register('customerName')}
            placeholder="Your Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            {...register('customerEmail')}
            placeholder="Your Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.customerEmail && (
            <p className="text-red-500 text-sm">{errors.customerEmail.message}</p>
          )}
          <input
            type="tel"
            {...register('customerPhone')}
            placeholder="Your Phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 font-medium text-lg"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
