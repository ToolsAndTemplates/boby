import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    const session = await auth()

    // Require authentication to view feedback links
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const session = await auth()

    // Check authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create feedback links
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create feedback links' },
        { status: 403 }
      )
    }

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
        createdBy: session.user?.email || undefined,
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
