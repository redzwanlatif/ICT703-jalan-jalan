import { NextRequest, NextResponse } from 'next/server';

// Hardcoded responses for demo - simulates AI travel assistant for Melaka
const responses: Record<string, string> = {
  // Greetings
  "hello": "Hello! Welcome to Trevllo.ai! I'm here to help you plan your trip to Melaka. What would you like to know about?",
  "hi": "Hi there! Ready to explore Melaka? I can help with crowd levels, weather, itinerary planning, budget tips, and local recommendations!",
  "hey": "Hey! Great to see you! Planning a trip to Melaka? Let me help you make it amazing!",

  // Crowd related
  "crowd": `**Crowd Levels in Melaka:**

📍 **Jonker Street Night Market**
- Weekends (Fri-Sun): 🔴 HIGH (6-10 PM)
- Weekdays: 🟢 LOW to MEDIUM
- Best time: Tuesday-Thursday evenings

📍 **A Famosa & St. Paul's Hill**
- Mornings (8-10 AM): 🟢 LOW
- Afternoons: 🟡 MEDIUM
- Best time: Early morning or late afternoon

📍 **Melaka River Cruise**
- Weekends: 🟡 MEDIUM to HIGH
- Weekdays: 🟢 LOW
- Best time: Weekday evenings for sunset views

Would you like specific timing recommendations?`,

  "jonker": `**Jonker Street Night Market Info:**

🕐 **Operating Hours:** Friday-Sunday, 6 PM - 12 AM

🔴 **Peak Hours:** 7-9 PM (very crowded)
🟢 **Best Time to Visit:** 6 PM (early) or after 10 PM

**Tips:**
- Arrive early to find parking
- Try the famous chicken rice balls
- Don't miss the antique shops
- Bring cash for street vendors

Would you like restaurant recommendations nearby?`,

  // Weather related
  "weather": `**Melaka Weather Forecast:**

🌡️ **Temperature:** 28-33°C (typical tropical climate)
💧 **Humidity:** 70-85%
🌧️ **Rain Chance:** 30% (afternoon thunderstorms possible)

**Best Times to Visit:**
- Morning: 8-11 AM (cooler, less humid)
- Evening: 5-7 PM (sunset activities)

**Recommendation:** Carry an umbrella for afternoon showers. Indoor attractions like museums are great during hot afternoons!

Need activity suggestions based on weather?`,

  // Budget related
  "budget": `**Melaka Budget Guide (per person/day):**

💰 **Budget Traveler:** RM 100-150
- Hostel: RM 30-50
- Street food: RM 30-40
- Transport: RM 20
- Activities: RM 20-40

💎 **Mid-Range:** RM 250-400
- 3-star hotel: RM 100-150
- Restaurants: RM 60-80
- Grab/taxi: RM 40
- Activities: RM 50-100

✨ **Comfortable:** RM 500+
- 4-5 star hotel: RM 200+
- Fine dining: RM 100+
- Private transport: RM 100
- Premium experiences: RM 100+

Would you like specific budget tips?`,

  // Food related
  "food": `**Must-Try Melaka Food:**

🍗 **Chicken Rice Balls** - Hoe Kee or Famosa
🍜 **Nyonya Laksa** - Nancy's Kitchen
🥘 **Satay Celup** - Capitol Satay
🧁 **Cendol** - Jonker 88
🥟 **Dim Sum** - Restoran Hwa Mei

**Food Streets:**
- Jonker Street (night market)
- Kampung Kuli (local favorites)
- Heeren Street (Peranakan cuisine)

**Budget Tip:** Street food is delicious and affordable (RM 5-15 per dish)!

Want me to create a food itinerary?`,

  // Itinerary related
  "itinerary": `**3-Day Melaka Itinerary:**

**Day 1: Heritage Walk**
🌅 Morning: A Famosa → St. Paul's Hill
🌞 Afternoon: Stadthuys → Maritime Museum
🌙 Evening: Melaka River Cruise → Jonker Street

**Day 2: Culture & Food**
🌅 Morning: Baba Nyonya Heritage Museum
🌞 Afternoon: Kampung Morten → Little India
🌙 Evening: Satay Celup dinner

**Day 3: Nature & Shopping**
🌅 Morning: Melaka Zoo or Butterfly Farm
🌞 Afternoon: Dataran Pahlawan Mall
🌙 Evening: Sunset at Melaka Straits Mosque

Would you like details on any specific day?`,

  // Attractions
  "attractions": `**Top Melaka Attractions:**

🏛️ **Historical Sites**
- A Famosa (Portuguese fortress)
- St. Paul's Church (hilltop ruins)
- Stadthuys (Dutch architecture)
- Christ Church (iconic red building)

🎭 **Museums**
- Baba Nyonya Heritage Museum
- Maritime Museum (ship replica)
- Sultanate Palace Museum

🌊 **Experiences**
- Melaka River Cruise (RM 30)
- Jonker Street Night Market (free)
- Melaka Straits Mosque (free)

🎢 **Family Fun**
- Melaka Zoo
- The Shore Sky Tower
- Upside Down House

Which attraction interests you most?`,

  // Transport
  "transport": `**Getting Around Melaka:**

🚶 **Walking** - Best for heritage zone (most attractions within walking distance)

🛺 **Trishaw** - RM 40-50/hour (fun experience!)

🚗 **Grab** - RM 5-15 within city

🚌 **Panorama Melaka Bus** - RM 2 (hop-on hop-off)

🚗 **From KL:**
- Bus: RM 15-25 (2 hours)
- Drive: 1.5-2 hours via highway

**Tip:** Park at Dataran Pahlawan and walk to attractions!

Need parking recommendations?`,

  // Safety
  "safety": `**Melaka Safety Tips:**

✅ **Generally Safe** - Melaka is tourist-friendly

⚠️ **Precautions:**
- Keep valuables secure at night markets
- Use registered taxis or Grab
- Stay in well-lit areas after dark
- Drink bottled water

🏥 **Emergency Contacts:**
- Police: 999
- Ambulance: 999
- Tourism Hotline: 1-300-88-5050

📍 **Safe Areas at Night:**
- Jonker Street (weekends)
- Hotel areas
- Dataran Pahlawan

Would you like hospital/clinic locations?`,

  // Default responses
  "1": "Great choice! Let me check the crowd levels for you...\n\n" +
    "📍 **Current Crowd Status in Melaka:**\n" +
    "- Jonker Street: 🟡 MEDIUM\n" +
    "- A Famosa: 🟢 LOW\n" +
    "- River Cruise: 🟢 LOW\n\n" +
    "Best time to visit popular spots is early morning (8-10 AM) or late evening (after 9 PM).",

  "2": "I'd love to help plan your itinerary! For Melaka, I recommend 2-3 days to cover the main attractions.\n\n" +
    "**Quick Suggestions:**\n" +
    "- Day 1: Heritage Walk (A Famosa, Stadthuys, St. Paul's)\n" +
    "- Day 2: Culture & Food (Museums, Jonker Street)\n" +
    "- Day 3: River Cruise & Shopping\n\n" +
    "Would you like a detailed day-by-day plan?",

  "3": "Let me check the weather for Melaka!\n\n" +
    "🌡️ **Current Conditions:** 30°C, Partly Cloudy\n" +
    "🌧️ **Rain Chance:** 30% (afternoon showers possible)\n\n" +
    "**Best travel months:** March-October (less rain)\n" +
    "**Tip:** Morning activities are best to avoid afternoon heat!",

  "4": "Budget planning made easy! Here's a quick breakdown for Melaka:\n\n" +
    "💰 **Budget:** RM 100-150/day\n" +
    "💎 **Mid-range:** RM 250-400/day\n" +
    "✨ **Luxury:** RM 500+/day\n\n" +
    "Most attractions are affordable (RM 10-30). Street food is amazing and cheap!",

  "5": "Here are my top local recommendations for Melaka:\n\n" +
    "🍗 **Food:** Chicken Rice Balls at Hoe Kee\n" +
    "☕ **Cafe:** The Daily Fix for coffee\n" +
    "🛍️ **Shopping:** Jonker Street for antiques\n" +
    "📸 **Photo Spot:** Street art at Heeren Street\n\n" +
    "What type of experience are you looking for?",

  "6": "I hope you're safe! Here's emergency info for Melaka:\n\n" +
    "🚨 **Emergency:** 999\n" +
    "🏥 **Nearest Hospital:** Mahkota Medical Centre\n" +
    "👮 **Police:** Melaka Central Police Station\n" +
    "📞 **Tourism Hotline:** 1-300-88-5050\n\n" +
    "Is there anything specific you need help with?",
};

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();

  // Check for exact matches first
  if (responses[lowerMessage]) {
    return responses[lowerMessage];
  }

  // Check for keyword matches
  const keywords = [
    { keys: ["crowd", "busy", "packed", "crowded"], response: responses["crowd"] },
    { keys: ["jonker", "night market"], response: responses["jonker"] },
    { keys: ["weather", "rain", "hot", "temperature", "climate"], response: responses["weather"] },
    { keys: ["budget", "money", "cost", "price", "expensive", "cheap"], response: responses["budget"] },
    { keys: ["food", "eat", "restaurant", "hungry", "dinner", "lunch", "breakfast"], response: responses["food"] },
    { keys: ["itinerary", "plan", "schedule", "days", "trip"], response: responses["itinerary"] },
    { keys: ["attraction", "visit", "see", "places", "sightseeing", "tourist"], response: responses["attractions"] },
    { keys: ["transport", "bus", "taxi", "grab", "drive", "car", "getting around"], response: responses["transport"] },
    { keys: ["safety", "safe", "emergency", "police", "hospital", "danger"], response: responses["safety"] },
    { keys: ["hello", "hi", "hey", "good morning", "good afternoon"], response: responses["hello"] },
    { keys: ["melaka", "malacca"], response: `Great choice! Melaka is a UNESCO World Heritage city with rich history and amazing food!\n\nWhat would you like to know?\n1. Crowd levels\n2. Itinerary planning\n3. Weather\n4. Budget tips\n5. Local recommendations\n6. Safety info` },
  ];

  for (const { keys, response } of keywords) {
    if (keys.some(key => lowerMessage.includes(key))) {
      return response;
    }
  }

  // Default response
  return `Thanks for your message! I'm your Melaka travel assistant. Here's how I can help:

1. **Crowd Levels** - Check busy times at attractions
2. **Itinerary Planning** - Get day-by-day plans
3. **Weather Info** - Best times to visit
4. **Budget Tips** - Cost breakdowns
5. **Local Recommendations** - Food, attractions, shopping
6. **Safety Info** - Emergency contacts

Just type a number or ask me anything about Melaka!`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));

    const reply = getResponse(message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Sorry, I encountered an error. Please try again!" },
      { status: 500 }
    );
  }
}
