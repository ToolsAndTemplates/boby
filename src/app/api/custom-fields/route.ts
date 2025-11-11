import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const fields = await db.customField.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(fields)
  } catch (error) {
    console.error('Error fetching custom fields:', error)
    return NextResponse.json(
      { error: 'Failed to fetch custom fields' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, label, type, required, options, placeholder, order, active } = body

    const field = await db.customField.create({
      data: {
        name,
        label,
        type,
        required: required || false,
        options: options ? JSON.stringify(options) : null,
        placeholder,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json(field, { status: 201 })
  } catch (error) {
    console.error('Error creating custom field:', error)
    return NextResponse.json(
      { error: 'Failed to create custom field' },
      { status: 500 }
    )
  }
}
