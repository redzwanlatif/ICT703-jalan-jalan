import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.group_id || !data.trip_details || !data.travelers || !data.generated_plan) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: group_id, trip_details, travelers, generated_plan' },
        { status: 400 }
      )
    }

    const groupId = data.group_id.replace(/[^a-zA-Z0-9_-]/g, '')
    const timestamp = Math.floor(Date.now() / 1000)
    const filename = `data-group-${groupId}-${timestamp}.json`

    const tripData = {
      group_id: data.group_id,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      timestamp,
      trip_details: data.trip_details,
      travelers: data.travelers,
      selected_plan: data.selected_plan || null,
      generated_plan: data.generated_plan,
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        success: true,
        file: filename,
        url: null,
        message: 'Plan saved locally (blob storage not configured)',
      })
    }

    const blob = await put(
      `data-travel-group-5/${filename}`,
      JSON.stringify(tripData, null, 2),
      { access: 'public', contentType: 'application/json' }
    )

    return NextResponse.json({
      success: true,
      file: filename,
      url: blob.url,
      message: 'Travel plan saved successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save travel plan',
      },
      { status: 500 }
    )
  }
}
