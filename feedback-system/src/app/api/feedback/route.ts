import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const branchId = formData.get('branchId') as string
    const rating = parseInt(formData.get('rating') as string)
    const category = formData.get('category') as string
    const comment = formData.get('comment') as string || undefined
    const customerName = formData.get('customerName') as string || undefined
    const customerEmail = formData.get('customerEmail') as string || undefined
    const customerPhone = formData.get('customerPhone') as string || undefined

    // Create feedback record
    const feedback = await db.feedback.create({
      data: {
        branchId,
        rating,
        category,
        comment,
        customerName,
        customerEmail,
        customerPhone,
      },
    })

    // Handle file uploads
    const files = formData.getAll('files') as File[]

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', feedback.id)

      // Ensure upload directory exists
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const filepath = path.join(uploadDir, filename)

          await writeFile(filepath, buffer)

          // Save file reference to database
          await db.feedbackFile.create({
            data: {
              feedbackId: feedback.id,
              filename: file.name,
              filepath: `/uploads/${feedback.id}/${filename}`,
              mimetype: file.type,
              size: file.size,
            },
          })
        }
      }
    }

    return NextResponse.json({ success: true, feedbackId: feedback.id })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedback = await db.feedback.findMany({
      include: {
        branch: true,
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
