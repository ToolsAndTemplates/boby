'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  url: string
  branchName: string
}

export default function QRCodeDisplay({ url, branchName }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then(() => setLoading(false))
        .catch((err) => console.error(err))
    }
  }, [url])

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `qr-${branchName.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const shareQR = async () => {
    if (navigator.share && canvasRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => resolve(blob!))
        })
        const file = new File([blob], `qr-${branchName}.png`, { type: 'image/png' })

        await navigator.share({
          title: `Feedback QR - ${branchName}`,
          text: `Scan to provide feedback for ${branchName}`,
          files: [file],
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {loading && <div className="text-gray-500">Generating QR Code...</div>}
      <canvas ref={canvasRef} className="border rounded" />
      <div className="text-xs text-gray-500 text-center">
        Scan to provide feedback
      </div>
      <div className="flex gap-2 w-full">
        <button
          onClick={downloadQR}
          className="flex-1 px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition"
        >
          Download
        </button>
        <button
          onClick={shareQR}
          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
        >
          Share
        </button>
      </div>
      <div className="text-xs text-gray-400 break-all w-full">
        {url}
      </div>
    </div>
  )
}
