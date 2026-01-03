"use client"

import { Button } from "@/components/ui/button"
import { LocateFixed } from "lucide-react"

export function GPSFinder() {
    return (
        <Button variant="outline">
            <LocateFixed className="w-4 h-4" />
        </Button>
    )
}
