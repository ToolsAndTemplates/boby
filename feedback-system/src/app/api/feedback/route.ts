import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      branchId,
      rating,
      category,
      comment,
      customerName,
      customerEmail,
      customerPhone,
    } = body

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
