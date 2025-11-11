import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, label, type, required, options, placeholder, order, active } = body

    const field = await db.customField.update({
      where: { id },
      data: {
        name,
        label,
        type,
        required,
        options: options ? JSON.stringify(options) : null,
        placeholder,
        order,
        active,
      },
    })

    return NextResponse.json(field)
  } catch (error) {
    console.error('Error updating custom field:', error)
    return NextResponse.json(
      { error: 'Failed to update custom field' },
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
    await db.customField.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting custom field:', error)
    return NextResponse.json(
      { error: 'Failed to delete custom field' },
      { status: 500 }
    )
  }
}
