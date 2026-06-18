"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Users } from "lucide-react"

interface RoomType {
  id: string
  name: string
  description: string | null
  price: number
  capacity: number
  amenities: string | string[]
  images: string | string[]
  rooms: { id: string }[]
}

interface SimilarRoomsProps {
  rooms: RoomType[]
}

export function SimilarRooms({ rooms }: SimilarRoomsProps) {
  if (rooms.length === 0) return null

  return (
    <section>
      {/* Section Header */}
      <div className="mb-10">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-bold block mb-4">
          Другие номера
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight">
          Вам также <span className="italic text-[#C5A059]">понравится</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((type, index) => {
          const images = typeof type.images === 'string'
            ? JSON.parse(type.images)
            : type.images
          const amenities = typeof type.amenities === 'string'
            ? JSON.parse(type.amenities)
            : type.amenities

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/rooms/${type.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C5A059]/20 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={images[0]}
                      alt={type.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif text-gray-900 tracking-tight mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
                      {type.name}
                    </h3>

                    <p className="text-gray-500 text-sm font-light line-clamp-2 mb-4 leading-relaxed">
                      {type.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-medium">
                        <Users className="w-3 h-3" />
                        до {type.capacity}
                      </span>
                      {amenities.slice(0, 2).map((am: string) => (
                        <span key={am} className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-medium">
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Bottom: Price + Arrow */}
                    <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xl font-serif font-medium text-gray-900">
                          {type.price.toLocaleString('ru-KZ')} ₸
                        </span>
                        <span className="text-gray-400 text-xs font-light ml-1">/ ночь</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] group-hover:gap-2.5 transition-all duration-300">
                        Подробнее
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
