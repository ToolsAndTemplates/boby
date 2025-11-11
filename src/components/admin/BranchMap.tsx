'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Branch {
  id: string
  name: string
  address: string
  type: string
  latitude: number
  longitude: number
  feedbackCount: number
  averageRating: number
}

interface BranchMapProps {
  branches: Branch[]
}

// Fix for default marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Custom markers by type
const getMarkerColor = (type: string) => {
  if (type.toLowerCase().includes('atm')) return 'blue'
  if (type.toLowerCase().includes('branch')) return 'green'
  return 'orange'
}

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

function MapBounds({ branches }: { branches: Branch[] }) {
  const map = useMap()

  useEffect(() => {
    if (branches.length > 0) {
      const bounds = L.latLngBounds(
        branches.map((b) => [b.latitude, b.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [branches, map])

  return null
}

export default function BranchMap({ branches }: BranchMapProps) {
  // Default center (Baku, Azerbaijan)
  const defaultCenter: [number, number] = [40.4093, 49.8671]

  return (
    <div className="h-[600px] w-full">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds branches={branches} />
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            position={[branch.latitude, branch.longitude]}
            icon={createCustomIcon(getMarkerColor(branch.type))}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{branch.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{branch.type}</p>
                <p className="text-sm mb-2">{branch.address}</p>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Feedback:</span>
                    <span className="font-semibold">{branch.feedbackCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating:</span>
                    <span className="font-semibold">
                      {branch.averageRating > 0
                        ? `${branch.averageRating.toFixed(1)} ⭐`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <a
                  href={`/feedback?branch=${branch.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 px-3 py-1 bg-blue-600 text-white text-center rounded text-sm hover:bg-blue-700"
                >
                  Submit Feedback
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
