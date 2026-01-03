"use client"

import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Users } from "lucide-react"

function InputWrapper({
    icon,
    placeholder,
    width,
}: {
    icon: React.ReactNode
    placeholder: string
    width: string
}) {
    return (
        <div className={`relative ${width}`}>
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {icon}
            </div>
            <Input
                placeholder={placeholder}
                className="pl-10 bg-white border-slate-300"
            />
        </div>
    )
}

export function SearchBar() {
    return (
        <Input
            placeholder="🔍 Search your destination..."
            className="w-60"
        />
    )
}

export function SearchDestination() {
    return (
        <InputWrapper
            icon={<MapPin className="h-4 w-4" />}
            placeholder="Where are you travelling to?"
            width="w-60"
        />
    )
}

export function DatePicker() {
    return (
        <InputWrapper
            icon={<Calendar className="h-4 w-4" />}
            placeholder="Pick a date"
            width="w-40"
        />
    )
}

export function PaxInsert() {
    return (
        <InputWrapper
            icon={<Users className="h-4 w-4" />}
            placeholder="Pax"
            width="w-24"
        />
    )
}