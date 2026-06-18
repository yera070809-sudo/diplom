"use client"

import { motion } from "framer-motion"
import { Utensils, Waves, Dumbbell, Car, Sparkles, Wine } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "Высокая Кухня",
    description: "Авторские блюда от нашего шеф-повара в панорамном ресторане на 27-м этаже с видом на город и горы.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    accent: "#C5A059"
  },
  {
    icon: Waves,
    title: "Спа & Велнесс",
    description: "Эксклюзивный спа-комплекс с хаммамом, сауной и 25-метровым крытым бассейном на верхнем этаже.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    accent: "#7BA8A8"
  },
  {
    icon: Dumbbell,
    title: "Фитнес 24/7",
    description: "Современный фитнес-центр с панорамными окнами, зоной для йоги и персональными тренерами.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    accent: "#8B7355"
  },
  {
    icon: Car,
    title: "VIP Трансфер",
    description: "Премиальный трансфер на автомобилях Mercedes V-Class из аэропорта прямо к дверям отеля.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    accent: "#4A4A4A"
  },
  {
    icon: Wine,
    title: "Лаундж-Бар",
    description: "Коктейль-бар с коллекционными винами и живой джазовой музыкой по вечерам пятницы и субботы.",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800",
    accent: "#8B4C70"
  },
  {
    icon: Sparkles,
    title: "Консьерж-Сервис",
    description: "Персональный консьерж поможет организовать экскурсии, мероприятия и любые специальные запросы.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800",
    accent: "#C5A059"
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-28 bg-[#FAF9F6] relative overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container-premium max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-5"
          >
            Привилегии отеля
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-5 tracking-tight"
          >
            Исключительный <span className="italic text-[#C5A059]">сервис</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-xl mx-auto font-light"
          >
            Каждая деталь в Almaty Grand Hotel создана для вашего абсолютного комфорта и незабываемых впечатлений.
          </motion.p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${idx === 0 ? 'lg:row-span-2 h-72 md:h-auto' : 'h-72'
                }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${feature.image})` }}
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-95 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#C5A059]/20 group-hover:border-[#C5A059]/30 transition-all duration-500">
                  <feature.icon className="w-5 h-5 text-white group-hover:text-[#C5A059] transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-serif font-medium text-white mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 line-clamp-3">
                  {feature.description}
                </p>
              </div>

              {/* Hover Border Accent */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#C5A059]/20 rounded-2xl transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
