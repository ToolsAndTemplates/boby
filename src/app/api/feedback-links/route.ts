import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    const links = await db.feedbackLink.findMany({
      include: {
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching feedback links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, branchId, description, expiresAt, maxUsage } = body

    // Generate unique slug
    const slug = nanoid(10)

    const link = await db.feedbackLink.create({
      data: {
        name,
        branchId: branchId || null,
        slug,
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUsage: maxUsage || null,
      },
      include: {
        branch: true,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback link:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback link' },
      { status: 500 }
    )
  }
}
