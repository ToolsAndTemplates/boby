import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const link = await db.feedbackLink.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching feedback link:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback link' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, branchId, description, active, expiresAt, maxUsage } = body

    const link = await db.feedbackLink.update({
      where: { id },
      data: {
        name,
        branchId: branchId || null,
        description,
        active,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUsage: maxUsage || null,
      },
      include: {
        branch: true,
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating feedback link:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback link' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.feedbackLink.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feedback link:', error)
    return NextResponse.json(
      { error: 'Failed to delete feedback link' },
      { status: 500 }
    )
  }
}
