"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SlidersHorizontal, Users, ArrowUpDown } from "lucide-react"

interface RoomsHeroSectionProps {
  guestFilter?: string
  totalRooms?: number
}

export function RoomsHeroSection({ guestFilter, totalRooms }: RoomsHeroSectionProps) {
  return (
    <section className="relative h-[50vh] min-h-[380px] max-h-[480px] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3540&auto=format&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
      </div>

      {/* Decorative Corner Lines */}
      <div className="absolute top-8 left-8 z-20 hidden lg:block">
        <div className="w-16 h-[1px] bg-[#C5A059]/30" />
        <div className="w-[1px] h-16 bg-[#C5A059]/30" />
      </div>
      <div className="absolute top-8 right-8 z-20 hidden lg:block">
        <div className="w-16 h-[1px] bg-[#C5A059]/30 ml-auto" />
        <div className="w-[1px] h-16 bg-[#C5A059]/30 ml-auto" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full pb-12">
        <div className="container-premium max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-4">
              Коллекция номеров
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.05] mb-4">
              Номера <span className="italic text-[#C5A059]">&</span> Люксы
            </h1>
            <p className="text-base md:text-lg text-white/50 max-w-xl font-light leading-relaxed">
              Откройте для себя пространство, где безупречный дизайн встречается с абсолютным комфортом.
            </p>

            {guestFilter && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-sm font-medium"
              >
                <Users className="w-3.5 h-3.5" />
                Номера для {guestFilter} {Number(guestFilter) === 1 ? 'гостя' : 'гостей'}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAF9F6] to-transparent z-20" />
    </section>
  )
}
