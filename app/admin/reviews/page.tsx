"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Loader2, Sparkles, Star, Trash2, CalendarDays, Home } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string | null; email: string }
  booking: {
    room: {
      number: string
      type: { name: string }
    }
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all") // all, 5, 4, 3, 2, 1

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews")
      if (res.ok) {
        const data = await res.json()
        setReviews(data || [])
      }
    } catch {
      toast.error("Ошибка загрузки отзывов")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm("Вы действительно хотите удалить этот отзыв? Это действие необратимо.")) return

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success("Отзыв успешно удален")
        fetchReviews()
      } else {
        toast.error("Ошибка удаления отзыва")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const authorMatch = review.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const emailMatch = review.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const commentMatch = review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const roomMatch = review.booking.room.number.includes(searchQuery)
    const matchesSearch = authorMatch || emailMatch || commentMatch || roomMatch

    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesRating
  })

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Модерация контента</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Отзывы Гостей</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Отслеживайте мнения гостей о проживании, модерируйте спам и контролируйте репутацию отеля.</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 items-center bg-[#151515] border border-white/5 p-4 rounded-xl shadow-md">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
            <Input
              placeholder="Поиск по отзывам, автору, комнате..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] text-sm h-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={ratingFilter === "all" ? "default" : "outline"}
              onClick={() => setRatingFilter("all")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                ratingFilter === "all" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Все оценки
            </Button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <Button
                key={stars}
                variant={ratingFilter === stars.toString() ? "default" : "outline"}
                onClick={() => setRatingFilter(stars.toString())}
                className={cn(
                  "text-xs transition-all h-9 px-3 flex items-center gap-1",
                  ratingFilter === stars.toString() ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
                )}
              >
                <span>{stars}</span>
                <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </div>

        {/* Reviews Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
          </div>
        ) : (
          <div className="bg-[#151515] border border-white/5 rounded-xl shadow-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">Автор</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Номер</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Оценка</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold max-w-md">Комментарий</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Дата публикации</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="font-semibold text-[#FAF9F6] text-sm">
                        {review.user.name || "Гость отеля"}
                      </div>
                      <div className="text-xs text-[#8C8C8C] mt-0.5">{review.user.email}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#FAF9F6]">
                        <Home className="h-3.5 w-3.5 text-[#C5A059]" />
                        <span>№{review.booking.room.number}</span>
                      </div>
                      <div className="text-[10px] text-[#8C8C8C] truncate mt-0.5 max-w-[150px]">{review.booking.room.type.name}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-3.5 w-3.5",
                              i < review.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-white/10"
                            )}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#FAF9F6]/85 max-w-md leading-relaxed">
                      {review.comment || <span className="text-xs text-[#8C8C8C] italic">Без текстового комментария</span>}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#8C8C8C]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-[#8C8C8C] hover:text-rose-400 hover:bg-rose-950/20 p-2 transition-all duration-300 rounded"
                        title="Удалить отзыв"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredReviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-[#8C8C8C] text-sm">
                      Отзывы гостей не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
