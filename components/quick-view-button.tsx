"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RoomQuickView } from "@/components/room-quick-view"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomData {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
  images: string
  avgRating?: number
  reviewCount?: number
}

interface QuickViewButtonProps {
  room: RoomData
  variant?: "icon" | "button"
  className?: string
}

export function QuickViewButton({ room, variant = "icon", className }: QuickViewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
          }}
          className={cn(
            "p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors",
            className
          )}
          title="Быстрый просмотр"
        >
          <Eye className="h-5 w-5" />
        </button>
        <RoomQuickView room={room} open={isOpen} onOpenChange={setIsOpen} />
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        className={cn("gap-2", className)}
      >
        <Eye className="h-4 w-4" />
        Быстрый просмотр
      </Button>
      <RoomQuickView room={room} open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
