'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Branch {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  type: string
}

interface BranchSelectorProps {
  branches: Branch[]
  onBranchSelect: (branchId: string) => void
  selectedBranchId?: string
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 13)
  }, [lat, lng, map])
  return null
}

export default function BranchSelector({ branches, onBranchSelect, selectedBranchId }: BranchSelectorProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState<'map' | 'list'>('map')

  // Default center (Baku, Azerbaijan)
  const defaultCenter = { lat: 40.4093, lng: 49.8671 }

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userLoc)

          // Find nearest branch
          if (branches.length > 0) {
            const nearest = branches.reduce((prev, curr) => {
              const prevDist = getDistance(userLoc, { lat: prev.latitude, lng: prev.longitude })
              const currDist = getDistance(userLoc, { lat: curr.latitude, lng: curr.longitude })
              return currDist < prevDist ? curr : prev
            })
            setNearestBranch(nearest)
          }
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [branches])

  const getDistance = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const mapCenter = userLocation || defaultCenter

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedView('map')}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            selectedView === 'map'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Map View
        </button>
        <button
          onClick={() => setSelectedView('list')}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            selectedView === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          List View
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search branches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Nearest Branch Suggestion */}
      {nearestBranch && !selectedBranchId && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Nearest Branch: {nearestBranch.name}
          </p>
          <p className="text-xs text-blue-600 mb-3">{nearestBranch.address}</p>
          <button
            onClick={() => onBranchSelect(nearestBranch.id)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Select This Branch
          </button>
        </div>
      )}

      {/* Map or List View */}
      {selectedView === 'map' ? (
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />}

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {/* Branch markers */}
            {filteredBranches.map((branch) => (
              <Marker
                key={branch.id}
                position={[branch.latitude, branch.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                    <p className="text-xs text-gray-500 mb-2">Type: {branch.type}</p>
                    <button
                      onClick={() => onBranchSelect(branch.id)}
                      className="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Select
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
              onClick={() => onBranchSelect(branch.id)}
            >
              <h3 className="font-semibold text-gray-900">{branch.name}</h3>
              <p className="text-sm text-gray-600">{branch.address}</p>
              <p className="text-xs text-gray-500 mt-1">Type: {branch.type}</p>
              {userLocation && (
                <p className="text-xs text-blue-600 mt-1">
                  Distance: {getDistance(userLocation, { lat: branch.latitude, lng: branch.longitude }).toFixed(2)} km
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
