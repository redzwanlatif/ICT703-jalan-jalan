/**
 * OpenAI Service for Travel Plan Generation
 *
 * This service handles communication with OpenAI API to generate
 * personalized travel plans based on user preferences and trip details.
 */

export interface TravelPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: Array<{
    name: string;
    preferences: {
      travelStyle: string;
      crowdTolerance: string;
      preferredSeason: string;
      safetyOptions: {
        avoidLateNight: boolean;
        preferWellLit: boolean;
        verifiedTransport: boolean;
      };
      budgetMin: string;
      budgetMax: string;
      notifications: {
        crowd: boolean;
        weather: boolean;
        price: boolean;
        safety: boolean;
      };
    };
  }>;
}

export interface DailyItinerary {
  day: number;
  date: string;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    description: string;
    estimatedCost?: string;
    duration?: string;
    notes?: string;
  }>;
  meals: Array<{
    meal: string;
    restaurant: string;
    cuisine: string;
    estimatedCost: string;
  }>;
  accommodation?: {
    name: string;
    type: string;
    estimatedCost: string;
  };
  totalEstimatedCost: string;
}

export interface GeneratedTravelPlan {
  summary: {
    destination: string;
    duration: string;
    travelers: number;
    travelStyle: string;
    estimatedTotalCost: string;
    highlights: string[];
  };
  itinerary: DailyItinerary[];
  recommendations: {
    bestTimeToVisit: string;
    packingTips: string[];
    localTips: string[];
    safetyTips: string[];
  };
  budgetBreakdown: {
    accommodation: string;
    food: string;
    activities: string;
    transportation: string;
    miscellaneous: string;
    total: string;
  };
}

/**
 * Generate travel plan using OpenAI API
 */
export async function generateTravelPlanWithOpenAI(
  request: TravelPlanRequest,
  apiKey: string
): Promise<GeneratedTravelPlan> {
  // Calculate number of days
  const start = new Date(request.startDate);
  const end = new Date(request.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Build prompt from user preferences
  const preferencesSummary = request.travelers.map((t, idx) => {
    const prefs = t.preferences;
    return `Traveler ${idx + 1} (${t.name}):
- Travel Style: ${prefs.travelStyle}
- Crowd Tolerance: ${prefs.crowdTolerance}
- Preferred Holiday/Event Period: ${prefs.preferredSeason || 'Any'}
- Budget Range: RM ${prefs.budgetMin || '0'} - RM ${prefs.budgetMax || 'Unlimited'}
- Safety Preferences: ${prefs.safetyOptions.avoidLateNight ? 'Avoid late night activities, ' : ''}${prefs.safetyOptions.preferWellLit ? 'Prefer well-lit areas, ' : ''}${prefs.safetyOptions.verifiedTransport ? 'Use verified transport' : ''}`;
  }).join('\n\n');

  const prompt = `You are an expert travel planner specializing in Malaysian destinations. Create a detailed, personalized ${days}-day travel itinerary for ${request.destination}.

TRAVELER PREFERENCES:
${preferencesSummary}

TRIP DETAILS:
- Destination: ${request.destination}
- Start Date: ${request.startDate}
- End Date: ${request.endDate}
- Duration: ${days} days
- Number of Travelers: ${request.travelers.length}

REQUIREMENTS:
1. Create a day-by-day itinerary with specific activities, times, and locations
2. Include breakfast, lunch, and dinner recommendations with restaurant names and cuisine types
3. Provide estimated costs in Malaysian Ringgit (RM)
4. Consider safety preferences (avoid late night if requested, prefer well-lit areas, verified transport)
5. Match the travel style (${request.travelers[0].preferences.travelStyle})
6. Respect crowd tolerance preferences (${request.travelers[0].preferences.crowdTolerance})
7. Stay within budget constraints if provided
8. Include local tips, packing suggestions, and safety recommendations
9. Make it practical and realistic for ${request.destination}

OUTPUT FORMAT (JSON only, no markdown):
{
  "summary": {
    "destination": "${request.destination}",
    "duration": "${days} days",
    "travelers": ${request.travelers.length},
    "travelStyle": "${request.travelers[0].preferences.travelStyle}",
    "estimatedTotalCost": "RM X,XXX",
    "highlights": ["highlight 1", "highlight 2", "highlight 3"]
  },
  "itinerary": [
    {
      "day": 1,
      "date": "${request.startDate}",
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "location": "Location name",
          "description": "Detailed description",
          "estimatedCost": "RM XX",
          "duration": "2 hours",
          "notes": "Optional notes"
        }
      ],
      "meals": [
        {
          "meal": "Breakfast",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "estimatedCost": "RM XX"
        }
      ],
      "accommodation": {
        "name": "Hotel/Accommodation name",
        "type": "Type (e.g., 3-star hotel)",
        "estimatedCost": "RM XXX per night"
      },
      "totalEstimatedCost": "RM XXX"
    }
  ],
  "recommendations": {
    "bestTimeToVisit": "Description",
    "packingTips": ["tip 1", "tip 2"],
    "localTips": ["tip 1", "tip 2"],
    "safetyTips": ["tip 1", "tip 2"]
  },
  "budgetBreakdown": {
    "accommodation": "RM X,XXX",
    "food": "RM X,XXX",
    "activities": "RM X,XXX",
    "transportation": "RM X,XXX",
    "miscellaneous": "RM XXX",
    "total": "RM X,XXX"
  }
}

Return ONLY valid JSON, no additional text or markdown formatting.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model, can upgrade to gpt-4 if needed
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Always respond with valid JSON only, no markdown or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' } // Force JSON response
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    const travelPlan = JSON.parse(content) as GeneratedTravelPlan;

    // Validate structure
    if (!travelPlan.itinerary || !Array.isArray(travelPlan.itinerary)) {
      throw new Error('Invalid travel plan structure received from OpenAI');
    }

    return travelPlan;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}
