import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface RequestData {
  destination: string
  start_date: string
  end_date: string
  travelers: number
}

async function generateQuickPlanWithOpenAI(data: RequestData) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const start = new Date(data.start_date)
  const end = new Date(data.end_date)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const prompt = `Generate travel predictions for ${data.destination}, Malaysia. ${days} days trip.

Return JSON with ACTUAL values (not templates):
{
  "summary": {
    "destination": "${data.destination}",
    "duration": "${days} days",
    "estimatedBudget": "RM 800 - RM 1,500",
    "highlights": ["3 real highlights for ${data.destination}"]
  },
  "predictions": {
    "weather": {
      "temperature": "28-32°C",
      "condition": "Partly Cloudy",
      "icon": "cloud-sun",
      "rainChance": 30,
      "humidity": 75,
      "summary": "Brief weather summary"
    },
    "crowdLevel": {
      "overall": "Medium",
      "percentage": 60,
      "peakHours": "11am - 2pm",
      "summary": "Brief crowd summary",
      "data": [{"time":"6am","level":15},{"time":"8am","level":35},{"time":"10am","level":55},{"time":"12pm","level":75},{"time":"2pm","level":70},{"time":"4pm","level":60},{"time":"6pm","level":45},{"time":"9pm","level":25}]
    },
    "pricing": {
      "trend": "stable",
      "percentChange": -5,
      "summary": "Brief price summary"
    },
    "traffic": {
      "peakDelay": "15-25 min",
      "summary": "Brief traffic summary",
      "data": [{"time":"6am","level":20},{"time":"8am","level":75},{"time":"10am","level":45},{"time":"12pm","level":50},{"time":"2pm","level":40},{"time":"4pm","level":55},{"time":"6pm","level":80},{"time":"9pm","level":30}]
    },
    "hotelOccupancy": {
      "percentage": 65,
      "summary": "Brief availability summary"
    }
  },
  "topAttractions": [
    {"name": "Attraction 1", "type": "Culture", "tip": "Visit tip"},
    {"name": "Attraction 2", "type": "Nature", "tip": "Visit tip"},
    {"name": "Attraction 3", "type": "Food", "tip": "Visit tip"},
    {"name": "Attraction 4", "type": "Culture", "tip": "Visit tip"},
    {"name": "Attraction 5", "type": "Adventure", "tip": "Visit tip"}
  ],
  "alerts": [
    {"type": "crowd", "title": "Alert title", "description": "Alert description", "level": "warning", "location": "Place name"},
    {"type": "weather", "title": "Alert title", "description": "Alert description", "level": "info", "location": "Place name"},
    {"type": "price", "title": "Alert title", "description": "Alert description", "level": "success", "location": "Place name"}
  ],
  "quickTips": [
    {"title": "Tip 1", "description": "Tip description"},
    {"title": "Tip 2", "description": "Tip description"},
    {"title": "Tip 3", "description": "Tip description"},
    {"title": "Tip 4", "description": "Tip description"}
  ]
}

IMPORTANT: Replace ALL placeholder values with REAL data for ${data.destination}. Do NOT use pipe characters or template text. Use real attraction names, real tips, real weather conditions (pick ONE: Sunny, Partly Cloudy, Cloudy, or Rainy). Valid JSON only.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Malaysian travel advisor. Return concise JSON with general destination predictions. Focus on practical travel information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
  }

  const apiData = await response.json()
  const content = apiData.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content received from OpenAI')
  }

  return JSON.parse(content)
}

// Default fallback data
function getDefaultQuickData(destination: string, days: number, travelers: number) {
  return {
    summary: {
      destination,
      duration: `${days} days`,
      travelers,
      dateRange: 'Selected dates',
      estimatedBudget: 'RM 500 - RM 1,500 per person',
      highlights: ['Rich cultural heritage', 'Delicious local cuisine', 'Beautiful scenery'],
      bestTimeToVisit: 'Early morning or late afternoon',
      travelTip: 'Book accommodations in advance during peak season'
    },
    predictions: {
      weather: {
        temperature: '28-33°C',
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        rainChance: 30,
        humidity: 75,
        summary: 'Typical tropical weather expected',
        forecast: Array.from({ length: days }, (_, i) => ({
          day: `Day ${i + 1}`,
          condition: 'Partly Cloudy',
          temp: '29°C',
          rain: 25
        }))
      },
      crowdLevel: {
        overall: 'Medium',
        percentage: 60,
        summary: 'Moderate crowds expected during your visit',
        data: [
          { time: '6am', level: 15 },
          { time: '8am', level: 35 },
          { time: '10am', level: 55 },
          { time: '12pm', level: 75 },
          { time: '2pm', level: 70 },
          { time: '4pm', level: 60 },
          { time: '6pm', level: 45 },
          { time: '9pm', level: 25 }
        ],
        peakHours: '11am - 2pm',
        bestTimeToVisit: 'Early morning or evening'
      },
      pricing: {
        trend: 'stable',
        percentChange: -5,
        summary: 'Prices are stable for this period',
        breakdown: {
          accommodation: 'RM 80 - RM 300/night',
          food: 'RM 30 - RM 80/day',
          transport: 'RM 20 - RM 50/day',
          activities: 'RM 30 - RM 100/day'
        }
      },
      traffic: {
        summary: 'Moderate traffic, avoid rush hours',
        peakDelay: '15-25 min',
        data: [
          { time: '6am', level: 20 },
          { time: '8am', level: 75 },
          { time: '10am', level: 45 },
          { time: '12pm', level: 50 },
          { time: '2pm', level: 40 },
          { time: '4pm', level: 55 },
          { time: '6pm', level: 80 },
          { time: '9pm', level: 30 }
        ]
      },
      hotelOccupancy: {
        percentage: 65,
        level: 'Medium',
        summary: 'Good availability expected'
      }
    },
    topAttractions: [
      { name: 'Main Historical Site', category: 'Culture', crowdLevel: 'Medium', estimatedTime: '2-3 hours', tip: 'Visit early morning' },
      { name: 'Local Market', category: 'Food', crowdLevel: 'High', estimatedTime: '1-2 hours', tip: 'Best in the evening' },
      { name: 'Nature Park', category: 'Nature', crowdLevel: 'Low', estimatedTime: '3-4 hours', tip: 'Bring water and sunscreen' },
      { name: 'Cultural Museum', category: 'Culture', crowdLevel: 'Low', estimatedTime: '1-2 hours', tip: 'Free entry on weekends' },
      { name: 'Scenic Viewpoint', category: 'Nature', crowdLevel: 'Medium', estimatedTime: '1 hour', tip: 'Best at sunset' }
    ],
    alerts: [
      { type: 'weather', title: 'Afternoon Showers', description: 'Brief rain showers common in the afternoon', level: 'info', location: destination },
      { type: 'crowd', title: 'Weekend Rush', description: 'Popular spots get crowded on weekends', level: 'warning', location: 'Tourist Areas' },
      { type: 'price', title: 'Good Deals', description: 'Off-peak pricing available for accommodations', level: 'success', location: 'City Center' }
    ],
    quickTips: [
      { title: 'Stay Hydrated', description: 'Carry water, tropical weather can be dehydrating' },
      { title: 'Local Transport', description: 'Use Grab app for convenient transportation' },
      { title: 'Cash Ready', description: 'Some local vendors only accept cash' },
      { title: 'Sun Protection', description: 'Bring sunscreen and hat for outdoor activities' }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: RequestData = await request.json()

    // Validation
    if (!data.destination || !data.start_date || !data.end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: destination, start_date, end_date' },
        { status: 400 }
      )
    }

    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Generate quick prediction with OpenAI (no file storage)
    let quickPrediction
    try {
      quickPrediction = await generateQuickPlanWithOpenAI(data)
    } catch (openAIError) {
      console.error('OpenAI error, using fallback:', openAIError)
      quickPrediction = getDefaultQuickData(data.destination, days, data.travelers || 1)
    }

    // Return directly without storing to file
    return NextResponse.json({
      success: true,
      data: quickPrediction
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate quick prediction'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Quick Generate API - General destination predictions',
    features: [
      'General destination overview',
      'Weather & crowd predictions',
      'Top attractions',
      'Quick tips',
      'No data storage'
    ]
  })
}
