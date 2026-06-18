"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Star, Shield, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop",
    subtitle: "Панорамный вид на Заилийский Алатау",
  },
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop",
    subtitle: "Роскошные номера с дизайнерским интерьером",
  },
  {
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3540&auto=format&fit=crop",
    subtitle: "Безупречный сервис мирового уровня",
  },
]

const stats = [
  { value: "15+", label: "Лет опыта" },
  { value: "27", label: "Номеров" },
  { value: "4.8", label: "Рейтинг" },
  { value: "99%", label: "Довольных гостей" },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Animated Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Decorative Corner Lines */}
      <div className="absolute top-8 left-8 z-10 hidden lg:block">
        <div className="w-24 h-[1px] bg-[#C5A059]/40" />
        <div className="w-[1px] h-24 bg-[#C5A059]/40" />
      </div>
      <div className="absolute top-8 right-8 z-10 hidden lg:block">
        <div className="w-24 h-[1px] bg-[#C5A059]/40 ml-auto" />
        <div className="w-[1px] h-24 bg-[#C5A059]/40 ml-auto" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container-premium max-w-7xl mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white/90">
              <span className="flex items-center gap-1.5 text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="w-[1px] h-4 bg-white/20" />
              <span className="text-xs font-medium tracking-wider uppercase">Пятизвёздочный отель</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-serif font-normal text-white tracking-tight leading-[0.95] mb-6"
          >
            <span className="block">Almaty</span>
            <span className="block text-[#C5A059] italic font-light">Grand Hotel</span>
          </motion.h1>

          {/* Dynamic Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 font-light"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center gap-2 mb-10 text-white/50"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs tracking-[0.15em] uppercase font-medium">Алматы, Казахстан · ул. Достык, 85</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/rooms">
              <Button size="lg" className="btn-gold h-14 px-10 text-base rounded-full group">
                Забронировать номер
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base rounded-full bg-white/[0.06] border border-white/[0.15] text-white hover:bg-white/[0.12] hover:text-white backdrop-blur-sm transition-all"
              >
                Узнать больше
              </Button>
            </Link>
          </motion.div>

          {/* Slide Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-2 mb-12"
          >
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-[2px] rounded-full transition-all duration-500 ${
                  i === currentSlide
                    ? "w-10 bg-[#C5A059]"
                    : "w-5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-serif text-white font-medium tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/30 flex flex-col items-center gap-2"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  )
}
