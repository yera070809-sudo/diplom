"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import { GitCompareArrows, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompareBar() {
  const { compareIds, count, clearCompare, isLoaded } = useCompare()

  if (!isLoaded || count === 0) {
    return null
  }

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl",
      "px-8 py-4 flex items-center gap-6",
      "animate-in slide-in-from-bottom-4 duration-500",
      "border-2 border-blue-400/30",
      "hover:shadow-blue-500/50 transition-all",
      "shadow-[0_20px_60px_rgba(37,99,235,0.5)]",
      // Добавляем bounce анимацию
      "animate-bounce-once"
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full animate-pulse">
          <GitCompareArrows className="h-6 w-6" />
        </div>
        <div>
          <div className="font-bold text-lg">{count} {count === 1 ? 'номер' : count < 5 ? 'номера' : 'номеров'}</div>
          <div className="text-xs text-blue-100">для сравнения</div>
        </div>
      </div>

      <Link href={`/compare?ids=${compareIds.join(",")}`}>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
        >
          Сравнить сейчас
        </Button>
      </Link>

      <button
        onClick={clearCompare}
        className="p-2 hover:bg-white/20 rounded-full transition-colors"
        title="Очистить всё"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
