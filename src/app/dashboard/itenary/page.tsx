"use client"

import * as React from "react"
import jsPDF from "jspdf"
import { Navigation } from "@/components/shared/navigation"
import TabBar from "@/components/ui/TabBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  MapPin,
  Coins,
  Users2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Wallet,
  Users,
  CalendarDays,
  Heart,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react"

const getReasonIcon = (title: string, severity: "high" | "medium" | "low") => {
  const t = title.toLowerCase()

  const baseClass =
    severity === "high"
      ? "text-red-600"
      : severity === "medium"
      ? "text-yellow-600"
      : "text-slate-500"

  if (t.includes("budget")) return <Wallet className={`size-4 ${baseClass}`} />
  if (t.includes("crowd")) return <Users className={`size-4 ${baseClass}`} />
  if (t.includes("season")) return <CalendarDays className={`size-4 ${baseClass}`} />
  if (t.includes("travel")) return <Heart className={`size-4 ${baseClass}`} />
  if (t.includes("safety") || t.includes("late"))
    return <ShieldAlert className={`size-4 ${baseClass}`} />

  return <AlertTriangle className={`size-4 ${baseClass}`} />
}

/* =======================
   LABEL MAPS
======================= */
const seasonLabels: Record<string, string> = {
  "chinese-new-year": "Chinese New Year",
  "hari-raya-aidilfitri": "Hari Raya Aidilfitri",
  "hari-raya-haji": "Hari Raya Haji",
  deepavali: "Deepavali",
  thaipusam: "Thaipusam",
  wesak: "Wesak Day",
  christmas: "Christmas",
  merdeka: "Merdeka Day",
  "malaysia-day": "Malaysia Day",
  "school-holidays": "School Holidays",
}

const travelStyleLabels: Record<string, string> = {
  "low-budget": "Budget",
  balanced: "Balanced",
  comfortable: "Comfortable",
}

const crowdToleranceLabels: Record<string, string> = {
  "avoid-crowd": "Avoid crowds",
  "okay-crowd": "Okay with crowds",
  "no-preference": "No preference",
}

/* =======================
   DATE HELPERS
======================= */
function parseYMD(dateStr?: string) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}
function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}
// deterministic formatting (avoid locale hydration issues)
function formatDateStable(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${day}/${m}/${y}`
}
function daysBetweenInclusive(start?: string, end?: string) {
  const s = parseYMD(start)
  const e = parseYMD(end)
  if (!s || !e) return 1
  const msPerDay = 24 * 60 * 60 * 1000
  const diff = Math.round((e.getTime() - s.getTime()) / msPerDay)
  return Math.max(1, diff + 1)
}

/* =======================
   TYPES
======================= */
type PlaceProfile = {
  id: string
  title: string
  description: string
  interests: string
  preferences: {
    travelStyle: "low-budget" | "balanced" | "comfortable"
    crowdTolerance: "avoid-crowd" | "okay-crowd" | "no-preference"
    preferredSeasons: string[]
    budgetMin: number
    budgetMax: number
  }
}




type Activity = { id: string; title: string; time?: string; note?: string }

/* =======================
   MELAKA PLACES
======================= */
const melakaPlaces: PlaceProfile[] = [
  {
    id: "melaka-heritage",
    title: "Melaka Historic City Core",
    description: "UNESCO heritage area with colonial landmarks, museums, and walkable streets.",
    interests: "Culture, History, City Walk",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "malaysia-day", "merdeka", "christmas"],
      budgetMin: 250,
      budgetMax: 600,
    },
  },
  {
    id: "jonker",
    title: "Jonker Street Night Market",
    description: "Food, shopping, and busy night vibes (weekends are crowded).",
    interests: "Food, Shopping, Night Market",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["chinese-new-year", "school-holidays", "christmas"],
      budgetMin: 150,
      budgetMax: 450,
    },
  },
  {
    id: "a-famosa",
    title: "A Famosa & Stadthuys",
    description: "Iconic historical spots for photos and short exploration.",
    interests: "Culture, Photos, History",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "merdeka", "malaysia-day"],
      budgetMin: 150,
      budgetMax: 500,
    },
  },
  {
    id: "river-cruise",
    title: "Melaka River Cruise",
    description: "Relaxing evening ride with city lights and murals along the river.",
    interests: "Relax, Photos, Scenic",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "no-preference",
      preferredSeasons: ["christmas", "school-holidays", "deepavali"],
      budgetMin: 200,
      budgetMax: 550,
    },
  },
  {
    id: "maritime-museum",
    title: "Maritime Museum & Flor de la Mar",
    description: "Indoor museum, good for hot/rainy days and history lovers.",
    interests: "Museums, History, Indoor",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "avoid-crowd",
      preferredSeasons: ["wesak", "thaipusam", "deepavali"],
      budgetMin: 100,
      budgetMax: 350,
    },
  },
  {
    id: "encore-theatre",
    title: "Encore Melaka Theatre (Show Night)",
    description: "A more premium night activity for groups who like performances.",
    interests: "Entertainment, Night, Premium",
    preferences: {
      travelStyle: "comfortable",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["christmas", "deepavali", "hari-raya-aidilfitri"],
      budgetMin: 350,
      budgetMax: 900,
    },
  },
  {
    id: "beach-klebang",
    title: "Klebang Beach & Coconut Shake",
    description: "Chill seaside vibe, best during off-peak for quieter experience.",
    interests: "Relax, Beach, Food",
    preferences: {
      travelStyle: "low-budget",
      crowdTolerance: "avoid-crowd",
      preferredSeasons: ["hari-raya-aidilfitri", "school-holidays", "christmas"],
      budgetMin: 120,
      budgetMax: 450,
    },
  },
  {
    id: "sky-tower",
    title: "Menara Taming Sari (Sky View)",
    description: "Quick panoramic ride; short queue off-peak.",
    interests: "Views, Photos, Landmark",
    preferences: {
      travelStyle: "balanced",
      crowdTolerance: "okay-crowd",
      preferredSeasons: ["school-holidays", "christmas", "malaysia-day"],
      budgetMin: 180,
      budgetMax: 550,
    },
  },
]



function activitiesForPlace(place: PlaceProfile): Activity[] {
  const byId: Record<string, Activity[]> = {
    "melaka-heritage": [
      { id: "mh-1", title: "Start a heritage walking route (main landmarks)" },
      { id: "mh-2", title: "Visit a museum in the city core" },
      { id: "mh-3", title: "Photo stops at historical streets and buildings" },
      { id: "mh-4", title: "Try local lunch nearby (heritage area)" },
      { id: "mh-5", title: "Explore small shops and cultural spots" },
      { id: "mh-6", title: "End with a chill cafe break" },
    ],

    jonker: [
      { id: "jk-1", title: "Walk around Jonker Street and explore stalls" },
      { id: "jk-2", title: "Try famous street food and snacks" },
      { id: "jk-3", title: "Buy souvenirs and small gifts" },
      { id: "jk-4", title: "Find dessert spots (cendol / local sweets)" },
      { id: "jk-5", title: "Take night photos at the popular corners" },
      { id: "jk-6", title: "End with supper nearby" },
    ],

    "a-famosa": [
      { id: "af-1", title: "Visit A Famosa and take group photos" },
      { id: "af-2", title: "Explore Stadthuys and nearby spots" },
      { id: "af-3", title: "Walk around the historical square area" },
      { id: "af-4", title: "Try a nearby cafe or local lunch" },
      { id: "af-5", title: "Shop small souvenir shops nearby" },
      { id: "af-6", title: "Short break + relax before next stop" },
    ],

    "river-cruise": [
      { id: "rc-1", title: "Walk along the river promenade" },
      { id: "rc-2", title: "Take photos with murals and lights" },
      { id: "rc-3", title: "Go for Melaka River Cruise" },
      { id: "rc-4", title: "Stop at a nearby dessert / cafe" },
      { id: "rc-5", title: "Explore nearby streets after the cruise" },
      { id: "rc-6", title: "End with supper / late snack" },
    ],

    "maritime-museum": [
      { id: "mm-1", title: "Explore Maritime Museum (indoor)" },
      { id: "mm-2", title: "Walk around Flor de la Mar area" },
      { id: "mm-3", title: "Take photos around the ship museum" },
      { id: "mm-4", title: "Try lunch nearby (easy options)" },
      { id: "mm-5", title: "Visit a nearby small museum / gallery" },
      { id: "mm-6", title: "Rest time (good for hot/rainy day)" },
    ],

    "encore-theatre": [
      { id: "en-1", title: "Early dinner before the show" },
      { id: "en-2", title: "Arrive early and take photos outside venue" },
      { id: "en-3", title: "Watch Encore Melaka performance" },
      { id: "en-4", title: "Discuss best scenes and take group photos" },
      { id: "en-5", title: "Post-show dessert / drinks" },
      { id: "en-6", title: "End with chill hangout or short walk" },
    ],

    "beach-klebang": [
      { id: "kb-1", title: "Beach walk and relax by the sea" },
      { id: "kb-2", title: "Take sunset photos" },
      { id: "kb-3", title: "Try Klebang coconut shake" },
      { id: "kb-4", title: "Snack time at nearby stalls" },
      { id: "kb-5", title: "Group chill session (talk / games)" },
      { id: "kb-6", title: "End with casual dinner nearby" },
    ],

    "sky-tower": [
      { id: "st-1", title: "Buy tickets and check queue time" },
      { id: "st-2", title: "Go up for panoramic sky view ride" },
      { id: "st-3", title: "Take photos from the viewpoint" },
      { id: "st-4", title: "Walk around nearby landmark areas" },
      { id: "st-5", title: "Try nearby snacks / drinks" },
      { id: "st-6", title: "End with a short city walk" },
    ],
  }

  // fallback (always 6)
  return (
    byId[place.id] ?? [
      { id: `${place.id}-1`, title: "Explore the area" },
      { id: `${place.id}-2`, title: "Main highlight activity" },
      { id: `${place.id}-3`, title: "Try local food nearby" },
      { id: `${place.id}-4`, title: "Photo session" },
      { id: `${place.id}-5`, title: "Free time / rest" },
      { id: `${place.id}-6`, title: "Chill and wrap up the day" },
    ]
  )
}


/* =======================
   ✅ MATCH LOGIC (SAME AS DASHBOARD)
======================= */
const toNum = (v: any) => Number(String(v).replace(/[^\d.]/g, ""))

const rangesOverlap = (aMin: number, aMax: number, bMin: number, bMax: number) =>
  Math.max(aMin, bMin) <= Math.min(aMax, bMax)

const computePlaceMatchPercent = (travelers: any[], place: PlaceProfile) => {
  if (!travelers || travelers.length === 0) return 0

  const weights = { travelStyle: 25, crowdTolerance: 20, seasons: 25, budget: 30 }
  const totalWeight = weights.travelStyle + weights.crowdTolerance + weights.seasons + weights.budget

  const scorePerTraveler = travelers.map((t: any) => {
    const p = t.preferences || {}
    const travelerStyle = p.travelStyle
    const travelerCrowd = p.crowdTolerance
    const travelerSeasons: string[] = Array.isArray(p.preferredSeasons) ? p.preferredSeasons : []
    const travelerMin = toNum(p.budgetMin)
    const travelerMax = toNum(p.budgetMax)

    let score = 0

    // Travel style
    if (travelerStyle && travelerStyle === place.preferences.travelStyle) {
      score += weights.travelStyle
    } else if (travelerStyle) {
      const partial =
        (travelerStyle === "balanced" &&
          (place.preferences.travelStyle === "low-budget" || place.preferences.travelStyle === "comfortable")) ||
        (place.preferences.travelStyle === "balanced" &&
          (travelerStyle === "low-budget" || travelerStyle === "comfortable"))
      score += partial ? Math.round(weights.travelStyle * 0.5) : 0
    }

    // Crowd tolerance
    if (travelerCrowd && travelerCrowd === place.preferences.crowdTolerance) {
      score += weights.crowdTolerance
    } else if (travelerCrowd) {
      if (travelerCrowd === "no-preference") score += Math.round(weights.crowdTolerance * 0.6)
    }

    // Seasons
    const seasonOverlap = travelerSeasons.some((s) => place.preferences.preferredSeasons.includes(s))
    if (seasonOverlap) score += weights.seasons

    // Budget
    if (Number.isFinite(travelerMin) && Number.isFinite(travelerMax)) {
      const overlap = rangesOverlap(travelerMin, travelerMax, place.preferences.budgetMin, place.preferences.budgetMax)
      if (overlap) score += weights.budget
      else {
        const travelerAvg = (travelerMin + travelerMax) / 2
        const placeMid = (place.preferences.budgetMin + place.preferences.budgetMax) / 2
        const diffPct = travelerAvg > 0 ? Math.abs(travelerAvg - placeMid) / travelerAvg : 1
        if (diffPct <= 0.2) score += Math.round(weights.budget * 0.5)
      }
    }

    return score / totalWeight
  })

  const avgScore = scorePerTraveler.reduce((a: number, b: number) => a + b, 0) / scorePerTraveler.length
  return Math.max(0, Math.min(100, Math.round(avgScore * 100)))
}

/* =======================
   UI HELPERS
======================= */
function matchBadgeClass(pct: number) {
  if (pct >= 71) return "bg-green-100 text-green-800"
  if (pct >= 31) return "bg-yellow-100 text-yellow-800"
  return "bg-slate-100 text-slate-600"
}
function matchBarClass(pct: number) {
  if (pct >= 71) return "[&_[data-slot=progress-indicator]]:bg-green-500"
  if (pct >= 31) return "[&_[data-slot=progress-indicator]]:bg-yellow-400"
  return "[&_[data-slot=progress-indicator]]:bg-slate-400"
}

const getMostSelected = (array: string[]) => {
  const counts = array.reduce((acc: any, value: string) => {
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
  const most = Object.entries(counts).reduce(
    (a: any, b: any) => (a[1] > b[1] ? a : b),
    ["", 0] as any
  )
  return most as [string, number]
}

function buildConflictReasons(
  travelers: any[],
  place: PlaceProfile | null | undefined
): { severity: "high" | "medium" | "low"; title: string; detail: string }[] {
  if (!place || !travelers?.length) return []

  const prefs = place.preferences

  const avgBudget =
    travelers.reduce((sum: number, t: any) => {
      const minB = toNum(t?.preferences?.budgetMin)
      const maxB = toNum(t?.preferences?.budgetMax)
      const avg = (minB + maxB) / 2
      return sum + (Number.isFinite(avg) ? avg : 0)
    }, 0) / Math.max(1, travelers.length)

  const allStyles = travelers.map((t: any) => t?.preferences?.travelStyle).filter(Boolean)
  const allCrowd = travelers.map((t: any) => t?.preferences?.crowdTolerance).filter(Boolean)
  const allSeasons = travelers.flatMap((t: any) => t?.preferences?.preferredSeasons || []).filter(Boolean)

  const [commonStyle] = getMostSelected(allStyles)
  const [commonCrowd] = getMostSelected(allCrowd)
  const [commonSeason] = getMostSelected(allSeasons)

  const reasons: { severity: "high" | "medium" | "low"; title: string; detail: string }[] = []

  // Budget mismatch
  const overlapWithAvg = rangesOverlap(avgBudget, avgBudget, prefs.budgetMin, prefs.budgetMax)
  if (!overlapWithAvg) {
    const diff = Math.abs(avgBudget - (prefs.budgetMin + prefs.budgetMax) / 2)
    const sev: "high" | "medium" = diff > Math.max(150, avgBudget * 0.35) ? "high" : "medium"

    reasons.push({
      severity: sev,
      title: "Budget mismatch",
      detail: `Group avg budget is RM${avgBudget.toFixed(0)} but this place is RM${prefs.budgetMin}–RM${prefs.budgetMax}.`,
    })
  }

  // Crowd mismatch
  if (commonCrowd && prefs.crowdTolerance !== commonCrowd) {
    reasons.push({
      severity: "medium",
      title: "Crowd preference mismatch",
      detail: `Most travelers prefer "${crowdToleranceLabels[commonCrowd] ?? commonCrowd}", but this place is "${crowdToleranceLabels[prefs.crowdTolerance] ?? prefs.crowdTolerance}".`,
    })
  }

  // Style mismatch
  if (commonStyle && prefs.travelStyle !== commonStyle) {
    reasons.push({
      severity: "medium",
      title: "Travel style mismatch",
      detail: `Most travelers prefer "${travelStyleLabels[commonStyle] ?? commonStyle}", but this place is "${travelStyleLabels[prefs.travelStyle] ?? prefs.travelStyle}".`,
    })
  }

// Season mismatch (treat as medium impact)
if (commonSeason && !prefs.preferredSeasons.includes(commonSeason)) {
  reasons.push({
    severity: "medium",
    title: "Season preference mismatch",
    detail: `Most travelers selected "${seasonLabels[commonSeason] ?? commonSeason}", but this place does not match that season preference.`,
  })
}


  return reasons
}

function conflictResolutionScore(
  travelers: any[],
  place: PlaceProfile,
  currentConflicts: ReturnType<typeof buildConflictReasons>
) {
  const weights = { high: 3, medium: 2, low: 1 } as const
  const reasons = buildConflictReasons(travelers, place)

  const currentTotal = currentConflicts.reduce((sum, c) => sum + weights[c.severity], 0)
  const newTotal = reasons.reduce((sum, c) => sum + weights[c.severity], 0)

  return currentTotal - newTotal
}


// =======================
// PDF SAFE TEXT (avoid weird spacing / symbols)
// =======================
function pdfSafeText(input: any) {
  return String(input ?? "")
    .replace(/[•]/g, "|")
    .replace(/[→]/g, "to")
    .replace(/[–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    // remove non-ascii characters
    .replace(/[^\x20-\x7E]/g, " ")
    // collapse extra spaces
    .replace(/\s+/g, " ")
    .trim()
}


export default function ItineraryPage() {
  // ✅ hooks must ALWAYS run in same order (no early return before hooks)
  const [manualDayPlace, setManualDayPlace] = React.useState<Record<string, string>>({})
  const [mounted, setMounted] = React.useState(false)
  const [jsonData, setJsonData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedDay, setSelectedDay] = React.useState("1")
  const [dayActivities, setDayActivities] = React.useState<Record<string, Activity[]>>({})

  // mount
  React.useEffect(() => setMounted(true), [])

  const replaceSelectedDayPlace = (newPlace: PlaceProfile) => {
    const dayKey = selectedDay
  
    setManualDayPlace((prev) => ({
      ...prev,
      [dayKey]: newPlace.id,
    }))
  
    // reset activities for this day to the new place’s 6 activities
    setDayActivities((prev) => ({
      ...prev,
      [dayKey]: activitiesForPlace(newPlace).map((a) => ({ ...a })),
    }))
  }
  

  // fetch
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data")
        if (!res.ok) throw new Error("Failed to fetch data")
        const data = await res.json()
        setJsonData(data)
      } catch (err) {
        console.error("Failed to load itinerary data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // derived (safe defaults even before data loads)
  const travelers = jsonData?.travelers || []
  const startDate = jsonData?.trip_details?.start_date
  const endDate = jsonData?.trip_details?.end_date
  const destination = jsonData?.trip_details?.destination || "Trip"

  const totalDays = React.useMemo(() => daysBetweenInclusive(startDate, endDate), [startDate, endDate])
  const startDateObj = React.useMemo(() => parseYMD(startDate), [startDate])

  const dayList = React.useMemo(() => {
    if (!startDateObj) return []
    return Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      value: String(i + 1),
      label: `Day ${i + 1} • ${formatDateStable(addDays(startDateObj, i))}`,
    }))
  }, [startDateObj, totalDays])

  const rankedPlaces = React.useMemo(() => {
    const rows = melakaPlaces.map((p) => ({ place: p, match: computePlaceMatchPercent(travelers, p) }))
    rows.sort((a, b) => b.match - a.match)
    return rows
  }, [travelers])

  

  const dayToPlace = React.useMemo(() => {
    const mapping: Record<string, { place: PlaceProfile; match: number }> = {}
  
    // quick index by id for fast lookup
    const placeById: Record<string, PlaceProfile> = Object.fromEntries(
      melakaPlaces.map((p) => [p.id, p])
    )
  
    dayList.forEach((d, idx) => {
      // if user manually picked a place for that day, use it
      const overrideId = manualDayPlace[d.value]
      if (overrideId && placeById[overrideId]) {
        const overridePlace = placeById[overrideId]
        mapping[d.value] = {
          place: overridePlace,
          match: computePlaceMatchPercent(travelers, overridePlace),
        }
        return
      }
  
      // otherwise default: ranked places by day order
      const pick = rankedPlaces[idx % Math.max(1, rankedPlaces.length)]
      if (pick) mapping[d.value] = pick
    })
  
    return mapping
  }, [dayList, rankedPlaces, manualDayPlace, travelers])
  

  // init selectedDay when list appears
  React.useEffect(() => {
    if (dayList.length && !dayList.some((d) => d.value === selectedDay)) {
      setSelectedDay(dayList[0].value)
    }
  }, [dayList, selectedDay])

  // init day activities when mapping ready
  React.useEffect(() => {
    if (!dayList.length) return
    setDayActivities((prev) => {
      const next: Record<string, Activity[]> = { ...prev }
      for (const d of dayList) {
        if (next[d.value]?.length) continue
        const picked = dayToPlace[d.value]
        if (picked?.place) next[d.value] = activitiesForPlace(picked.place).map((a) => ({ ...a }))
      }
      return next
    })
  }, [dayList, dayToPlace])

  // reorder
  const moveActivity = (dayKey: string, index: number, dir: "up" | "down") => {
    setDayActivities((prev) => {
      const fallback = dayToPlace[dayKey]?.place ? activitiesForPlace(dayToPlace[dayKey].place) : []
      const list = [...(prev[dayKey] ?? fallback)]
      const nextIndex = dir === "up" ? index - 1 : index + 1
      if (nextIndex < 0 || nextIndex >= list.length) return prev
      const temp = list[index]
      list[index] = list[nextIndex]
      list[nextIndex] = temp
      return { ...prev, [dayKey]: list }
    })
  }

  const assignedPlaceIds = React.useMemo(() => {
    return new Set(Object.values(dayToPlace).map((x) => x.place.id))
  }, [dayToPlace])
  
  const availableDestinations = React.useMemo(() => {
    return rankedPlaces.filter((x) => !assignedPlaceIds.has(x.place.id))
  }, [rankedPlaces, assignedPlaceIds])
  
  const selectedPicked = dayToPlace[selectedDay]


  const getDayStatus = (match: number) => {
    if (match >= 70) {
      return {
        label: "Well aligned with the group",
        icon: "success",
        className: "bg-green-50 border-green-200 text-green-700",
      }
    }
  
    if (match >= 40) {
      return {
        label: "Some adjustments may help",
        icon: "info",
        className: "bg-blue-50 border-blue-200 text-blue-700",
      }
    }
  
    return {
      label: "Needs adjustment",
      icon: "warning",
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    }
  }
  
  const selectedPlace = selectedPicked?.place ?? null
  
  const dayConflicts = React.useMemo(() => {
    return buildConflictReasons(travelers, selectedPlace)
  }, [travelers, selectedPlace])
  
  const suggestionCandidates = React.useMemo(() => {
    // suggest from AVAILABLE destinations only (places not listed in days)
    // if you want to allow swapping with assigned days too, tell me.
    const list = availableDestinations.map((x) => x.place)
  
    const scored = list
      .map((p) => ({
        place: p,
        score: conflictResolutionScore(travelers, p, dayConflicts),
      }))
      .sort((a, b) => b.score - a.score)
  
    return scored
  }, [availableDestinations, travelers, dayConflicts])


  const exportItineraryPDF = () => {
    const doc = new jsPDF()
    let y = 15
  
    // ===== TITLE =====
    doc.setFontSize(18)
    doc.text("Full Trip Itinerary", 14, y)
    y += 8
  
    doc.setFontSize(11)
    doc.text(
      pdfSafeText(`${destination} | ${startDate} to ${endDate} | ${totalDays} days`),
      14,
      y
    )
    y += 10
  
    // Divider
    doc.line(14, y, 196, y)
    y += 8
  
    // ===== DAYS =====
    dayList.forEach((d) => {
      const picked = dayToPlace[d.value]
      if (!picked) return
  
      const place = picked.place
      const pref = place.preferences
  
      // New page if needed
      if (y > 260) {
        doc.addPage()
        y = 15
      }
  
      // Day heading
      doc.setFontSize(14)
      doc.text(`Day ${d.day}`, 14, y)
      y += 6
  
      // Place title
      doc.setFontSize(12)
      doc.text(pdfSafeText(place.title), 16, y)
      y += 5
  
      // Description
      doc.setFontSize(10)
      doc.text(
        pdfSafeText(place.description),
        16,
        y,
        { maxWidth: 170 }
      )
      y += 6
  
      // Meta info
      doc.text(
        pdfSafeText(`Interests: ${place.interests}`),
        16,
        y
      )
      y += 5
  
      doc.text(
        pdfSafeText(`Budget: RM${pref.budgetMin} - RM${pref.budgetMax}`),
        16,
        y
      )
      y += 6
  
      // Activities
      const acts = dayActivities[d.value] ?? []
      if (acts.length > 0) {
        doc.text("Activities:", 16, y)
        y += 4
  
        acts.forEach((a) => {
          doc.text(
            pdfSafeText(`- ${a.title}`),
            18,
            y
          )
          y += 4
        })
      }
  
      // Section divider
      y += 4
      doc.line(14, y, 196, y)
      y += 6
    })
  
    // Save
    doc.save(pdfSafeText(`Itinerary_${destination}_${startDate}.pdf`))
  }
  



  
  // render gate (AFTER hooks)
  const ready = mounted && !loading && !!jsonData

  if (!ready) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)" }}>
        <div className="sticky top-0 z-20">
          <Navigation />
          <TabBar />
        </div>
        <div className="p-6 text-slate-600">Loading itinerary...</div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }
  

  const totalCost = jsonData?.summary?.totalCost ?? 1400
  const memberCount = travelers.length || 1

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #f5f3ff 0%, #F1F5F9 20%)" }}>
      <div className="sticky top-0 z-20">
        <Navigation />
        <TabBar totalCost={totalCost} memberCount={memberCount} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-2">
        <header className="flex items-center gap-7 pt-13 mb-8">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4">
            <MapPin className="size-8 text-white" strokeWidth={2} />
          </div>
          <div>
  <h1 className="text-3xl font-bold text-slate-900">My Itinerary</h1>

  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
      <MapPin className="size-4 text-slate-400" />
      {destination}
    </span>

    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
      <CalendarDays className="size-4 text-slate-400" />
      {formatDate(startDate)} – {formatDate(endDate)}
    </span>

    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
      <span className="size-2 rounded-full bg-violet-500" />
      {totalDays}-day plan
    </span>
  </div>
</div>




        </header>

        

        <Card className="border-[#AD46FF] bg-white">


        <CardHeader className="flex flex-row items-start justify-between gap-4">
  <div>
    <CardTitle className="text-xl font-bold">Full Trip Itinerary</CardTitle>
    <p className="mt-1 text-sm text-slate-600">
    We spread out places across the trip based on group preferences, starting with the strongest matches.
    </p>
  </div>

  <button
    type="button"
    onClick={exportItineraryPDF}
    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
    📄 Export PDF
  </button>
</CardHeader>



          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full lg:w-auto">
                <TabsList className="bg-slate-100 h-auto p-1 flex-col">
                  {dayList.map((d) => (
                    <TabsTrigger
                      key={d.value}
                      value={d.value}
                      className="w-full data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                    >
                      {d.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              

              <div className="flex-1 border-l-4 border-[#AD46FF] bg-linear-to-r from-violet-50 to-pink-50 rounded-r-xl p-6">
                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  {dayList.map((d) => {
                    const picked = dayToPlace[d.value]
                    const place = picked?.place
                    const match = picked?.match ?? 0

                    if (!place) {
                      return (
                        <TabsContent key={d.value} value={d.value} className="mt-0">
                          <div className="text-slate-600">No place found.</div>
                        </TabsContent>
                      )
                    }

                    const pref = place.preferences
                    const seasonsText =
                      pref.preferredSeasons.length > 0
                        ? pref.preferredSeasons.map((s) => seasonLabels[s] || s).join(", ")
                        : "Any"

                    const currentActivities = dayActivities[d.value] ?? activitiesForPlace(place)

                    return (
                      <TabsContent key={d.value} value={d.value} className="mt-0">
                        <div className="space-y-5">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="text-lg font-bold text-slate-900">{place.title}</div>
                                <div className="mt-1 text-sm text-slate-600">{place.description}</div>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
                                  <span className="inline-flex items-center gap-2">
                                    <Heart className="size-4 text-slate-500" />
                                    Style: <span className="font-semibold">{travelStyleLabels[pref.travelStyle]}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <Users2 className="size-4 text-slate-500" />
                                    Crowd:{" "}
                                    <span className="font-semibold">{crowdToleranceLabels[pref.crowdTolerance]}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="size-4 text-slate-500" />
                                    Seasons: <span className="font-semibold">{seasonsText}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <Coins className="size-4 text-slate-500" />
                                    Budget:{" "}
                                    <span className="font-semibold">
                                      RM{pref.budgetMin}–RM{pref.budgetMax}
                                    </span>
                                  </span>
                                </div>

                                <div className="mt-2 text-xs text-slate-500 inline-flex items-center gap-2">
                                  <MapPin className="size-4 text-slate-400" />
                                  {place.interests}
                                </div>
                              </div>

                              <Badge className={`${matchBadgeClass(match)} border-0 px-3 py-1 text-sm font-bold`}>
                                {match}% Match
                              </Badge>
                            </div>

                            <div className="mt-4">
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Compatibility</span>
                                <span className="font-semibold text-slate-900">{match}%</span>
                              </div>
                              <Progress value={match} className={`mt-2 h-2 bg-slate-100 ${matchBarClass(match)}`} />
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div>
                              <div className="text-sm font-semibold text-slate-800">Activities</div>
                              <div className="text-xs text-slate-500">Use arrows to reorder activities for this day.</div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {currentActivities.map((a, idx) => (
                                <div
                                  key={a.id}
                                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 text-slate-400">
                                      <GripVertical className="size-4" />
                                    </div>
                                    <div className="min-w-0">
  <div className="text-sm font-semibold text-slate-900 truncate">
    {a.title}
  </div>
</div>

                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => moveActivity(d.value, idx, "up")}
                                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                                      disabled={idx === 0}
                                      aria-label="Move up"
                                    >
                                      <ChevronUp className="size-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveActivity(d.value, idx, "down")}
                                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                                      disabled={idx === currentActivities.length - 1}
                                      aria-label="Move down"
                                    >
                                      <ChevronDown className="size-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>




        <Card className="border-[#AD46FF] bg-white mt-6">
  <CardHeader className="pb-2">
    <CardTitle className="text-xl font-bold">Conflict-based Day Suggestions</CardTitle>
    <p className="text-sm text-slate-600">
      Pick a better destination for <span className="font-semibold">Day {selectedDay}</span> based on traveler preferences.
    </p>
  </CardHeader>

  <CardContent className="pt-2">
    {!selectedPlace ? (
      <div className="text-sm text-slate-500">Select a day to see suggestions.</div>
    ) : (
      <div className="space-y-4">
        {/* Top: Current destination + health */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500">Current destination</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{selectedPlace.title}</div>
              <div className="mt-1 text-sm text-slate-600">{selectedPlace.description}</div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
              {(() => {
  const status = getDayStatus(selectedPicked?.match ?? 0)

  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold " +
        status.className
      }
    >
      {status.icon === "success" && "✅"}
      {status.icon === "info" && "ℹ️"}
      {status.icon === "warning" && "⚠️"}
      {status.label}
    </span>
  )
})()}


                <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {selectedPicked?.match ?? 0}% Match
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-3">
              <Users2 className="size-6 text-white" />
            </div>
          </div>

          {/* If conflicts exist, show quick chips */}
          {dayConflicts.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-500 mb-2">What’s not aligned</div>
              <div className="flex flex-wrap gap-2">
                {dayConflicts.slice(0, 4).map((c, idx) => {
                  const chip =
                    c.severity === "high"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : c.severity === "medium"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                      : "bg-slate-50 border-slate-200 text-slate-700"

                  return (
                    <span
                      key={c.title + idx}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${chip}`}
                      title={c.detail}
                    >
                      {c.title}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

{/* Detail reasons (expanded but readable) */}
{dayConflicts.length > 0 && (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <div className="text-sm font-semibold text-slate-900">
      Why you may want to change
    </div>

    <div className="mt-3 space-y-2">
      {dayConflicts.map((c, idx) => {
        const box =
          c.severity === "high"
            ? "border-red-200 bg-red-50"
            : c.severity === "medium"
            ? "border-yellow-200 bg-yellow-50"
            : "border-slate-200 bg-white"

        const label =
          c.severity === "high"
            ? "High impact"
            : c.severity === "medium"
            ? "Medium impact"
            : "Low impact"

        return (
          <div
            key={c.title + idx}
            className={`rounded-xl border p-4 ${box}`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: icon + title */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {getReasonIcon(c.title, c.severity)}
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {c.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-700">
                    {c.detail}
                  </div>
                </div>
              </div>

              {/* Right: impact label */}
              <div
                className={
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold " +
                  (c.severity === "high"
                    ? "bg-red-100 text-red-700"
                    : c.severity === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-600")
                }
              >
                {label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)}


        {/* Suggestions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Suggested replacements</div>
              <div className="text-xs text-slate-500">
                These options are not assigned to other days (so you won’t duplicate places).
              </div>
            </div>
          </div>

          {suggestionCandidates.length === 0 ? (
            <div className="mt-3 text-sm text-slate-500">No available destinations right now.</div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {suggestionCandidates.slice(0, 4).map(({ place }) => {
                const pref = place.preferences
                const match = computePlaceMatchPercent(travelers, place)

                // quick “why this helps”
                const reasons = buildConflictReasons(travelers, place)
                const hasBudget = !reasons.some((r) => r.title === "Budget mismatch")
                const hasCrowd = !reasons.some((r) => r.title === "Crowd preference mismatch")
                const hasStyle = !reasons.some((r) => r.title === "Travel style mismatch")

                const improvements: string[] = []
                if (hasBudget) improvements.push("Better budget fit")
                if (hasCrowd) improvements.push("Matches crowd preference")
                if (hasStyle) improvements.push("Matches travel style")
                if (improvements.length === 0) improvements.push("Alternative option")

                const highlight =
                  match >= 71
                    ? "bg-green-50 border-green-200 text-green-700"
                    : match >= 31
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-slate-50 border-slate-200 text-slate-700"

                const seasonsText =
                  pref.preferredSeasons.length > 0
                    ? pref.preferredSeasons
                        .slice(0, 2)
                        .map((s) => seasonLabels[s] || s)
                        .join(", ") + (pref.preferredSeasons.length > 2 ? "…" : "")
                    : "Any"

                return (
                  <div key={place.id} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-bold text-slate-900">{place.title}</div>
                        <div className="mt-1 text-sm text-slate-600">{place.description}</div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className={`rounded-full border px-3 py-1 font-semibold ${highlight}`}>
                            {match}% Match
                          </span>

                          {improvements.slice(0, 2).map((t) => (
                            <span
                              key={place.id + t}
                              className="rounded-full bg-violet-50 border border-violet-200 px-3 py-1 font-semibold text-violet-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
                          <div className="inline-flex items-center gap-2">
                            <Coins className="size-4 text-slate-500" />
                            RM{pref.budgetMin}–RM{pref.budgetMax}
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <Users2 className="size-4 text-slate-500" />
                            {crowdToleranceLabels[pref.crowdTolerance]}
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <CalendarDays className="size-4 text-slate-500" />
                            {seasonsText}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => replaceSelectedDayPlace(place)}
                        className="shrink-0 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )}
  </CardContent>
</Card>








      </main>
    </div>
  )
}
