"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

interface RoomType {
  id: string
  name: string
  description: string
  price: number
  images: string
  amenities: string
  capacity: number
  area?: string | null
  view?: string | null
  rooms: {
    bookings: {
      review: {
        rating: number
      } | null
    }[]
  }[]
}

export function RoomShowcase({ rooms }: { rooms: RoomType[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  // Show top 4 rooms sorted by price (premium rooms first)
  const featuredRooms = [...rooms].sort((a, b) => b.price - a.price).slice(0, 4)
  const activeRoom = featuredRooms[activeIdx]

  if (!activeRoom) return null

  const images = JSON.parse(activeRoom.images)
  const amenities = JSON.parse(activeRoom.amenities)
  const allReviews = activeRoom.rooms
    ?.flatMap(rm => rm.bookings?.map(b => b.review).filter(Boolean) || []) || []
  const reviewsCount = allReviews.length
  const avgRating = reviewsCount > 0
    ? allReviews.reduce((sum, r) => sum + (r?.rating || 0), 0) / reviewsCount
    : 5.0

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="container-premium max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-5"
            >
              Наши номера
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 tracking-tight mb-4"
            >
              Избранные <span className="italic text-[#C5A059]">номера</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-16 h-[1px] bg-[#C5A059] origin-left"
            />
          </div>
          <Link href="/rooms" className="hidden lg:block">
            <Button variant="ghost" className="text-base group text-gray-600 hover:text-gray-900">
              Все номера <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Interactive Room Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Large Image Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[0]}
                    alt={activeRoom.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    <span className="text-white font-semibold text-sm">{avgRating.toFixed(1)}</span>
                    <span className="text-white/50 text-xs">({reviewsCount} отзывов)</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white font-medium">{activeRoom.name}</h3>
                </div>
                <Link href={`/rooms/${activeRoom.id}`}>
                  <Button className="bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black rounded-full px-6 transition-all duration-300">
                    Подробнее
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setActiveIdx((activeIdx - 1 + featuredRooms.length) % featuredRooms.length)}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIdx((activeIdx + 1) % featuredRooms.length)}
                className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Right Panel: Details + Thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            {/* Room Details Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Users className="w-4 h-4" />
                    <span>до {activeRoom.capacity} гостей</span>
                  </div>
                  {activeRoom.area && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Maximize2 className="w-4 h-4" />
                      <span>{activeRoom.area}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-base leading-relaxed mb-6 font-light line-clamp-3">
                  {activeRoom.description}
                </p>

                {/* Top Amenities */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {amenities.slice(0, 4).map((am: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif font-medium text-gray-900 tracking-tight">
                    {activeRoom.price.toLocaleString('ru-KZ')} ₸
                  </span>
                  <span className="text-gray-400 text-sm font-light">/ ночь</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnails Selector */}
            <div className="grid grid-cols-4 gap-3">
              {featuredRooms.map((room, i) => {
                const thumbImages = JSON.parse(room.images)
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveIdx(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      i === activeIdx
                        ? "ring-2 ring-[#C5A059] ring-offset-2 scale-[1.02]"
                        : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                    }`}
                  >
                    <Image
                      src={thumbImages[0]}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center lg:hidden">
          <Link href="/rooms">
            <Button size="lg" className="w-full btn-gold rounded-full">
              Смотреть все номера
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
