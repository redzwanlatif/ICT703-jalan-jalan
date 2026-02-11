import { NextRequest, NextResponse } from 'next/server'

// Get OpenAI API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface TravelerPreferences {
  travelStyle: string
  crowdTolerance: string
  preferredSeasons?: string[]
  budgetMin?: string
  budgetMax?: string
  safetyOptions: {
    avoidLateNight: boolean
    preferWellLit: boolean
    verifiedTransport: boolean
  }
  notifications: {
    crowd: boolean
    weather: boolean
    price: boolean
    safety: boolean
  }
}

interface Traveler {
  name: string
  gender?: string
  preferences: TravelerPreferences
}

interface TripDetails {
  destination: string
  start_date: string
  end_date: string
}

interface RequestData {
  group_id: string
  trip_details: TripDetails
  travelers: Traveler[]
}

// Function to generate travel plan with OpenAI
async function generateTravelPlanWithOpenAI(data: RequestData) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.')
  }

  // Calculate number of days
  const start = new Date(data.trip_details.start_date)
  const end = new Date(data.trip_details.end_date)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Extract all budget ranges from travelers
  const budgets = data.travelers.map(t => ({
    min: parseFloat((t.preferences.budgetMin || '0').toString().replace(/[^0-9.]/g, '')) || 0,
    max: parseFloat((t.preferences.budgetMax || '5000').toString().replace(/[^0-9.]/g, '')) || 5000
  }))

  // Find the overlapping budget range (max of mins, min of maxes)
  const groupBudgetMin = Math.max(...budgets.map(b => b.min))
  const groupBudgetMax = Math.min(...budgets.map(b => b.max))

  const planTemplate = `{
      "pricePerPerson": "RM X,XXX",
      "description": "Max 10 words",
      "crowdLevel": "Low/Medium/High Crowd",
      "keyFeatures": ["4 short features, 5 words each"],
      "benefits": ["4 short benefits, 5 words each"],
      "bestWindow": {"optimalPeriod": "Date range","priceAdvantage": "X% lower/higher","priceDirection": "lower|higher","crowdLevel": "Low/Medium/High"},
      "analytics": {
        "weather": {"temperature":"28-32°C","condition":"Sunny|Cloudy|Rainy","icon":"sun|cloud-sun|cloud|cloud-rain","rainChance":30,"humidity":75,"summary":"Max 8 words"},
        "priceIndex": {"percentChange":-10,"trend":"up|down|stable","hotels":-12,"flights":-8,"activities":-5,"summary":"Max 8 words"},
        "hotelOccupancy": {"percentage":65,"level":"Low|Medium|High","summary":"Max 8 words"},
        "crowdLevel": {"data":[{"time":"6am","level":15},{"time":"8am","level":35},{"time":"10am","level":55},{"time":"12pm","level":75},{"time":"2pm","level":70},{"time":"4pm","level":60},{"time":"6pm","level":45},{"time":"9pm","level":25}],"peakTime":"11am-2pm","summary":"Max 8 words"},
        "traffic": {"data":[{"time":"6am","level":20},{"time":"8am","level":75},{"time":"10am","level":45},{"time":"12pm","level":50},{"time":"2pm","level":40},{"time":"4pm","level":55},{"time":"6pm","level":80},{"time":"9pm","level":30}],"peakDelay":"15-25 min","summary":"Max 8 words"}
      },
      "sustainability": {"waterUsage":{"value":50,"level":"Low|Medium|High"},"wasteGeneration":{"value":40,"level":"Low|Medium|High"},"energyConsumption":{"value":55,"level":"Low|Medium|High"},"localBusinessSupport":"Low|Medium|High","infrastructurePressure":"Low|Medium|High","culturalPreservation":"Negative|Neutral|Positive"},
      "alerts": {
        "crowd":[{"title":"5 words max","location":"Real attraction name","time":"When","level":"HIGH|MEDIUM|LOW","levelType":"danger|warning|info|success","description":"Max 12 words","suggestion":"Max 10 words"}],
        "weather":[{"title":"5 words","location":"Real place name","time":"When","level":"WARNING|INFO","levelType":"warning|info","description":"Max 12 words","suggestion":"Max 10 words"}],
        "price":[{"title":"5 words","location":"Real venue name","time":"When","level":"DEAL|INFO","levelType":"success|info","description":"Max 12 words","suggestion":"Max 10 words"}],
        "safety":[{"title":"5 words","location":"Real street name","time":"When","level":"CAUTION|INFO","levelType":"warning|info","description":"Max 12 words","suggestion":"Max 10 words"}]
      },
      "suggestions":[{"title":"3-4 words","description":"Max 10 words"},{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}]
    }`

  const prompt = `Generate EXACTLY 3 travel plans for ${data.trip_details.destination}, Malaysia. ${days} days, ${data.travelers.length} travelers.

BUDGET: RM ${groupBudgetMin}-${groupBudgetMax} per person

CRITICAL: The "plans" object MUST have EXACTLY 3 sibling keys at the same level (not nested inside each other).

Return this EXACT structure:
{
  "summary": {
    "destination": "${data.trip_details.destination}",
    "duration": "${days} days",
    "travelers": ${data.travelers.length},
    "dateRange": "${data.trip_details.start_date} to ${data.trip_details.end_date}",
    "groupBudget": "RM ${groupBudgetMin} - RM ${groupBudgetMax}",
    "highlights": ["highlight1", "highlight2", "highlight3"]
  },
  "plans": {
    "Budget Friendly": ${planTemplate},
    "Balanced Explorer": ${planTemplate},
    "Premium Experience": ${planTemplate}
  }
}

RULES:
- plans object MUST contain EXACTLY 3 keys as SIBLINGS (not nested)
- Each plan must have unique name, price, and different data values
- Use real ${data.trip_details.destination} locations for alerts
- 8 data points for charts, 4 suggestions per plan
- Keep all text under 10 words
- Valid JSON only`

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
          content: `Malaysian travel planner. Return concise JSON only. Keep all text fields under 10 words.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
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

  const travelPlan = JSON.parse(content)

  // Fix nested plans structure if OpenAI returned them incorrectly nested
  if (travelPlan.plans) {
    const flatPlans: Record<string, any> = {}

    const extractPlans = (obj: any, depth = 0) => {
      if (depth > 5) return // Prevent infinite recursion

      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && 'pricePerPerson' in value) {
          // This is a plan object - extract it
          const planCopy = { ...value as Record<string, any> }
          // Remove any nested plans from this plan
          for (const [innerKey, innerValue] of Object.entries(planCopy)) {
            if (innerValue && typeof innerValue === 'object' && 'pricePerPerson' in innerValue) {
              delete planCopy[innerKey]
              // Also extract the nested plan
              extractPlans({ [innerKey]: innerValue }, depth + 1)
            }
          }
          flatPlans[key] = planCopy
        }
      }
    }

    extractPlans(travelPlan.plans)

    // If we found plans, use the flattened version
    if (Object.keys(flatPlans).length > 0) {
      travelPlan.plans = flatPlans
    }
  }

  return travelPlan
}

// Default fallback plan data
function getDefaultPlanData(destination: string, days: number, travelers: number) {
  const createDefaultPlan = (name: string, price: string, crowd: string, priceDir: string) => ({
    pricePerPerson: price,
    description: `A ${name.toLowerCase()} approach to exploring ${destination}`,
    crowdLevel: crowd,
    keyFeatures: [
      'Curated attractions and activities',
      'Flexible scheduling options',
      'Local dining recommendations',
      'Transportation guidance'
    ],
    benefits: [
      'Personalized experience',
      'Time-efficient planning',
      'Cost-effective choices',
      'Memorable moments'
    ],
    bestWindow: {
      optimalPeriod: 'Check dates for optimal timing',
      priceAdvantage: '10-15% lower',
      priceDirection: priceDir,
      crowdLevel: 'Medium'
    },
    analytics: {
      weather: {
        temperature: '28-33°C',
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        rainChance: 30,
        humidity: 75,
        summary: 'Typical tropical weather expected'
      },
      priceIndex: {
        percentChange: -10,
        trend: 'down',
        hotels: -12,
        flights: -8,
        activities: -5,
        summary: 'Moderate pricing for the period'
      },
      hotelOccupancy: {
        percentage: 65,
        level: 'Medium',
        summary: 'Good availability expected'
      },
      crowdLevel: {
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
        peakTime: '11am-2pm',
        summary: 'Visit early morning for fewer crowds'
      },
      traffic: {
        data: [
          { time: '6am', level: 20 },
          { time: '8am', level: 75 },
          { time: '10am', level: 45 },
          { time: '12pm', level: 50 },
          { time: '2pm', level: 40 },
          { time: '4pm', level: 55 },
          { time: '6pm', level: 80 },
          { time: '9pm', level: 30 }
        ],
        peakDelay: '15-25 min',
        summary: 'Avoid rush hours 8-9am and 5-7pm'
      }
    },
    sustainability: {
      waterUsage: { value: 50, level: 'Medium' },
      wasteGeneration: { value: 40, level: 'Low' },
      energyConsumption: { value: 55, level: 'Medium' },
      localBusinessSupport: 'Medium',
      infrastructurePressure: 'Medium',
      culturalPreservation: 'Positive'
    },
    alerts: {
      crowd: [
        { title: 'Crowd Alert', location: 'Main Square', time: 'Weekends', level: 'MEDIUM', levelType: 'warning', description: 'Moderate crowds expected.', suggestion: 'Visit on weekdays.' }
      ],
      weather: [
        { title: 'Weather Notice', location: 'Waterfront Area', time: 'Afternoon', level: 'INFO', levelType: 'info', description: 'Afternoon showers common.', suggestion: 'Carry an umbrella.' }
      ],
      price: [
        { title: 'Price Alert', location: 'Holiday Inn Express', time: 'Current', level: 'DEAL', levelType: 'success', description: 'Good rates available.', suggestion: 'Book in advance.' }
      ],
      safety: [
        { title: 'Safety Tip', location: 'Night Market Street', time: 'Night', level: 'CAUTION', levelType: 'warning', description: 'Stay in well-lit areas.', suggestion: 'Use verified transport.' }
      ]
    },
    suggestions: [
      { title: 'Early Bird Visits', description: 'Start your day early to beat the crowds at popular attractions.' },
      { title: 'Local Cuisine', description: 'Try local restaurants for authentic flavors and better value.' },
      { title: 'Book Ahead', description: 'Reserve accommodations and activities in advance.' },
      { title: 'Stay Flexible', description: 'Keep some free time for spontaneous discoveries.' }
    ]
  })

  return {
    summary: {
      destination,
      duration: `${days} days`,
      travelers,
      dateRange: 'Selected dates',
      groupBudget: 'Flexible',
      highlights: [`Explore ${destination}`, 'Experience local culture', 'Create lasting memories']
    },
    plans: {
      'Serenity Escape': createDefaultPlan('Peaceful', 'RM 1,200', 'Low-Medium Crowd', 'lower'),
      'Adventure Blend': createDefaultPlan('Balanced', 'RM 1,000', 'Medium Crowd', 'lower'),
      'Smart Saver': createDefaultPlan('Budget-Friendly', 'RM 800', 'Medium-High Crowd', 'lower')
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: RequestData = await request.json()

    // Validation
    const requiredFields = ['group_id', 'trip_details', 'travelers'] as const
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    if (!data.trip_details.destination || !data.trip_details.start_date || !data.trip_details.end_date) {
      return NextResponse.json(
        { success: false, error: 'trip_details must contain: destination, start_date, end_date' },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.travelers)) {
      return NextResponse.json(
        { success: false, error: 'travelers must be an array' },
        { status: 400 }
      )
    }

    // Calculate days for fallback
    const start = new Date(data.trip_details.start_date)
    const end = new Date(data.trip_details.end_date)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Generate travel plan with OpenAI
    let generatedPlan
    try {
      generatedPlan = await generateTravelPlanWithOpenAI(data)
    } catch (openAIError) {
      generatedPlan = getDefaultPlanData(data.trip_details.destination, days, data.travelers.length)
    }

    return NextResponse.json({
      success: true,
      message: 'Travel plan generated successfully',
      plan: generatedPlan
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate/save travel plan'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Travel Plan API v3 - Optimized & Fast',
    features: [
      '3 unique plans (concise content)',
      'Fast response with gpt-4o-mini',
      '8-point chart data',
      '1 alert per category',
      '4 suggestions per plan'
    ]
  })
}
