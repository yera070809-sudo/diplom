"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date | string
  user: { name: string | null }
  booking: {
    room: {
      type: { name: string }
    }
  }
}

const DEFAULT_REVIEWS = [
  {
    id: "default-1",
    rating: 5,
    comment: "Потрясающий отель! Сервис на высшем уровне, панорамные виды на горы Алатау просто завораживают. Завтраки от шефа превзошли все ожидания. Обязательно вернемся снова!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: { name: "Александр Ковалев" },
    booking: { room: { type: { name: "VIP Ambassador Suite" } } }
  },
  {
    id: "default-2",
    rating: 5,
    comment: "Отдыхали в номере Mountain View. Просыпаться с видом на заснеженные вершины — это незабываемо. В номере идеальная тишина, великолепная звукоизоляция и шикарная косметика.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: { name: "Мадина Смагулова" },
    booking: { room: { type: { name: "Mountain View Deluxe" } } }
  },
  {
    id: "default-3",
    rating: 4,
    comment: "Великолепный фитнес-центр и спа-зона. Очень приветливый и отзывчивый персонал на ресепшене, готовый помочь по любому вопросу. Отличная шумоизоляция в номерах.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    user: { name: "Дмитрий Пак" },
    booking: { room: { type: { name: "Skyline Superior" } } }
  },
  {
    id: "default-4",
    rating: 5,
    comment: "Almaty Grand Hotel стал для нас настоящим открытием. Абсолютный комфорт, современный дизайн в стиле тихой роскоши и безупречная чистота. Локация очень удобная.",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    user: { name: "Екатерина Миронова" },
    booking: { room: { type: { name: "Executive Suite" } } }
  }
]

export function ReviewsSection({ dbReviews }: { dbReviews: Review[] }) {
  const reviews = dbReviews.length > 0 ? dbReviews : DEFAULT_REVIEWS
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  const nextReview = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  const prevReview = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(nextReview, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, nextReview])

  const getInitials = (name: string | null) => {
    if (!name) return "G"
    const parts = name.split(" ")
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  // Get 3 visible reviews (wrapping around)
  const getVisibleReviews = () => {
    const visible = []
    for (let i = 0; i < Math.min(3, reviews.length); i++) {
      visible.push(reviews[(currentIndex + i) % reviews.length])
    }
    return visible
  }

  return (
    <section className="py-28 bg-[#0E0E0E] relative overflow-hidden">
      {/* Decorative light flares */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C5A059]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-premium max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-5"
            >
              Отзывы гостей
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight"
            >
              Что говорят <span className="italic text-[#C5A059]">гости</span>
            </motion.h2>
          </div>

          {/* Overall Rating & Navigation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            {/* Score */}
            <div className="flex items-center gap-4 pr-6 border-r border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                <Star className="w-7 h-7 text-[#C5A059] fill-current" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-medium text-white">{avgRating.toFixed(1)}</span>
                  <span className="text-white/30 text-sm">/ 5</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">
                  {reviews.length} отзывов
                </p>
              </div>
            </div>

            {/* Nav Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => { prevReview(); setIsAutoPlaying(false) }}
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#C5A059]/50 hover:bg-[#C5A059]/10 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => { nextReview(); setIsAutoPlaying(false) }}
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#C5A059]/50 hover:bg-[#C5A059]/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisibleReviews().map((review, idx) => (
            <motion.div
              key={`${review.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-8 border border-white/[0.06] relative group hover:bg-white/[0.06] hover:border-[#C5A059]/10 transition-all duration-500"
            >
              {/* Decorative Quote */}
              <div className="absolute top-6 right-8 text-white/[0.04] group-hover:text-[#C5A059]/[0.08] transition-colors duration-500 pointer-events-none">
                <Quote className="w-14 h-14 fill-current" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-[#C5A059] text-[#C5A059]"
                        : "fill-white/10 text-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/70 text-[15px] leading-relaxed font-light mb-8 line-clamp-4">
                &ldquo;{review.comment || "Замечательное проживание, всё очень понравилось!"}&rdquo;
              </p>

              {/* Author + Room */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold text-xs tracking-wider shrink-0">
                    {getInitials(review.user.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">
                      {review.user.name || "Гость отеля"}
                    </h4>
                    <p className="text-[11px] text-white/30 font-medium mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-[#C5A059]/60 uppercase bg-[#C5A059]/5 px-2.5 py-1 rounded-full truncate max-w-[120px]">
                  {review.booking.room.type.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-1.5 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false) }}
              className={`h-[2px] rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "w-8 bg-[#C5A059]"
                  : "w-3 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
