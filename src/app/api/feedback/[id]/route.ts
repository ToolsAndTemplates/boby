import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    // Check authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can delete feedback' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if feedback exists
    const feedback = await db.feedback.findUnique({
      where: { id },
      include: { files: true },
    })

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    // Delete feedback (cascades to files automatically due to schema)
    await db.feedback.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete feedback'
    return NextResponse.json(
      { error: 'Failed to delete feedback', details: errorMessage },
      { status: 500 }
    )
  }
}
