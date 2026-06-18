"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  roomTypeId: string
  roomTypeName?: string
  variant?: "icon" | "button"
  className?: string
}

export function FavoriteButton({ 
  roomTypeId, 
  roomTypeName,
  variant = "icon",
  className 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites()
  
  const isFav = isFavorite(roomTypeId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(roomTypeId)
    
    if (isFav) {
      toast.info("Удалено из избранного")
    } else {
      toast.success(`${roomTypeName || "Номер"} добавлен в избранное`)
    }
  }

  if (!isLoaded) {
    return variant === "icon" ? (
      <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)} disabled>
        <Heart className="h-5 w-5" />
      </Button>
    ) : (
      <Button variant="outline" className={className} disabled>
        <Heart className="h-4 w-4 mr-2" />
        В избранное
      </Button>
    )
  }

  if (variant === "icon") {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-9 w-9", className)}
        onClick={handleClick}
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-colors",
            isFav ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
          )} 
        />
      </Button>
    )
  }

  return (
    <Button 
      variant={isFav ? "default" : "outline"}
      className={className}
      onClick={handleClick}
    >
      <Heart 
        className={cn(
          "h-4 w-4 mr-2",
          isFav && "fill-current"
        )} 
      />
      {isFav ? "В избранном" : "В избранное"}
    </Button>
  )
}
