'use client'

import { useState } from 'react'
import QRCodeDisplay from './QRCodeDisplay'

interface BranchCardProps {
  branch: {
    id: string
    name: string
    address: string
    type: string
    latitude: number
    longitude: number
    feedbackCount: number
    averageRating: number
  }
}

export default function BranchCard({ branch }: BranchCardProps) {
  const [showQR, setShowQR] = useState(false)

  const feedbackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/feedback?branch=${branch.id}`

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{branch.name}</h3>
          <p className="text-sm text-gray-500">{branch.type}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
          {branch.type}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{branch.address}</p>

      <div className="flex items-center justify-between text-sm mb-4">
        <div>
          <span className="text-gray-500">Feedback:</span>
          <span className="font-semibold ml-2">{branch.feedbackCount}</span>
        </div>
        <div>
          <span className="text-gray-500">Rating:</span>
          <span className="font-semibold ml-2">
            {branch.averageRating > 0 ? branch.averageRating.toFixed(1) : 'N/A'}
          </span>
          {branch.averageRating > 0 && <span className="text-yellow-500 ml-1">★</span>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
        <a
          href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm text-center"
        >
          Map
        </a>
      </div>

      {showQR && (
        <div className="mt-4 pt-4 border-t">
          <QRCodeDisplay url={feedbackUrl} branchName={branch.name} />
        </div>
      )}
    </div>
  )
}
