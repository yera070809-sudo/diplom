"use client"

import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import { GitCompareArrows, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CompareButtonProps {
  roomTypeId: string
  roomTypeName: string
  variant?: "icon" | "button"
  className?: string
}

export function CompareButton({
  roomTypeId,
  roomTypeName,
  variant = "icon",
  className
}: CompareButtonProps) {
  const { isInCompare, toggleCompare, count, maxCompare, isLoaded } = useCompare()

  if (!isLoaded) {
    return null
  }

  const inCompare = isInCompare(roomTypeId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inCompare) {
      toggleCompare(roomTypeId)
      toast.info(`${roomTypeName} убран из сравнения`)
    } else {
      if (count >= maxCompare) {
        toast.error(`Максимум ${maxCompare} номера для сравнения`)
        return
      }
      toggleCompare(roomTypeId)
      toast.success(`${roomTypeName} добавлен к сравнению`, {
        description: count === 0 ? 'Панель сравнения появится внизу экрана' : undefined
      })
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-2 rounded-full transition-colors",
          inCompare
            ? "bg-blue-500 text-white"
            : "bg-white/80 hover:bg-white text-gray-700",
          className
        )}
        title={inCompare ? "Убрать из сравнения" : "Сравнить"}
      >
        {inCompare ? (
          <Check className="h-5 w-5" />
        ) : (
          <GitCompareArrows className="h-5 w-5" />
        )}
      </button>
    )
  }

  return (
    <Button
      variant={inCompare ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      {inCompare ? (
        <>
          <Check className="h-4 w-4" />
          В сравнении
        </>
      ) : (
        <>
          <GitCompareArrows className="h-4 w-4" />
          Сравнить
        </>
      )}
    </Button>
  )
}
