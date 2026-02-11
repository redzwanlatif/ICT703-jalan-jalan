"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Globe2, Users, Calendar, Plane,
  CloudRain, CloudSun, Sun, Thermometer, Cloud,
  Tag, Shield, ChevronLeft, Share2,
  Clock, Plus, Minus, Car, Building2, AlertTriangle,
  ArrowRight, Sparkles, CheckCircle2, Zap,
  MapPin as MapPinIcon, DollarSign, Bell, Brain, Lightbulb, X, Wand2,
  TrendingUp, TrendingDown, BarChart3, Activity, Leaf, Info, ExternalLink, Settings2,
  Mail, MessageCircle, Facebook, Instagram, AtSign, UserPlus, UserMinus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { type DateRange } from "react-day-picker"
import { PageLayout } from '@/components/shared/page-layout'
import { GroupLabel } from '@/components/shared/group-label'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts'

// Simplified 3-step flow
type Step = 'details' | 'preferences' | 'results'

interface TripData {
  destination: string
  dateRange: DateRange | undefined
  travelers: number
  travelerNames: string[]
  travelerGenders: string[]
}

interface Preferences {
  travelStyle: string
  crowdTolerance: string
  preferredSeasons: string[]
  safetyOptions: {
    avoidLateNight: boolean
    preferWellLit: boolean
    verifiedTransport: boolean
  }
  budgetMin: string
  budgetMax: string
  notifications: {
    crowd: boolean
    weather: boolean
    price: boolean
    safety: boolean
  }
}

export default function TravelSmartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [quickGenerate, setQuickGenerate] = useState<boolean>(false)
  const [tripData, setTripData] = useState<TripData>({
    destination: '',
    dateRange: undefined,
    travelers: 2,
    travelerNames: ['', ''],
    travelerGenders: ['', '']
  })
  const [preferences, setPreferences] = useState<Preferences[]>([{
    travelStyle: 'balanced',
    crowdTolerance: 'avoid-crowd',
    preferredSeasons: [],
    safetyOptions: {
      avoidLateNight: true,
      preferWellLit: true,
      verifiedTransport: true
    },
    budgetMin: '',
    budgetMax: '',
    notifications: {
      crowd: true,
      weather: true,
      price: true,
      safety: true
    }
  }])
  const [currentTravelerIndex, setCurrentTravelerIndex] = useState<number>(0)
  const [selectedPlan, setSelectedPlan] = useState<string>('Balanced Plan')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [showAllPreferences, setShowAllPreferences] = useState<boolean>(false)
  const [generationProgress, setGenerationProgress] = useState<number>(0)
  const [destinationSearch, setDestinationSearch] = useState<string>('')
  const [showDestinationDropdown, setShowDestinationDropdown] = useState<boolean>(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [quickGenerateData, setQuickGenerateData] = useState<any>(null)
  const [showShareSuccess, setShowShareSuccess] = useState<boolean>(false)
  const [sharedPlatform, setSharedPlatform] = useState<string>('')
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false)

  // Track field blur for on-blur validation
  const markTouched = useCallback((travelerIndex: number, field: string) => {
    setTouchedFields(prev => {
      const next = new Set(prev)
      next.add(`${travelerIndex}-${field}`)
      return next
    })
  }, [])

  const isTouched = useCallback((travelerIndex: number, field: string) => {
    return touchedFields.has(`${travelerIndex}-${field}`)
  }, [touchedFields])

  // Memoized validation
  const validationErrors = useMemo(() => {
    const errors: { travelerIndex: number; field: string }[] = []
    for (let i = 0; i < tripData.travelers; i++) {
      if (!tripData.travelerNames[i]?.trim()) errors.push({ travelerIndex: i, field: 'name' })
      if (!tripData.travelerGenders[i]) errors.push({ travelerIndex: i, field: 'gender' })
      if (!preferences[i]?.budgetMax) errors.push({ travelerIndex: i, field: 'budgetMax' })
      if (!preferences[i]?.preferredSeasons?.length) errors.push({ travelerIndex: i, field: 'seasons' })
      const safety = preferences[i]?.safetyOptions
      if (safety && !safety.avoidLateNight && !safety.preferWellLit && !safety.verifiedTransport) {
        errors.push({ travelerIndex: i, field: 'safety' })
      }
      const notifs = preferences[i]?.notifications
      if (notifs && !notifs.crowd && !notifs.weather && !notifs.price && !notifs.safety) {
        errors.push({ travelerIndex: i, field: 'alerts' })
      }
    }
    return errors
  }, [tripData.travelers, tripData.travelerNames, tripData.travelerGenders, preferences])

  const isPreferencesValid = validationErrors.length === 0
  const hasErrorsForTraveler = useCallback((index: number) => validationErrors.some(e => e.travelerIndex === index), [validationErrors])

  // Show error if field was touched (on blur) OR if submit was attempted
  const shouldShowFieldError = useCallback((travelerIndex: number, field: string) => {
    if (!validationErrors.some(e => e.travelerIndex === travelerIndex && e.field === field)) return false
    return submitAttempted || isTouched(travelerIndex, field)
  }, [validationErrors, submitAttempted, isTouched])

  // Ref for auto-focusing first invalid field on submit
  const nameInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const genderTriggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const budgetMaxInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const generateAbortRef = useRef<AbortController | null>(null)

  // Sync preferences array with travelers count
  useEffect(() => {
    const defaultPreferences: Preferences = {
      travelStyle: 'balanced',
      crowdTolerance: 'avoid-crowd',
      preferredSeasons: [],
      safetyOptions: {
        avoidLateNight: true,
        preferWellLit: true,
        verifiedTransport: true
      },
      budgetMin: '',
      budgetMax: '',
      notifications: {
        crowd: true,
        weather: true,
        price: true,
        safety: true
      }
    }

    const currentPrefs = [...preferences]
    while (currentPrefs.length < tripData.travelers) {
      currentPrefs.push({ ...defaultPreferences })
    }
    while (currentPrefs.length > tripData.travelers) {
      currentPrefs.pop()
    }
    if (currentPrefs.length !== preferences.length) {
      setPreferences(currentPrefs)
    }
    // Ensure currentTravelerIndex is valid
    if (currentTravelerIndex >= tripData.travelers) {
      setCurrentTravelerIndex(Math.max(0, tripData.travelers - 1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripData.travelers])

  // Malaysian destinations list
  const malaysianDestinations = useMemo(() => [
    'Melaka'
  ], [])

  const filteredDestinations = useMemo(() => {
    if (!destinationSearch.trim()) {
      return malaysianDestinations.slice(0, 10) // Show first 10 when no search
    }
    return malaysianDestinations.filter(dest =>
      dest.toLowerCase().includes(destinationSearch.toLowerCase())
    )
  }, [destinationSearch, malaysianDestinations])

  // Get minimal fallback alerts (only used if AI completely fails)
  const getMinimalFallbackAlerts = () => {
    return {
      crowd: [
        { title: 'Crowd Forecast', location: tripData.destination || 'Destination', time: 'Check dates', level: 'MEDIUM', levelType: 'warning', description: 'Please wait for AI-generated predictions.', suggestion: 'AI predictions loading...' }
      ],
      weather: [
        { title: 'Weather Alert', location: tripData.destination || 'Destination', time: 'Check dates', level: 'INFO', levelType: 'info', description: 'Weather predictions will be generated.', suggestion: 'AI predictions loading...' }
      ],
      price: [
        { title: 'Price Alert', location: tripData.destination || 'Destination', time: 'Check dates', level: 'INFO', levelType: 'info', description: 'Price predictions will be generated.', suggestion: 'AI predictions loading...' }
      ],
      safety: [
        { title: 'Safety Notice', location: tripData.destination || 'Destination', time: 'All times', level: 'INFO', levelType: 'info', description: 'Safety recommendations will be personalized.', suggestion: 'AI predictions loading...' }
      ]
    }
  }

  // Get minimal fallback suggestions
  const getMinimalFallbackSuggestions = () => {
    return [
      { title: 'Plan Ahead', description: 'AI-generated suggestions will appear here based on your preferences.' },
      { title: 'Stay Flexible', description: 'Keep some buffer time for unexpected discoveries.' },
      { title: 'Local Tips', description: 'Explore local recommendations for authentic experiences.' },
      { title: 'Book Smart', description: 'Reserve popular attractions and accommodations in advance.' }
    ]
  }

  // Get minimal fallback analytics (only used if AI completely fails)
  const getMinimalFallbackAnalytics = () => {
    return {
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
    }
  }

  // Get minimal fallback sustainability (only used if AI completely fails)
  const getMinimalFallbackSustainability = () => {
    return {
      waterUsage: { value: 50, level: 'Medium' },
      wasteGeneration: { value: 35, level: 'Low' },
      energyConsumption: { value: 45, level: 'Medium' },
      localBusinessSupport: 'Medium',
      infrastructurePressure: 'Medium',
      culturalPreservation: 'Positive'
    }
  }

  // Use OpenAI-generated data if available, otherwise minimal fallback
  const aiAlerts = generatedPlan?.plans?.[selectedPlan]?.alerts
  const alerts = aiAlerts || getMinimalFallbackAlerts()

  const aiSuggestions = generatedPlan?.plans?.[selectedPlan]?.suggestions
  const suggestions = aiSuggestions || getMinimalFallbackSuggestions()

  const aiAnalytics = generatedPlan?.plans?.[selectedPlan]?.analytics
  const analytics = aiAnalytics || getMinimalFallbackAnalytics()

  const aiSustainability = generatedPlan?.plans?.[selectedPlan]?.sustainability
  const sustainability = aiSustainability || getMinimalFallbackSustainability()

  const aiBestWindow = generatedPlan?.plans?.[selectedPlan]?.bestWindow


  const handleDetailsSubmit = () => {
    if (tripData.destination && tripData.dateRange?.from && tripData.dateRange?.to) {
      if (quickGenerate) {
        // Skip preferences, go directly to generation
        handleGeneratePlan(true)
      } else {
        setCurrentStep('preferences')
      }
    }
  }

  const handleGeneratePlan = async (isQuickGenerate: boolean = false) => {
    // Cancel any previous request
    generateAbortRef.current?.abort()
    const abortController = new AbortController()
    generateAbortRef.current = abortController

    // Reset and show dialog
    setGenerationProgress(0)
    setIsGenerating(true)

    // Animate progress: slowly to 35% (before icon 2 completes at 40%), then wait for API
    let progressValue = 0
    setGenerationProgress(0)

    const progressInterval = setInterval(() => {
      if (progressValue < 35) {
        progressValue = Math.min(progressValue + 1, 35)
        setGenerationProgress(progressValue)
      }
    }, 200)

    try {
      let result

      if (isQuickGenerate) {
        // Quick Generate - call different API, no storage
        const quickRequestData = {
          destination: tripData.destination,
          start_date: tripData.dateRange?.from ? tripData.dateRange.from.toISOString().split('T')[0] : '',
          end_date: tripData.dateRange?.to ? tripData.dateRange.to.toISOString().split('T')[0] : '',
          travelers: tripData.travelers
        }

        const response = await fetch('/api/quick-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quickRequestData),
          signal: abortController.signal
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate quick prediction`)
        }

        result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate quick prediction')
        }

        // Store quick generate data
        if (result.data) {
          setQuickGenerateData(result.data)
          setGeneratedPlan(null) // Clear preference-based plan
        }
      } else {
        // Preference-based Generate - original flow with storage
        const travelersData = tripData.travelerNames.map((name, index) => ({
          name: name || `Traveler ${index + 1}`,
          gender: tripData.travelerGenders[index] || '',
          preferences: preferences[index] || preferences[0]
        }))

        const requestData = {
          group_id: `group-${tripData.travelers}`,
          trip_details: {
            destination: tripData.destination,
            start_date: tripData.dateRange?.from ? tripData.dateRange.from.toISOString().split('T')[0] : '',
            end_date: tripData.dateRange?.to ? tripData.dateRange.to.toISOString().split('T')[0] : ''
          },
          travelers: travelersData
        }

        const response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
          signal: abortController.signal
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to save travel plan`)
        }

        result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to save travel plan')
        }

        // Store the generated plan from OpenAI
        if (result.plan) {
          setGeneratedPlan(result.plan)
          setQuickGenerateData(null) // Clear quick generate data
        }
      }

      // API complete - now animate remaining icons with 1s intervals
      clearInterval(progressInterval)

      // Icon 2 complete (40%)
      setGenerationProgress(40)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Icon 3 complete (65%)
      setGenerationProgress(65)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Icon 4 complete (85%)
      setGenerationProgress(85)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show completed (100%)
      setGenerationProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Close dialog and navigate to results
      setIsGenerating(false)
      setCurrentStep('results')
      setGenerationProgress(0)

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
      clearInterval(progressInterval)
      // If user cancelled, silently reset
      if (error instanceof DOMException && error.name === 'AbortError') {
        setGenerationProgress(0)
        return
      }
      setIsGenerating(false)
      setGenerationProgress(0)
      alert(`Failed to generate travel plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handlePreferencesSubmit = () => {
    if (!isPreferencesValid) {
      setSubmitAttempted(true)
      // Auto-navigate to first traveler with errors and focus first invalid field
      const firstError = validationErrors[0]
      if (firstError) {
        setCurrentTravelerIndex(firstError.travelerIndex)
        // Focus after React re-renders the tab
        setTimeout(() => {
          if (firstError.field === 'name') {
            nameInputRefs.current.get(firstError.travelerIndex)?.focus()
          } else if (firstError.field === 'gender') {
            genderTriggerRefs.current.get(firstError.travelerIndex)?.focus()
          } else if (firstError.field === 'budgetMax') {
            budgetMaxInputRefs.current.get(firstError.travelerIndex)?.focus()
          }
        }, 50)
      }
      return
    }
    handleGeneratePlan(false)
  }

  const handleSavePlan = async () => {
    setIsSaving(true)
    try {
      const travelersData = tripData.travelerNames.map((name, index) => ({
        name: name || `Traveler ${index + 1}`,
        gender: tripData.travelerGenders[index] || '',
        preferences: preferences[index] || preferences[0]
      }))

      const response = await fetch('/api/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: `group-${tripData.travelers}`,
          trip_details: {
            destination: tripData.destination,
            start_date: tripData.dateRange?.from ? tripData.dateRange.from.toISOString().split('T')[0] : '',
            end_date: tripData.dateRange?.to ? tripData.dateRange.to.toISOString().split('T')[0] : ''
          },
          travelers: travelersData,
          selected_plan: selectedPlan,
          generated_plan: generatedPlan || quickGenerateData
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to save plan')
      }

      setShowSaveDialog(false)
      router.push('/dashboard')
    } catch (error) {
      alert(`Failed to save plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
  }

  // Initialize selectedPlan when generatedPlan is loaded
  useEffect(() => {
    if (generatedPlan?.plans && Object.keys(generatedPlan.plans).length > 0) {
      const planNames = Object.keys(generatedPlan.plans);
      if (!generatedPlan.plans[selectedPlan]) {
        const defaultPlan = planNames.length > 1 ? planNames[1] : planNames[0];
        setSelectedPlan(defaultPlan);
      }
    }
  }, [generatedPlan?.plans, selectedPlan])

  const formatDate = (date: Date | string | undefined) => {
    try {
      if (!date) return ''
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return ''
      const day = dateObj.getDate()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[dateObj.getMonth()]
      const year = dateObj.getFullYear()
      return `${day} ${month} ${year}`
    } catch {
      return ''
    }
  }

  const formatDateRange = (dateRange: DateRange | undefined) => {
    try {
    if (!dateRange?.from) return ''
    if (!dateRange.to) return formatDate(dateRange.from)
    return `${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`
    } catch {
      return ''
    }
  }

  // Get minimal fallback best window
  const getMinimalFallbackBestWindow = () => {
    try {
      const startDate = tripData.dateRange?.from ? formatDate(tripData.dateRange.from) : 'TBD'
      const endDate = tripData.dateRange?.to ? formatDate(tripData.dateRange.to) : 'TBD'
      return {
        optimalPeriod: `${startDate} to ${endDate}`,
        priceAdvantage: '10-15% lower',
        crowdLevel: 'Medium (50-65%)',
        description: 'AI-generated optimal travel window will appear here'
      }
    } catch {
      return {
        optimalPeriod: 'TBD to TBD',
        priceAdvantage: '10-15% lower',
        crowdLevel: 'Medium (50-65%)',
        description: 'AI-generated optimal travel window will appear here'
      }
    }
  }

  // Format optimalPeriod string (handles "2026-01-30 to 2026-01-30" -> "30 Jan 2026 to 30 Jan 2026")
  const formatOptimalPeriod = (period: string | undefined) => {
    if (!period) return 'TBD to TBD'
    // Check if it contains ISO date format (YYYY-MM-DD)
    const isoDatePattern = /(\d{4}-\d{2}-\d{2})/g
    const matches = period.match(isoDatePattern)
    if (matches && matches.length > 0) {
      let formatted = period
      matches.forEach(isoDate => {
        formatted = formatted.replace(isoDate, formatDate(isoDate))
      })
      return formatted
    }
    return period
  }

  // Match traveler preferences to plan characteristics with scoring
  const getTravelerPreferenceMatch = (planData: any, planName: string) => {
    const matches: { name: string; prefers: boolean; score: number; reasons: { text: string; positive: boolean }[] }[] = []

    const crowdText = (planData?.crowdLevel || 'Medium').toLowerCase()
    const isLowCrowd = crowdText.includes('low')
    const isHighCrowd = crowdText.includes('high')
    const isMediumCrowd = !isLowCrowd && !isHighCrowd

    // Parse plan price
    const priceStr = planData?.pricePerPerson?.replace(/[^0-9]/g, '') || '1000'
    const planPrice = parseInt(priceStr) || 1000

    // Analyze plan name and description for characteristics
    const planNameLower = planName.toLowerCase()
    const descLower = (planData?.description || '').toLowerCase()
    const keyFeatures = (planData?.keyFeatures || []).join(' ').toLowerCase()
    const benefits = (planData?.benefits || []).join(' ').toLowerCase()
    const allPlanText = `${planNameLower} ${descLower} ${keyFeatures} ${benefits}`

    // Detect plan characteristics from text
    const isBudgetPlan = allPlanText.includes('budget') || allPlanText.includes('value') || allPlanText.includes('saver') || allPlanText.includes('affordable')
    const isComfortPlan = allPlanText.includes('comfort') || allPlanText.includes('premium') || allPlanText.includes('luxury') || allPlanText.includes('serenity')
    const isBalancedPlan = allPlanText.includes('balance') || allPlanText.includes('blend') || allPlanText.includes('adventure')
    const hasSafetyFeatures = allPlanText.includes('safe') || allPlanText.includes('secure') || allPlanText.includes('verified') || allPlanText.includes('well-lit')
    const hasEarlyHours = allPlanText.includes('early') || allPlanText.includes('morning') || allPlanText.includes('9 am') || allPlanText.includes('avoid peak')
    const hasPeacefulSpots = allPlanText.includes('peaceful') || allPlanText.includes('quiet') || allPlanText.includes('relaxed') || allPlanText.includes('serene')

    tripData.travelerNames.forEach((name, idx) => {
      const pref = preferences[idx] || preferences[0]
      const travelerName = name || `Traveler ${idx + 1}`
      let score = 0
      const maxScore = 100
      const reasons: { text: string; positive: boolean }[] = []

      // 1. CROWD TOLERANCE (30 points max)
      if (pref.crowdTolerance === 'avoid-crowd') {
        if (isLowCrowd) {
          score += 30
          reasons.push({ text: 'Low crowd', positive: true })
        } else if (isMediumCrowd) {
          score += 15
          reasons.push({ text: 'Medium crowd', positive: true })
        } else {
          score -= 10
          reasons.push({ text: 'High crowd', positive: false })
        }
      } else if (pref.crowdTolerance === 'okay-crowd') {
        if (!isHighCrowd) {
          score += 25
        } else {
          score += 15
          reasons.push({ text: 'Crowded but OK', positive: true })
        }
      } else {
        score += 20 // 'any' tolerance
      }

      // 2. BUDGET (25 points max)
      const budgetMin = parseFloat(pref.budgetMin?.replace(/[^0-9]/g, '') || '0')
      const budgetMax = parseFloat(pref.budgetMax?.replace(/[^0-9]/g, '') || '0')
      if (budgetMax > 0) {
        if (planPrice <= budgetMax && planPrice >= budgetMin) {
          score += 25
          reasons.push({ text: 'Within budget', positive: true })
        } else if (planPrice <= budgetMax * 1.1) {
          score += 15
          reasons.push({ text: 'Near budget', positive: true })
        } else {
          score -= 15
          reasons.push({ text: 'Over budget', positive: false })
        }
      } else {
        score += 15 // No budget set, neutral
      }

      // 3. TRAVEL STYLE (25 points max)
      if (pref.travelStyle === 'low-budget') {
        if (isBudgetPlan) {
          score += 25
          reasons.push({ text: 'Budget friendly', positive: true })
        } else if (isBalancedPlan) {
          score += 15
        } else {
          score += 5
          reasons.push({ text: 'Premium style', positive: false })
        }
      } else if (pref.travelStyle === 'comfortable') {
        if (isComfortPlan || hasPeacefulSpots) {
          score += 25
          reasons.push({ text: 'Comfort match', positive: true })
        } else if (isBalancedPlan) {
          score += 15
        } else {
          score += 10
        }
      } else { // balanced
        if (isBalancedPlan) {
          score += 25
          reasons.push({ text: 'Balanced choice', positive: true })
        } else {
          score += 18
        }
      }

      // 4. SAFETY PREFERENCES (20 points max)
      let safetyScore = 0
      let safetyMatches = 0
      let safetyTotal = 0

      if (pref.safetyOptions.avoidLateNight) {
        safetyTotal++
        if (hasEarlyHours || hasPeacefulSpots) {
          safetyMatches++
        }
      }
      if (pref.safetyOptions.preferWellLit) {
        safetyTotal++
        if (hasSafetyFeatures) {
          safetyMatches++
        }
      }
      if (pref.safetyOptions.verifiedTransport) {
        safetyTotal++
        if (hasSafetyFeatures) {
          safetyMatches++
        }
      }

      if (safetyTotal > 0) {
        safetyScore = Math.round((safetyMatches / safetyTotal) * 20)
        if (safetyMatches === safetyTotal && safetyTotal > 0) {
          reasons.push({ text: 'Safety match', positive: true })
        } else if (safetyMatches === 0 && safetyTotal > 1) {
          reasons.push({ text: 'Safety concerns', positive: false })
        }
      } else {
        safetyScore = 15 // No safety preferences set
      }
      score += safetyScore

      // Calculate final score percentage
      const finalScore = Math.min(Math.max(Math.round((score / maxScore) * 100), 0), 100)
      const prefers = finalScore >= 60

      // If no specific reasons, add a general one
      if (reasons.length === 0) {
        reasons.push({ text: prefers ? 'Good fit' : 'Less ideal', positive: prefers })
      }

      matches.push({
        name: travelerName,
        prefers,
        score: finalScore,
        reasons
      })
    })

    return matches
  }

  // Compute bestWindow after formatDate is defined
  const bestWindow = useMemo(() => {
    if (aiBestWindow) {
      return {
        ...aiBestWindow,
        optimalPeriod: formatOptimalPeriod(aiBestWindow.optimalPeriod)
      }
    }
    return getMinimalFallbackBestWindow()
  }, [aiBestWindow, tripData.dateRange])

  return (
    <PageLayout showFlowGuide={false} maxWidth="lg" background="minimal" className="font-sans theme-rose">
      {/* Generating Modal */}
      <Dialog open={isGenerating} onOpenChange={(open) => {
        if (!open) {
          generateAbortRef.current?.abort()
          setIsGenerating(false)
          setGenerationProgress(0)
        }
      }}>
        <DialogContent showCloseButton={false} className="sm:max-w-md border-0 shadow-2xl bg-white theme-rose overflow-hidden p-0 font-[family-name:var(--font-geist-sans)]">
          {/* Accessibility title - visually hidden */}
          <DialogTitle className="sr-only">Generating your travel plan</DialogTitle>

          {/* Animated gradient background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-orange-50" />
            <div
              className="absolute w-[500px] h-[500px] -top-48 -right-48 rounded-full opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(251,113,133,0.3) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite'
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] -bottom-32 -left-32 rounded-full opacity-50"
              style={{
                background: 'radial-gradient(circle, rgba(253,164,175,0.3) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite 1s'
              }}
            />
          </div>

          <div className="relative z-10 px-8 py-10">
            {/* Main visual */}
            <div className="flex flex-col items-center text-center mb-8">
              {/* Animated globe icon */}
              <div className="relative w-24 h-24 mb-6">
                {/* Orbit path */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-200" />

                {/* Center globe */}
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/30 flex items-center justify-center">
                  <Globe2 className="h-9 w-9 text-white" />
                </div>

                {/* Orbiting sparkle */}
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                    <Sparkles className="h-4 w-4 text-rose-500" />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 tracking-tight" aria-hidden="true">
                Crafting Your Journey
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[320px] leading-relaxed">
                We're personalizing every detail to create your perfect travel experience based on your preferences
              </p>
            </div>

            {/* Step indicators - simple version without complex state */}
            <div className="flex justify-center gap-3 mb-8">
              {[
                { icon: Brain, label: 'Preferences' },
                { icon: MapPinIcon, label: 'Routes' },
                { icon: CloudRain, label: 'Conditions' },
                { icon: Sparkles, label: 'Finalize' },
              ].map((step, i) => {
                const thresholds = [15, 40, 65, 85]
                const prevThresholds = [0, 15, 40, 65]
                const isComplete = generationProgress >= thresholds[i]
                const isActive = !isComplete && generationProgress >= prevThresholds[i]
                const Icon = step.icon

                return (
                  <div key={i} className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isComplete
                          ? 'bg-rose-500 text-white'
                          : isActive
                            ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-300 ring-offset-2'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Current action text */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-300 ${
                generationProgress >= 100
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-100'
              }`}>
                {generationProgress >= 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-rose-400 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                    <span className="w-1 h-1 rounded-full bg-rose-400 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 rounded-full bg-rose-400 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  generationProgress >= 100 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {generationProgress < 15 && 'Analyzing your preferences...'}
                  {generationProgress >= 15 && generationProgress < 40 && 'Finding optimal routes...'}
                  {generationProgress >= 40 && generationProgress < 65 && 'Checking local conditions...'}
                  {generationProgress >= 65 && generationProgress < 100 && 'Finalizing your itinerary...'}
                  {generationProgress >= 100 && 'Completed! Redirecting...'}
                </span>
              </div>
            </div>

            {/* Cancel button */}
            <button
              className="w-full py-3 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-200"
              onClick={() => setIsGenerating(false)}
            >
              Wait, let me reconsider
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="transition-all duration-300">
        {/* STEP 1: Trip Details */}
        {currentStep === 'details' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center animate-bounce-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25 animate-float-bounce">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2 animate-slide-up-fade" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                <h2 className="text-2xl font-bold text-foreground">Plan Your Trip</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Enter your destination, travel dates, and group size to get started.
                  We'll create a personalized itinerary based on your preferences.
                </p>
              </div>
            </div>

            {/* Trip Details Form */}
            <Card className="shadow-md animate-slide-up-fade" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Row 1: Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-sm font-medium flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-rose-500" />
                      Where do you want to go?
                    </Label>
                    <div className="relative">
                      <Input
                        id="destination"
                        placeholder="Search Malaysian destinations..."
                        value={tripData.destination}
                        autoComplete="off"
                        onChange={(e) => {
                          const value = e.target.value
                          setTripData({ ...tripData, destination: value })
                          setDestinationSearch(value)
                          const filtered = malaysianDestinations.filter(dest =>
                            dest.toLowerCase().includes(value.toLowerCase())
                          )
                          setShowDestinationDropdown(value.length > 0 && filtered.length > 0)
                        }}
                        onFocus={() => {
                          setDestinationSearch(tripData.destination)
                          setShowDestinationDropdown(true)
                        }}
                        onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                        className="h-11 pr-10"
                      />
                      {tripData.destination && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9"
                          onClick={() => {
                            setTripData({ ...tripData, destination: '' })
                            setDestinationSearch('')
                            setShowDestinationDropdown(false)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {showDestinationDropdown && filteredDestinations.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg font-[family-name:var(--font-geist-sans)]">
                          <div className="p-1">
                            {filteredDestinations.map((destination) => (
                              <div
                                key={destination}
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  setTripData({ ...tripData, destination })
                                  setDestinationSearch('')
                                  setShowDestinationDropdown(false)
                                }}
                              >
                                <MapPinIcon className="h-4 w-4 text-primary" />
                                <span>{destination}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Travel Dates and Travelers */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Travel Dates */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-rose-500" />
                        When are you traveling?
                      </Label>
                      <DatePicker
                        dateRange={tripData.dateRange}
                        onSelect={(dateRange) => setTripData({ ...tripData, dateRange })}
                        placeholder="Select travel dates"
                      />
                    </div>

                    {/* Travelers */}
                    <div className="space-y-2">
                      <Label htmlFor="travelers" className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-rose-500" />
                        How many travelers?
                      </Label>
                      <div className="flex items-center h-11 border border-border rounded-md overflow-hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-full w-11 rounded-none border-r shrink-0"
                          onClick={() => {
                            const newCount = Math.max(1, tripData.travelers - 1)
                            const updatedNames = [...tripData.travelerNames].slice(0, newCount)
                            const updatedGenders = [...tripData.travelerGenders].slice(0, newCount)
                            while (updatedNames.length < newCount) updatedNames.push('')
                            while (updatedGenders.length < newCount) updatedGenders.push('')
                            setTripData({ ...tripData, travelers: newCount, travelerNames: updatedNames, travelerGenders: updatedGenders })
                            if (currentTravelerIndex >= newCount) setCurrentTravelerIndex(Math.max(0, newCount - 1))
                          }}
                        >
                          -
                        </Button>
                        <div className="flex-1 flex items-center justify-center gap-1.5 px-2">
                          <input
                            id="travelers"
                            type="number"
                            min="1"
                            max="50"
                            value={tripData.travelers}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1
                              const newCount = Math.max(1, Math.min(50, value))
                              const updatedNames = [...tripData.travelerNames]
                              const updatedGenders = [...tripData.travelerGenders]
                              while (updatedNames.length < newCount) updatedNames.push('')
                              while (updatedGenders.length < newCount) updatedGenders.push('')
                              while (updatedNames.length > newCount) updatedNames.pop()
                              while (updatedGenders.length > newCount) updatedGenders.pop()
                              setTripData({ ...tripData, travelers: newCount, travelerNames: updatedNames, travelerGenders: updatedGenders })
                              if (currentTravelerIndex >= newCount) setCurrentTravelerIndex(Math.max(0, newCount - 1))
                            }}
                            className="w-12 text-center text-sm font-medium bg-transparent border-none outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-sm text-muted-foreground">
                            {tripData.travelers === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-full w-11 rounded-none border-l shrink-0"
                          onClick={() => {
                            const newCount = Math.min(5, tripData.travelers + 1)
                            const updatedNames = [...tripData.travelerNames]
                            const updatedGenders = [...tripData.travelerGenders]
                            while (updatedNames.length < newCount) updatedNames.push('')
                            while (updatedGenders.length < newCount) updatedGenders.push('')
                            setTripData({ ...tripData, travelers: newCount, travelerNames: updatedNames, travelerGenders: updatedGenders })
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Generate Toggle */}
                  <div className="pt-2">
                    <div className="relative overflow-visible">
                      {/* Stars Explosion Animation - originates from toggle switch */}
                      {quickGenerate && (
                        <>
                          {[...Array(16)].map((_, i) => {
                            const angle = (i / 16) * 360 + (Math.random() * 30 - 15)
                            const distance = 40 + Math.random() * 40
                            const tx = Math.cos(angle * Math.PI / 180) * distance
                            const ty = Math.sin(angle * Math.PI / 180) * distance
                            const symbols = ['✦', '✧', '★', '✶', '✷', '✸']
                            const symbol = symbols[Math.floor(Math.random() * symbols.length)]
                            return (
                              <span
                                key={i}
                                className="absolute left-[34px] top-1/2 text-rose-400 animate-confetti-explode pointer-events-none z-10"
                                style={{
                                  '--tx': `${tx}px`,
                                  '--ty': `${ty}px`,
                                  animationDelay: `${Math.random() * 0.15}s`,
                                  fontSize: `${10 + Math.random() * 10}px`,
                                  color: `hsl(${350 + Math.random() * 20}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`
                                } as React.CSSProperties}
                              >
                                {symbol}
                              </span>
                            )
                          })}
                        </>
                      )}
                      <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                        quickGenerate
                          ? 'bg-rose-50 border-rose-300'
                          : 'bg-rose-50/50 border-rose-200'
                      }`}>
                        <Switch
                          id="quick-generate"
                          checked={quickGenerate}
                          onCheckedChange={setQuickGenerate}
                        />
                        <div className="flex-1">
                          <Label htmlFor="quick-generate" className="text-sm font-medium cursor-pointer">
                            Quick Generate
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Skip preferences and use smart defaults for faster planning
                          </p>
                        </div>
                        <Sparkles className={`h-5 w-5 transition-colors duration-300 ${quickGenerate ? 'text-rose-500' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className={`w-full h-12 font-semibold text-base bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20 transition-all duration-300 ${
                      tripData.destination && tripData.dateRange?.from && tripData.dateRange?.to
                        ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-500/30'
                        : ''
                    }`}
                    onClick={handleDetailsSubmit}
                    disabled={!tripData.destination || !tripData.dateRange?.from || !tripData.dateRange?.to}
                  >
                    {quickGenerate ? (
                      <>Generate Plan <Sparkles className="ml-2 h-5 w-5 animate-pulse" /></>
                    ) : (
                      <>Continue to Preferences <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 2: Preferences */}
        {currentStep === 'preferences' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-6">
              <div className="flex justify-center animate-bounce-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25 animate-float-bounce">
                  <Settings2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-3 animate-slide-up-fade" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                <h2 className="text-2xl font-semibold text-foreground">Your Preferences</h2>
                <p className="text-muted-foreground text-sm">Customize your travel experience to match your style</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep('details')}
                  className="gap-2 mt-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Trip Details
                </Button>
              </div>
            </div>

            {/* Traveler Management Section */}
            <div className="mb-4 space-y-3">
              {/* Add/Remove Travelers Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium">Travelers</span>
                  <Badge variant="secondary" className="text-xs">
                    {tripData.travelers} {tripData.travelers === 1 ? 'person' : 'people'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (tripData.travelers > 1) {
                        const newCount = tripData.travelers - 1
                        const updatedNames = tripData.travelerNames.slice(0, newCount)
                        const updatedGenders = tripData.travelerGenders.slice(0, newCount)
                        setTripData({
                          ...tripData,
                          travelers: newCount,
                          travelerNames: updatedNames,
                          travelerGenders: updatedGenders
                        })
                        setPreferences(prev => prev.slice(0, newCount))
                        if (currentTravelerIndex >= newCount) {
                          setCurrentTravelerIndex(newCount - 1)
                        }
                      }
                    }}
                    disabled={tripData.travelers <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (tripData.travelers < 5) {
                        const newCount = tripData.travelers + 1
                        setTripData({
                          ...tripData,
                          travelers: newCount,
                          travelerNames: [...tripData.travelerNames, ''],
                          travelerGenders: [...tripData.travelerGenders, '']
                        })
                      }
                    }}
                    disabled={tripData.travelers >= 5}
                    className="h-8 w-8 p-0"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Traveler Selection - Tabs for 2-4, Dropdown for 5 */}
              {tripData.travelers > 1 && (
                <>
                  {tripData.travelers <= 4 ? (
                    // Tabs for 2-4 travelers
                    <Tabs value={currentTravelerIndex.toString()} onValueChange={(v) => setCurrentTravelerIndex(parseInt(v))}>
                      <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tripData.travelers}, 1fr)` }}>
                        {Array.from({ length: tripData.travelers }).map((_, index) => (
                          <TabsTrigger
                            key={index}
                            value={index.toString()}
                            className="text-sm relative"
                          >
                            {tripData.travelerNames[index] || `Traveler ${index + 1}`}
                            {submitAttempted && hasErrorsForTraveler(index) && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />
                            )}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  ) : (
                    // Dropdown for 5 travelers
                    <div className="flex items-center gap-3">
                      <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Select Traveler</Label>
                      <Select
                        value={currentTravelerIndex.toString()}
                        onValueChange={(v) => setCurrentTravelerIndex(parseInt(v))}
                      >
                        <SelectTrigger className="w-full h-10 font-[family-name:var(--font-geist-sans)]">
                          <SelectValue>
                            {tripData.travelerNames[currentTravelerIndex] || `Traveler ${currentTravelerIndex + 1}`}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="font-[family-name:var(--font-geist-sans)]">
                          {Array.from({ length: tripData.travelers }).map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              <span className="flex items-center gap-2">
                                {tripData.travelerNames[index] || `Traveler ${index + 1}`}
                                {submitAttempted && hasErrorsForTraveler(index) && (
                                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {currentTravelerIndex + 1} of {tripData.travelers}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {(() => {
              const currentPrefs = preferences[currentTravelerIndex] || preferences[0]
              const updateCurrentPrefs = (updates: Partial<Preferences>) => {
                const updated = [...preferences]
                updated[currentTravelerIndex] = { ...updated[currentTravelerIndex], ...updates }
                setPreferences(updated)
              }
              return (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {/* Traveler Details */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-rose-500" />
                          Traveler Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor={`name-${currentTravelerIndex}`} className="text-sm text-muted-foreground">Name</Label>
                            <Input
                              id={`name-${currentTravelerIndex}`}
                              ref={(el) => { if (el) nameInputRefs.current.set(currentTravelerIndex, el) }}
                              placeholder={`Enter traveler name`}
                              value={tripData.travelerNames[currentTravelerIndex] || ''}
                              autoComplete="off"
                              aria-invalid={shouldShowFieldError(currentTravelerIndex, 'name')}
                              onBlur={() => markTouched(currentTravelerIndex, 'name')}
                              onChange={(e) => {
                                const updatedNames = [...tripData.travelerNames]
                                updatedNames[currentTravelerIndex] = e.target.value
                                setTripData({ ...tripData, travelerNames: updatedNames })
                              }}
                              className="h-10"
                            />
                            {shouldShowFieldError(currentTravelerIndex, 'name') && (
                              <p className="text-sm text-destructive mt-1">Name is required</p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`gender-${currentTravelerIndex}`} className="text-sm text-muted-foreground">Gender</Label>
                            <Select
                              value={tripData.travelerGenders[currentTravelerIndex] || ''}
                              onValueChange={(value) => {
                                const updatedGenders = [...tripData.travelerGenders]
                                updatedGenders[currentTravelerIndex] = value
                                setTripData({ ...tripData, travelerGenders: updatedGenders })
                                markTouched(currentTravelerIndex, 'gender')
                              }}
                            >
                              <SelectTrigger
                                id={`gender-${currentTravelerIndex}`}
                                ref={(el) => { if (el) genderTriggerRefs.current.set(currentTravelerIndex, el) }}
                                className="h-10 font-[family-name:var(--font-geist-sans)]"
                                aria-invalid={shouldShowFieldError(currentTravelerIndex, 'gender')}
                                onBlur={() => markTouched(currentTravelerIndex, 'gender')}
                              >
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className="font-[family-name:var(--font-geist-sans)]">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            {shouldShowFieldError(currentTravelerIndex, 'gender') && (
                              <p className="text-sm text-destructive mt-1">Gender is required</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Budget */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-rose-500" />
                          Budget
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Per person estimate</p>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="budget-min" className="text-sm text-muted-foreground">Minimum</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">RM</span>
                              <Input
                                id="budget-min"
                                placeholder="0"
                                value={currentPrefs.budgetMin}
                                autoComplete="off"
                                inputMode="numeric"
                                maxLength={6}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                  updateCurrentPrefs({ budgetMin: value })
                                }}
                                className="h-10 pl-10"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="budget-max" className="text-sm text-muted-foreground">Maximum</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">RM</span>
                              <Input
                                id="budget-max"
                                ref={(el) => { if (el) budgetMaxInputRefs.current.set(currentTravelerIndex, el) }}
                                placeholder="5000"
                                value={currentPrefs.budgetMax}
                                autoComplete="off"
                                inputMode="numeric"
                                maxLength={6}
                                aria-invalid={shouldShowFieldError(currentTravelerIndex, 'budgetMax')}
                                onBlur={() => markTouched(currentTravelerIndex, 'budgetMax')}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                  updateCurrentPrefs({ budgetMax: value })
                                }}
                                className="h-10 pl-10"
                              />
                            </div>
                            {shouldShowFieldError(currentTravelerIndex, 'budgetMax') && (
                              <p className="text-sm text-destructive mt-1">Maximum budget is required</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Travel Style */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Plane className="h-4 w-4 text-rose-500" />
                          Travel Style
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <RadioGroup
                          value={currentPrefs.travelStyle}
                          onValueChange={(v) => updateCurrentPrefs({ travelStyle: v })}
                          className="space-y-2"
                        >
                          {[
                            { value: 'low-budget', label: 'Budget', desc: 'Affordable options, save more' },
                            { value: 'balanced', label: 'Balanced', desc: 'Mix of value and comfort' },
                            { value: 'comfortable', label: 'Comfortable', desc: 'Premium experiences' }
                          ].map((option) => (
                            <Label
                              key={option.value}
                              htmlFor={`style-${option.value}`}
                              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                currentPrefs.travelStyle === option.value
                                  ? 'border-rose-500 bg-rose-50'
                                  : 'border-border hover:border-rose-300'
                              }`}
                            >
                              <RadioGroupItem value={option.value} id={`style-${option.value}`} />
                              <div className="flex-1">
                                <div className="text-sm font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground">{option.desc}</div>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Safety Options */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-rose-500" />
                          Safety Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3">
                        {shouldShowFieldError(currentTravelerIndex, 'safety') && (
                          <p className="text-sm text-destructive mb-2">Select at least one safety option</p>
                        )}
                        <div className={shouldShowFieldError(currentTravelerIndex, 'safety') ? 'ring-1 ring-destructive rounded-lg p-2' : ''}>
                        {[
                          { id: 'avoidLateNight', label: 'Avoid late-night activities' },
                          { id: 'preferWellLit', label: 'Prefer well-lit areas' },
                          { id: 'verifiedTransport', label: 'Verified transport only' }
                        ].map((option) => (
                          <div key={option.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={option.id} className="text-sm cursor-pointer">{option.label}</Label>
                            <Switch
                              id={option.id}
                              checked={currentPrefs.safetyOptions[option.id as keyof typeof currentPrefs.safetyOptions]}
                              onCheckedChange={(checked) => {
                                updateCurrentPrefs({
                                  safetyOptions: { ...currentPrefs.safetyOptions, [option.id]: checked }
                                })
                                markTouched(currentTravelerIndex, 'safety')
                              }}
                            />
                          </div>
                        ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    {/* Season Preference */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-rose-500" />
                          Season Preference
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Select all that apply</p>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        {shouldShowFieldError(currentTravelerIndex, 'seasons') && (
                          <p className="text-sm text-destructive mb-2">Select at least one season</p>
                        )}
                        <div className={`grid grid-cols-2 gap-2 ${shouldShowFieldError(currentTravelerIndex, 'seasons') ? 'ring-1 ring-destructive rounded-lg p-1' : ''}`}>
                          {[
                            { value: 'chinese-new-year', label: 'Chinese New Year' },
                            { value: 'hari-raya-aidilfitri', label: 'Hari Raya Aidilfitri' },
                            { value: 'hari-raya-haji', label: 'Hari Raya Haji' },
                            { value: 'deepavali', label: 'Deepavali' },
                            { value: 'thaipusam', label: 'Thaipusam' },
                            { value: 'wesak', label: 'Wesak Day' },
                            { value: 'christmas', label: 'Christmas' },
                            { value: 'merdeka', label: 'Merdeka Day' },
                            { value: 'malaysia-day', label: 'Malaysia Day' },
                            { value: 'school-holidays', label: 'School Holidays' },
                          ].map((season) => (
                            <Label
                              key={season.value}
                              htmlFor={`season-${season.value}`}
                              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                                currentPrefs.preferredSeasons.includes(season.value)
                                  ? 'border-rose-500 bg-rose-50'
                                  : 'border-border hover:border-rose-300'
                              }`}
                            >
                              <Checkbox
                                id={`season-${season.value}`}
                                checked={currentPrefs.preferredSeasons.includes(season.value)}
                                onCheckedChange={(checked) => {
                                  const newSeasons = checked
                                    ? [...currentPrefs.preferredSeasons, season.value]
                                    : currentPrefs.preferredSeasons.filter(s => s !== season.value)
                                  updateCurrentPrefs({ preferredSeasons: newSeasons })
                                  markTouched(currentTravelerIndex, 'seasons')
                                }}
                              />
                              <span className="text-sm">{season.label}</span>
                            </Label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Crowd Preference */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-rose-500" />
                          Crowd Preference
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <RadioGroup
                          value={currentPrefs.crowdTolerance}
                          onValueChange={(v) => updateCurrentPrefs({ crowdTolerance: v })}
                          className="space-y-2"
                        >
                          {[
                            { value: 'avoid-crowd', label: 'Avoid crowds', desc: 'Quieter spots, off-peak times' },
                            { value: 'okay-crowd', label: 'Okay with crowds', desc: 'Popular attractions are fine' },
                            { value: 'no-preference', label: 'No preference', desc: 'Flexible with any crowd level' }
                          ].map((option) => (
                            <Label
                              key={option.value}
                              htmlFor={`crowd-${option.value}`}
                              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                currentPrefs.crowdTolerance === option.value
                                  ? 'border-rose-500 bg-rose-50'
                                  : 'border-border hover:border-rose-300'
                              }`}
                            >
                              <RadioGroupItem value={option.value} id={`crowd-${option.value}`} />
                              <div className="flex-1">
                                <div className="text-sm font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground">{option.desc}</div>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Alert Preferences */}
                    <Card className="animate-slide-up-fade" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Bell className="h-4 w-4 text-rose-500" />
                          Alert Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3">
                        {shouldShowFieldError(currentTravelerIndex, 'alerts') && (
                          <p className="text-sm text-destructive mb-2">Select at least one alert preference</p>
                        )}
                        <div className={shouldShowFieldError(currentTravelerIndex, 'alerts') ? 'ring-1 ring-destructive rounded-lg p-2' : ''}>
                        {[
                          { id: 'crowd', label: 'Crowd alerts' },
                          { id: 'weather', label: 'Weather alerts' },
                          { id: 'price', label: 'Price drops' },
                          { id: 'safety', label: 'Safety warnings' }
                        ].map((option) => (
                          <div key={option.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={`alert-${option.id}`} className="text-sm cursor-pointer">{option.label}</Label>
                            <Switch
                              id={`alert-${option.id}`}
                              checked={currentPrefs.notifications[option.id as keyof typeof currentPrefs.notifications]}
                              onCheckedChange={(checked) => {
                                updateCurrentPrefs({
                                  notifications: { ...currentPrefs.notifications, [option.id]: checked }
                                })
                                markTouched(currentTravelerIndex, 'alerts')
                              }}
                            />
                          </div>
                        ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })()}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                className="w-full h-11 font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20"
                onClick={handlePreferencesSubmit}
              >
                Generate Travel Plan
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              {submitAttempted && !isPreferencesValid && (
                <p className="text-sm text-destructive text-center mt-2">
                  Please fill in all required fields for each traveler
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {currentStep === 'results' && (
          <div className="space-y-3">
            {/* Trip Header */}
            <div className="bg-card text-card-foreground rounded-xl border shadow-sm font-[family-name:var(--font-geist-sans)] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0s', animationFillMode: 'backwards' }}>
              {/* Top Section with Gradient */}
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-rose-100 text-xs font-medium mb-0.5">Your Destination</p>
                      <h1 className="text-xl font-bold text-white">{tripData.destination}</h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" className="h-9 w-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0">
                        <Share2 className="h-4 w-4 text-white" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-2 font-[family-name:var(--font-geist-sans)]">
                      <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Share this plan</p>
                      {[
                        { name: 'WhatsApp', icon: MessageCircle, bg: 'bg-green-500' },
                        { name: 'Email', icon: Mail, bg: 'bg-blue-500' },
                        { name: 'Facebook', icon: Facebook, bg: 'bg-blue-600' },
                        { name: 'Instagram', icon: Instagram, bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
                        { name: 'Threads', icon: AtSign, bg: 'bg-black dark:bg-white dark:text-black' },
                      ].map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          className="w-full justify-start gap-2.5 h-9 px-2 hover:bg-muted"
                          onClick={() => {
                            setSharedPlatform(item.name)
                            setShowShareSuccess(true)
                          }}
                        >
                          <div className={`w-6 h-6 rounded-md ${item.bg} flex items-center justify-center`}>
                            <item.icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

              {/* Bottom Section with Trip Details */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Trip Info Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30">
                      <Calendar className="h-4 w-4 text-rose-600" />
                      <span className="text-sm font-medium">{formatDateRange(tripData.dateRange)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30">
                      <Users className="h-4 w-4 text-rose-600" />
                      <span className="text-sm font-medium">{tripData.travelers} {tripData.travelers === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>

                  {/* Quick Plan Generation Label - Only for quick generate mode */}
                  {quickGenerateData && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-950/20 border border-rose-200 dark:border-rose-800/30">
                      <Zap className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Quick Plan Generation</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Traveler Preferences Dialog */}
            <Dialog open={showAllPreferences} onOpenChange={setShowAllPreferences}>
              <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] p-0 flex flex-col gap-0 font-[family-name:var(--font-geist-sans)]">
                <DialogHeader className="px-5 py-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <DialogTitle className="text-sm font-semibold">Group Preferences</DialogTitle>
                      <DialogDescription className="text-xs">
                        {tripData.destination} · {tripData.travelers} {tripData.travelers === 1 ? 'traveler' : 'travelers'}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {tripData.travelerNames.map((name, index) => {
                      const travelerName = name || `Traveler ${index + 1}`
                      const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500']
                      const pref = preferences[index] || preferences[0]
                      const gender = tripData.travelerGenders[index]

                      const getTravelStyleConfig = () => {
                        if (pref.travelStyle === 'low-budget') return { label: 'Budget', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' }
                        if (pref.travelStyle === 'comfortable') return { label: 'Comfort', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' }
                        return { label: 'Balanced', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' }
                      }
                      const travelStyle = getTravelStyleConfig()

                      const getCrowdConfig = () => {
                        if (pref.crowdTolerance === 'avoid-crowd') return { label: 'Avoid Crowds', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' }
                        if (pref.crowdTolerance === 'okay-crowd') return { label: 'Crowds OK', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' }
                        return { label: 'Any Crowd', icon: Users, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-800/30' }
                      }
                      const crowdPref = getCrowdConfig()

                      const safetyCount = [pref.safetyOptions.avoidLateNight, pref.safetyOptions.preferWellLit, pref.safetyOptions.verifiedTransport].filter(Boolean).length

                      return (
                        <div key={index} className="border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow">
                          {/* Traveler Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white font-semibold text-xs shadow-sm`}>
                              {travelerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{travelerName}</p>
                              {gender && (
                                <p className="text-xs text-muted-foreground capitalize">{gender}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              Traveler {index + 1}
                            </Badge>
                          </div>

                          {/* Preferences Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Travel Style */}
                            <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${travelStyle.bg}`}>
                              <travelStyle.icon className={`h-4 w-4 shrink-0 ${travelStyle.color}`} />
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Style</p>
                                <p className={`text-sm font-semibold ${travelStyle.color}`}>{travelStyle.label}</p>
                              </div>
                            </div>

                            {/* Budget */}
                            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                              <DollarSign className="h-4 w-4 shrink-0 text-emerald-600" />
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="text-sm font-semibold text-emerald-600 truncate">
                                  {pref.budgetMax ? `RM ${pref.budgetMax}` : 'Flexible'}
                                </p>
                              </div>
                            </div>

                            {/* Crowd Preference */}
                            <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${crowdPref.bg}`}>
                              <crowdPref.icon className={`h-4 w-4 shrink-0 ${crowdPref.color}`} />
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Crowd</p>
                                <p className={`text-sm font-semibold ${crowdPref.color}`}>{crowdPref.label}</p>
                              </div>
                            </div>

                            {/* Safety */}
                            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                              <Shield className="h-4 w-4 shrink-0 text-rose-600" />
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Safety</p>
                                <p className="text-sm font-semibold text-rose-600">
                                  {safetyCount === 3 ? 'All enabled' : safetyCount === 0 ? 'None' : `${safetyCount} option${safetyCount > 1 ? 's' : ''}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Safety Details */}
                          {safetyCount > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex flex-wrap gap-1.5">
                                {pref.safetyOptions.avoidLateNight && (
                                  <Badge variant="secondary" className="text-xs gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    No late nights
                                  </Badge>
                                )}
                                {pref.safetyOptions.preferWellLit && (
                                  <Badge variant="secondary" className="text-xs gap-1.5">
                                    <Sun className="h-3 w-3" />
                                    Well-lit areas
                                  </Badge>
                                )}
                                {pref.safetyOptions.verifiedTransport && (
                                  <Badge variant="secondary" className="text-xs gap-1.5">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Verified transport
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <div className="px-5 py-4 border-t bg-muted/30 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {tripData.travelers} traveler{tripData.travelers > 1 ? 's' : ''} configured
                  </p>
                  <Button size="sm" onClick={() => setShowAllPreferences(false)} className="bg-rose-500 hover:bg-rose-600">
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Share Success Dialog */}
            <Dialog open={showShareSuccess} onOpenChange={setShowShareSuccess}>
              <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm p-0 overflow-hidden font-[family-name:var(--font-geist-sans)]">
                <DialogHeader className="sr-only">
                  <DialogTitle>Share Success</DialogTitle>
                </DialogHeader>
                <div className="p-6 text-center">
                  {/* Success Animation */}
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 animate-ping opacity-25" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg animate-bounce-in">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Success Message */}
                  <h3 className="text-lg font-semibold mb-2">Shared Successfully!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your travel plan has been shared via <span className="font-medium text-foreground">{sharedPlatform}</span>.
                    Your friends and family can now view your trip details.
                  </p>

                  {/* Destination Info */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 mb-4">
                    <MapPinIcon className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-sm font-medium">{tripData.destination}</span>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={() => setShowShareSuccess(false)}
                    className="w-full bg-rose-500 hover:bg-rose-600"
                  >
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Quick Generate View - Minimal Design */}
            {quickGenerateData && (
              <>
                {/* Quick Overview Section */}
                <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20 dark:to-transparent p-4 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-sm font-semibold">Quick Overview</h3>
                  </div>

                  {/* Content Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Left Column - Budget & Highlights */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated Budget</p>
                        <p className="text-2xl font-bold">{quickGenerateData.summary?.estimatedBudget || 'RM 500 - RM 1,500'}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                      {quickGenerateData.summary?.highlights && quickGenerateData.summary.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {quickGenerateData.summary.highlights.map((highlight: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column - Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-rose-100 dark:border-rose-900/30">
                        <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Best Time</p>
                          <p className="text-sm font-semibold">Morning</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-rose-100 dark:border-rose-900/30">
                        <Users className={`h-4 w-4 shrink-0 ${
                          quickGenerateData.predictions?.crowdLevel?.overall === 'Low' ? 'text-emerald-500' :
                          quickGenerateData.predictions?.crowdLevel?.overall === 'High' ? 'text-orange-500' : 'text-amber-500'
                        }`} />
                        <div>
                          <p className="text-xs text-muted-foreground">Crowd</p>
                          <p className={`text-sm font-semibold ${
                            quickGenerateData.predictions?.crowdLevel?.overall === 'Low' ? 'text-emerald-600' :
                            quickGenerateData.predictions?.crowdLevel?.overall === 'High' ? 'text-orange-600' : 'text-amber-600'
                          }`}>{quickGenerateData.predictions?.crowdLevel?.overall || 'Medium'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-rose-100 dark:border-rose-900/30">
                        <Activity className="h-4 w-4 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Peak Hours</p>
                          <p className="text-sm font-semibold">{quickGenerateData.predictions?.crowdLevel?.peakHours || '11am - 2pm'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-rose-100 dark:border-rose-900/30">
                        <Building2 className="h-4 w-4 text-purple-500 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hotels</p>
                          <p className="text-sm font-semibold">{100 - (quickGenerateData.predictions?.hotelOccupancy?.percentage || 65)}% Available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predictive Analytics - Same style as preference-based */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold">Predictive Analytics</h3>
                  </div>

                  {/* Weather & Price Row - Same as preference-based */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* Weather Forecast */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">During Your Trip</p>
                          <p className="text-2xl font-bold">{quickGenerateData.predictions?.weather?.temperature || '28-33°C'}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{quickGenerateData.predictions?.weather?.condition || 'Partly Cloudy'}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          quickGenerateData.predictions?.weather?.icon === 'sun' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          quickGenerateData.predictions?.weather?.icon === 'cloud-rain' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                          {quickGenerateData.predictions?.weather?.icon === 'sun' && <Sun className="h-6 w-6 text-amber-500" />}
                          {quickGenerateData.predictions?.weather?.icon === 'cloud-sun' && <CloudSun className="h-6 w-6 text-amber-500" />}
                          {quickGenerateData.predictions?.weather?.icon === 'cloud' && <CloudSun className="h-6 w-6 text-gray-500" />}
                          {quickGenerateData.predictions?.weather?.icon === 'cloud-rain' && <CloudRain className="h-6 w-6 text-blue-500" />}
                          {!quickGenerateData.predictions?.weather?.icon && <CloudSun className="h-6 w-6 text-amber-500" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <CloudRain className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">{quickGenerateData.predictions?.weather?.rainChance || 30}% rain</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <Thermometer className="h-4 w-4 text-rose-500" />
                          <span className="text-xs font-medium">{quickGenerateData.predictions?.weather?.humidity || 75}% humidity</span>
                        </div>
                      </div>
                      {quickGenerateData.predictions?.weather?.summary && (
                        <p className="text-xs text-muted-foreground mt-3">{quickGenerateData.predictions?.weather?.summary}</p>
                      )}
                    </div>

                    {/* Price Trend */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Price for Your Dates</p>
                          <div className="flex items-center gap-1.5">
                            <p className={`text-2xl font-bold ${
                              (quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                            }`}>
                              {(quickGenerateData.predictions?.pricing?.percentChange || 0) > 0 ? '+' : ''}{quickGenerateData.predictions?.pricing?.percentChange || -5}%
                            </p>
                            {(quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? (
                              <TrendingDown className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {(quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? 'below' : 'above'} average
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          (quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          <DollarSign className={`h-6 w-6 ${
                            (quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? 'text-emerald-500' : 'text-orange-500'
                          }`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <span className="text-xs">Hotels</span>
                          <span className={`text-xs font-semibold ${
                            (quickGenerateData.predictions?.pricing?.percentChange || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {(quickGenerateData.predictions?.pricing?.percentChange || 0) > 0 ? '+' : ''}{quickGenerateData.predictions?.pricing?.percentChange || -5}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <span className="text-xs">Activities</span>
                          <span className="text-xs font-semibold text-emerald-600">-5%</span>
                        </div>
                      </div>
                      {quickGenerateData.predictions?.pricing?.summary && (
                        <p className="text-xs text-muted-foreground mt-3">{quickGenerateData.predictions?.pricing?.summary}</p>
                      )}
                    </div>
                  </div>

                  {/* Analytics Grid - Same as preference-based */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Hotel Occupancy */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Hotel Occupancy</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-2xl font-bold">{quickGenerateData.predictions?.hotelOccupancy?.percentage || 65}%</span>
                        <span className="text-xs text-muted-foreground">booked</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${quickGenerateData.predictions?.hotelOccupancy?.percentage || 65}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{quickGenerateData.predictions?.hotelOccupancy?.summary || 'Good availability expected'}</p>
                    </div>

                    {/* Crowd Level - Bar Chart */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Users className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-sm font-medium">Crowd Level</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Hourly</Badge>
                      </div>
                      <ChartContainer
                        config={{
                          crowd: { label: "Crowded", color: "#f97316" }
                        }}
                        className="h-[72px] w-full"
                      >
                        <BarChart
                          data={(quickGenerateData.predictions?.crowdLevel?.data || [
                            { time: '6am', level: 15 },
                            { time: '8am', level: 35 },
                            { time: '10am', level: 55 },
                            { time: '12pm', level: 75 },
                            { time: '2pm', level: 70 },
                            { time: '4pm', level: 60 },
                            { time: '6pm', level: 45 },
                            { time: '9pm', level: 25 }
                          ]).map((d: any) => ({ time: d.time, crowd: d.level }))}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <XAxis dataKey="time" hide />
                          <YAxis hide domain={[0, 100]} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(label) => `${label}`}
                                formatter={(value) => [`${value}%`, "Crowded"]}
                              />
                            }
                          />
                          <Bar dataKey="crowd" fill="var(--color-crowd)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <p className="text-xs text-muted-foreground mt-3">{quickGenerateData.predictions?.crowdLevel?.summary || `Peak ${quickGenerateData.predictions?.crowdLevel?.peakHours || '11am-2pm'}. Best early morning.`}</p>
                    </div>

                    {/* Traffic Chart */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <Car className="h-4 w-4 text-rose-500" />
                          </div>
                          <span className="text-sm font-medium">Traffic</span>
                        </div>
                        <Badge className="text-xs bg-rose-500 hover:bg-rose-600">{quickGenerateData.predictions?.traffic?.peakDelay || '15-25 min'}</Badge>
                      </div>
                      <ChartContainer
                        config={{
                          traffic: { label: "Congestion", color: "#f43f5e" }
                        }}
                        className="h-[72px] w-full"
                      >
                        <LineChart
                          data={(quickGenerateData.predictions?.traffic?.data || [
                            { time: '6am', level: 20 },
                            { time: '8am', level: 75 },
                            { time: '10am', level: 45 },
                            { time: '12pm', level: 50 },
                            { time: '2pm', level: 40 },
                            { time: '4pm', level: 55 },
                            { time: '6pm', level: 80 },
                            { time: '9pm', level: 30 }
                          ]).map((d: any) => ({ time: d.time, traffic: d.level }))}
                          margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
                        >
                          <XAxis dataKey="time" hide />
                          <YAxis hide domain={[0, 100]} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(label) => `${label}`}
                                formatter={(value) => [`${value}%`, "Congestion"]}
                              />
                            }
                          />
                          <Line type="monotone" dataKey="traffic" stroke="var(--color-traffic)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ChartContainer>
                      <p className="text-xs text-muted-foreground mt-3">{quickGenerateData.predictions?.traffic?.summary || 'Avoid rush hours 8-9am and 5-7pm'}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Tips - Same style as preference-based Personalized Suggestions */}
                <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20 dark:to-transparent p-4 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-sm font-semibold">Quick Tips</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(quickGenerateData.quickTips || []).map((tip: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/60 border hover:bg-background/80 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-xs text-white font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold mb-1">{tip.title}</p>
                          <p className="text-xs text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Preference-based Plan View */}
            {generatedPlan && !quickGenerateData && (
              <>
            {/* Plan Selection */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-semibold">Choose Your Plan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {generatedPlan?.plans && Object.entries(generatedPlan.plans).map(([planName, planData]: [string, any], index: number) => {
                  const isSelected = selectedPlan === planName
                  const isRecommended = index === 1

                  const crowdText = planData?.crowdLevel || 'Medium Crowd'
                  const crowdLower = crowdText.toLowerCase()
                  const getCrowdConfig = () => {
                    if (crowdLower.includes('low')) return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', dot: 'bg-emerald-500' }
                    if (crowdLower.includes('high')) return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', dot: 'bg-orange-500' }
                    return { label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', dot: 'bg-blue-500' }
                  }
                  const crowd = getCrowdConfig()

                  // Get traveler preference matches for this plan
                  const travelerMatches = getTravelerPreferenceMatch(planData, planName)
                  const prefersCount = travelerMatches.filter(m => m.prefers).length
                  const allPrefer = prefersCount === travelerMatches.length
                  const avgScore = Math.round(travelerMatches.reduce((sum, m) => sum + m.score, 0) / travelerMatches.length)

                  return (
                    <div
                      key={planName}
                      onClick={() => handleSelectPlan(planName)}
                      className={`relative cursor-pointer rounded-xl border bg-card p-5 transition-all duration-200 h-full flex flex-col animate-fade-in-scale ${
                        isSelected
                          ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20'
                          : 'border-border hover:border-rose-300 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${0.15 + index * 0.1}s`, animationFillMode: 'backwards' }}
                    >
                      {isRecommended && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="text-xs px-2.5 py-0.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 shadow-sm">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-semibold text-base leading-tight">{planName}</h4>
                        <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-rose-500 bg-rose-500' : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px] leading-relaxed flex-grow">
                        {planData?.description || 'Personalized travel plan'}
                      </p>

                      <div className="mb-4">
                        <span className="text-2xl font-bold text-foreground">
                          {planData?.pricePerPerson?.replace('/ person', '').replace('/person', '').trim() || 'RM 1,000'}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">/ person</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${crowd.bg} ${crowd.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${crowd.dot}`} />
                          {crowd.label} Crowd
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          avgScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                          avgScore >= 60 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                          'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                        }`}>
                          <Activity className="h-3 w-3" />
                          {avgScore}% match
                        </div>
                        {allPrefer && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            All prefer
                          </div>
                        )}
                      </div>

                      {/* Traveler Preference Labels - Compact View */}
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">Traveler match:</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-emerald-600 font-medium">{prefersCount} prefer</span>
                            {travelerMatches.length - prefersCount > 0 && (
                              <>
                                <span className="text-xs text-muted-foreground">·</span>
                                <span className="text-xs text-orange-600 font-medium">{travelerMatches.length - prefersCount} less ideal</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {travelerMatches.map((match, idx) => {
                            const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500']
                            const mainReason = match.reasons[0]?.text || (match.prefers ? 'Good fit' : 'Less ideal')
                            return (
                              <Popover key={idx}>
                                <PopoverTrigger asChild>
                                  <button
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors ${
                                      match.prefers
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                                        : 'bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                                    }`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className={`w-5 h-5 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-[10px] font-semibold ring-2 ${match.prefers ? 'ring-emerald-400' : 'ring-orange-400'}`}>
                                      {match.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`font-medium ${match.prefers ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'}`}>
                                      {match.score}%
                                    </span>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-56 p-3 font-[family-name:var(--font-geist-sans)]"
                                  align="center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-xs font-semibold`}>
                                          {match.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold">{match.name}</span>
                                      </div>
                                      {match.prefers ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                      ) : (
                                        <X className="h-5 w-5 text-orange-500" />
                                      )}
                                    </div>
                                    <div className={`text-center py-2 rounded-lg ${match.prefers ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-orange-50 dark:bg-orange-950/30'}`}>
                                      <span className={`text-2xl font-bold ${match.prefers ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {match.score}%
                                      </span>
                                      <p className={`text-xs ${match.prefers ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {match.prefers ? 'Prefers this plan' : 'Less ideal'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1.5">Match details:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {match.reasons.map((reason, rIdx) => (
                                          <span
                                            key={rIdx}
                                            className={`text-xs px-2 py-0.5 rounded-full ${
                                              reason.positive
                                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400'
                                            }`}
                                          >
                                            {reason.text}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Plan Details */}
            {generatedPlan?.plans?.[selectedPlan] && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-rose-500" />
                  <h3 className="text-sm font-semibold">Plan Details</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Key Features */}
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                      </div>
                      <p className="text-sm font-semibold">Key Features</p>
                    </div>
                    <div className="space-y-2.5">
                      {(generatedPlan.plans[selectedPlan].keyFeatures || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold">Benefits</p>
                    </div>
                    <div className="space-y-2.5">
                      {(generatedPlan.plans[selectedPlan].benefits || []).map((benefit: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

                {/* Best Travel Window / Optimal Period */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold">Best Travel Window</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Optimal Period */}
                    <div className="rounded-xl border bg-card p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-5 w-5 text-rose-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Optimal Period</p>
                      <p className="text-sm font-semibold">{bestWindow.optimalPeriod}</p>
                    </div>

                    {/* Price Advantage */}
                    <div className="rounded-xl border bg-card p-4 text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        bestWindow.priceDirection === 'higher'
                          ? 'bg-orange-100 dark:bg-orange-900/30'
                          : 'bg-emerald-100 dark:bg-emerald-900/30'
                      }`}>
                        {bestWindow.priceDirection === 'higher' ? (
                          <TrendingUp className="h-5 w-5 text-orange-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className={`text-sm font-semibold ${
                        bestWindow.priceDirection === 'higher' ? 'text-orange-600' : 'text-emerald-600'
                      }`}>{bestWindow.priceAdvantage}</p>
                    </div>

                    {/* Crowd Level */}
                    <div className="rounded-xl border bg-card p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Crowd</p>
                      <p className="text-sm font-semibold">{bestWindow.crowdLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Predictive Analytics */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold">Predictive Analytics</h3>
                  </div>

                  {/* Weather & Price Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* Weather Forecast - Dynamic */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">During Your Trip</p>
                          <p className="text-2xl font-bold">{analytics.weather?.temperature || '28-33°C'}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{analytics.weather?.condition || 'Partly Cloudy'}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          analytics.weather?.icon === 'sun' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          analytics.weather?.icon === 'cloud-rain' || analytics.weather?.icon === 'cloud-storm' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          analytics.weather?.icon === 'cloud' ? 'bg-gray-100 dark:bg-gray-800/30' :
                          'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                          {analytics.weather?.icon === 'sun' && <Sun className="h-6 w-6 text-amber-500" />}
                          {analytics.weather?.icon === 'cloud-sun' && <CloudSun className="h-6 w-6 text-amber-500" />}
                          {analytics.weather?.icon === 'cloud' && <CloudSun className="h-6 w-6 text-gray-500" />}
                          {(analytics.weather?.icon === 'cloud-rain' || analytics.weather?.icon === 'cloud-storm') && <CloudRain className="h-6 w-6 text-blue-500" />}
                          {!analytics.weather?.icon && <CloudSun className="h-6 w-6 text-amber-500" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <CloudRain className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">{analytics.weather?.rainChance || 30}% rain</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <Thermometer className="h-4 w-4 text-rose-500" />
                          <span className="text-xs font-medium">{analytics.weather?.humidity || 75}% humidity</span>
                        </div>
                      </div>
                      {analytics.weather?.summary && (
                        <p className="text-xs text-muted-foreground mt-3">{analytics.weather.summary}</p>
                      )}
                    </div>

                    {/* Price Trend - Dynamic */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Price for Your Dates</p>
                          <div className="flex items-center gap-1.5">
                            <p className={`text-2xl font-bold ${
                              (analytics.priceIndex?.percentChange || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                            }`}>
                              {(analytics.priceIndex?.percentChange || 0) > 0 ? '+' : ''}{analytics.priceIndex?.percentChange || -10}%
                            </p>
                            {(analytics.priceIndex?.trend === 'down' || (analytics.priceIndex?.percentChange || 0) < 0) ? (
                              <TrendingDown className="h-5 w-5 text-emerald-500" />
                            ) : (analytics.priceIndex?.trend === 'up' || (analytics.priceIndex?.percentChange || 0) > 0) ? (
                              <TrendingUp className="h-5 w-5 text-orange-500" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {(analytics.priceIndex?.percentChange || 0) < 0 ? 'below' : 'above'} average
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          (analytics.priceIndex?.percentChange || 0) < 0
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : 'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          <DollarSign className={`h-6 w-6 ${
                            (analytics.priceIndex?.percentChange || 0) < 0 ? 'text-emerald-500' : 'text-orange-500'
                          }`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <span className="text-xs">Hotels</span>
                          <span className={`text-xs font-semibold ${
                            (analytics.priceIndex?.hotels || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {(analytics.priceIndex?.hotels || 0) > 0 ? '+' : ''}{analytics.priceIndex?.hotels || -12}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <span className="text-xs">Flights</span>
                          <span className={`text-xs font-semibold ${
                            (analytics.priceIndex?.flights || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {(analytics.priceIndex?.flights || 0) > 0 ? '+' : ''}{analytics.priceIndex?.flights || -8}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                          <span className="text-xs">Activities</span>
                          <span className={`text-xs font-semibold ${
                            (analytics.priceIndex?.activities || 0) < 0 ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {(analytics.priceIndex?.activities || 0) > 0 ? '+' : ''}{analytics.priceIndex?.activities || -5}%
                          </span>
                        </div>
                      </div>
                      {analytics.priceIndex?.summary && (
                        <p className="text-xs text-muted-foreground mt-3">{analytics.priceIndex.summary}</p>
                      )}
                    </div>
                  </div>

                  {/* Analytics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {/* Hotel Occupancy - Dynamic */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Hotel Occupancy</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-2xl font-bold">{analytics.hotelOccupancy?.percentage || 65}%</span>
                        <span className="text-xs text-muted-foreground">booked</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${analytics.hotelOccupancy?.percentage || 65}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{analytics.hotelOccupancy?.summary || 'Good availability expected'}</p>
                    </div>

                    {/* Attraction Crowd - Bar Chart with Dynamic Data */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Users className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-sm font-medium">Crowd Level</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Hourly</Badge>
                      </div>
                      <ChartContainer
                        config={{
                          crowd: { label: "Crowded", color: "#f97316" }
                        }}
                        className="h-[72px] w-full"
                      >
                        <BarChart
                          data={(analytics.crowdLevel?.data || [
                            { time: '6am', level: 15 },
                            { time: '8am', level: 35 },
                            { time: '10am', level: 55 },
                            { time: '12pm', level: 75 },
                            { time: '2pm', level: 70 },
                            { time: '4pm', level: 60 },
                            { time: '6pm', level: 45 },
                            { time: '9pm', level: 25 }
                          ]).map((d: any) => ({ time: d.time, crowd: d.level }))}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <XAxis dataKey="time" hide />
                          <YAxis hide domain={[0, 100]} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(label) => `${label}`}
                                formatter={(value) => [`${value}%`, "Crowded"]}
                              />
                            }
                          />
                          <Bar dataKey="crowd" fill="var(--color-crowd)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <p className="text-xs text-muted-foreground mt-3">{analytics.crowdLevel?.summary || `Peak ${analytics.crowdLevel?.peakTime || '11am-2pm'}. Best before 9am`}</p>
                    </div>

                    {/* Traffic - Line Chart with Dynamic Data */}
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-rose-500" />
                          </div>
                          <span className="text-sm font-medium">Traffic</span>
                        </div>
                        <Badge className="text-xs bg-rose-500 hover:bg-rose-600">{analytics.traffic?.peakDelay || '15-25 min'}</Badge>
                      </div>
                      <ChartContainer
                        config={{
                          traffic: { label: "Congestion", color: "#f43f5e" }
                        }}
                        className="h-[72px] w-full"
                      >
                        <LineChart
                          data={(analytics.traffic?.data || [
                            { time: '6am', level: 20 },
                            { time: '8am', level: 75 },
                            { time: '10am', level: 45 },
                            { time: '12pm', level: 50 },
                            { time: '2pm', level: 40 },
                            { time: '4pm', level: 55 },
                            { time: '6pm', level: 80 },
                            { time: '9pm', level: 30 }
                          ]).map((d: any) => ({ time: d.time, traffic: d.level }))}
                          margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
                        >
                          <XAxis dataKey="time" hide />
                          <YAxis hide domain={[0, 100]} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(label) => `${label}`}
                                formatter={(value) => [`${value}%`, "Congestion"]}
                              />
                            }
                          />
                          <Line type="monotone" dataKey="traffic" stroke="var(--color-traffic)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ChartContainer>
                      <p className="text-xs text-muted-foreground mt-3">{analytics.traffic?.summary || 'Avoid rush hours 8-9am and 5-7pm'}</p>
                    </div>

                  </div>
                </div>

                {/* Sustainability Dashboard */}
                <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20 dark:to-transparent p-4 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-sm font-semibold">Sustainability Dashboard</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Resource Impact */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Resource Impact</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Water Usage', value: sustainability.waterUsage },
                          { label: 'Waste Generation', value: sustainability.wasteGeneration },
                          { label: 'Energy Consumption', value: sustainability.energyConsumption }
                        ].map((item) => (
                          <div key={item.label} className="p-3 bg-background/60 rounded-lg border hover:bg-background/80 transition-colors">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className={`font-semibold ${
                                item.value?.level === 'Low' ? 'text-emerald-600' :
                                item.value?.level === 'High' ? 'text-orange-600' :
                                'text-blue-600'
                              }`}>{item.value?.level || 'Medium'}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  item.value?.level === 'Low' ? 'bg-emerald-500' :
                                  item.value?.level === 'High' ? 'bg-orange-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${item.value?.value || 50}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Community Impact */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Community Impact</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Local Business Support', value: sustainability.localBusinessSupport || sustainability.localBusiness || 'Medium', isPositiveGood: true },
                          { label: 'Infrastructure Pressure', value: sustainability.infrastructurePressure || 'Medium', isPositiveGood: false },
                          { label: 'Cultural Preservation', value: sustainability.culturalPreservation || 'Positive', isPositiveGood: true }
                        ].map((item) => {
                          // Convert text value to percentage
                          const getPercentage = () => {
                            if (item.value === 'High' || item.value === 'Positive') return 85
                            if (item.value === 'Low' || item.value === 'Negative') return 25
                            return 50 // Medium/Neutral
                          }
                          const percentage = getPercentage()

                          // Determine color based on whether high/positive is good or bad
                          const getColor = () => {
                            if (item.isPositiveGood) {
                              // High/Positive = good (green), Low/Negative = bad (orange)
                              if (item.value === 'High' || item.value === 'Positive') return { text: 'text-emerald-600', bar: 'bg-emerald-500' }
                              if (item.value === 'Low' || item.value === 'Negative') return { text: 'text-orange-600', bar: 'bg-orange-500' }
                            } else {
                              // Infrastructure Pressure: Low = good (green), High = bad (orange)
                              if (item.value === 'Low') return { text: 'text-emerald-600', bar: 'bg-emerald-500' }
                              if (item.value === 'High') return { text: 'text-orange-600', bar: 'bg-orange-500' }
                            }
                            return { text: 'text-blue-600', bar: 'bg-blue-500' } // Medium/Neutral
                          }
                          const colors = getColor()

                          return (
                            <div key={item.label} className="p-3 bg-background/60 rounded-lg border hover:bg-background/80 transition-colors">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">{item.label}</span>
                                <span className={`font-semibold ${colors.text}`}>{item.value}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predictions & Alerts */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold">Predictions & Alerts</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Crowd Alert - Show first one only */}
                    {(alerts.crowd || [])[0] && (
                      <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{(alerts.crowd || [])[0].title}</span>
                              <Badge className={`text-xs ${
                                (alerts.crowd || [])[0].levelType === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                (alerts.crowd || [])[0].levelType === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                (alerts.crowd || [])[0].levelType === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                'bg-blue-500 hover:bg-blue-600'
                              }`}>{(alerts.crowd || [])[0].level}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{(alerts.crowd || [])[0].location} · {(alerts.crowd || [])[0].time}</p>
                            {(alerts.crowd || [])[0].description && <p className="text-xs text-muted-foreground mb-2">{(alerts.crowd || [])[0].description}</p>}
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50">
                              <Brain className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{(alerts.crowd || [])[0].suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weather Alert - Show first one only */}
                    {(alerts.weather || [])[0] && (
                      <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <CloudRain className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{(alerts.weather || [])[0].title}</span>
                              <Badge className={`text-xs ${
                                (alerts.weather || [])[0].levelType === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                (alerts.weather || [])[0].levelType === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                (alerts.weather || [])[0].levelType === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                'bg-blue-500 hover:bg-blue-600'
                              }`}>{(alerts.weather || [])[0].level}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{(alerts.weather || [])[0].location} · {(alerts.weather || [])[0].time}</p>
                            {(alerts.weather || [])[0].description && <p className="text-xs text-muted-foreground mb-2">{(alerts.weather || [])[0].description}</p>}
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50">
                              <Brain className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{(alerts.weather || [])[0].suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price Alert - Show first one only */}
                    {(alerts.price || [])[0] && (
                      <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <Tag className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{(alerts.price || [])[0].title}</span>
                              <Badge className={`text-xs ${
                                (alerts.price || [])[0].levelType === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                (alerts.price || [])[0].levelType === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                (alerts.price || [])[0].levelType === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                'bg-blue-500 hover:bg-blue-600'
                              }`}>{(alerts.price || [])[0].level}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{(alerts.price || [])[0].location} · {(alerts.price || [])[0].time}</p>
                            {(alerts.price || [])[0].description && <p className="text-xs text-muted-foreground mb-2">{(alerts.price || [])[0].description}</p>}
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50">
                              <Brain className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{(alerts.price || [])[0].suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Safety Alert - Show first one only */}
                    {(alerts.safety || [])[0] && (
                      <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-rose-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{(alerts.safety || [])[0].title}</span>
                              <Badge className={`text-xs ${
                                (alerts.safety || [])[0].levelType === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                (alerts.safety || [])[0].levelType === 'warning' ? 'bg-rose-500 hover:bg-rose-600' :
                                (alerts.safety || [])[0].levelType === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                'bg-blue-500 hover:bg-blue-600'
                              }`}>{(alerts.safety || [])[0].level}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{(alerts.safety || [])[0].location} · {(alerts.safety || [])[0].time}</p>
                            {(alerts.safety || [])[0].description && <p className="text-xs text-muted-foreground mb-2">{(alerts.safety || [])[0].description}</p>}
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50">
                              <Brain className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{(alerts.safety || [])[0].suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personalized Suggestions */}
                <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20 dark:to-transparent p-4 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-sm font-semibold">Personalized Suggestions</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(suggestions || []).map((suggestion: any, index: number) => {
                      // Handle both old string format and new {title, description} format
                      const isObject = typeof suggestion === 'object' && suggestion !== null
                      const title = isObject ? suggestion.title : `Tip ${index + 1}`
                      const description = isObject ? suggestion.description : suggestion

                      return (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/60 border hover:bg-background/80 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xs text-white font-semibold">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold mb-1">{title}</p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
              <Button
                className="w-full h-11 font-semibold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20"
                onClick={() => setShowSaveDialog(true)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm & Save Plan
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 font-semibold"
                onClick={() => {
                  setCurrentStep('details')
                  setGeneratedPlan(null)
                  setQuickGenerateData(null)
                  setTripData({
                    destination: '',
                    dateRange: undefined,
                    travelers: 1,
                    travelerNames: [''],
                    travelerGenders: ['']
                  })
                  setPreferences([{
                    travelStyle: 'balanced',
                    crowdTolerance: 'avoid-crowd',
                    preferredSeasons: [],
                    safetyOptions: {
                      avoidLateNight: true,
                      preferWellLit: true,
                      verifiedTransport: true
                    },
                    budgetMin: '',
                    budgetMax: '',
                    notifications: {
                      crowd: true,
                      weather: true,
                      price: true,
                      safety: true
                    }
                  }])
                  setCurrentTravelerIndex(0)
                  setSelectedPlan('Balanced Plan')
                  setSubmitAttempted(false)
                  setTouchedFields(new Set())
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Plan
              </Button>
            </div>

            {/* Save Confirmation Dialog */}
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm p-0 overflow-hidden font-[family-name:var(--font-geist-sans)]">
                <DialogHeader className="sr-only">
                  <DialogTitle>Save Travel Plan</DialogTitle>
                  <DialogDescription>Confirm saving your travel plan and redirect to dashboard</DialogDescription>
                </DialogHeader>
                <div className="p-6 text-center">
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Save this travel plan?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your plan for <span className="font-medium text-foreground">{tripData.destination}</span> will be saved and you will be redirected to the dashboard.
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 mb-6">
                    <MapPinIcon className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-sm font-medium">{tripData.destination}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowSaveDialog(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-rose-500 hover:bg-rose-600"
                      onClick={handleSavePlan}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save & Continue'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Group 5 Label */}
      <GroupLabel group={5} />
    </PageLayout>
  )
}
