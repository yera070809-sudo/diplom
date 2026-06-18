"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, User, Info, Sparkles, MessageSquare, Clock, Bed, Maximize, Eye, Coffee, Check, FileText, Quote } from "lucide-react"

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null };
}

interface RoomDetailsTabsProps {
  description: string;
  amenities: string[];
  reviews: Review[];
  extraDetails: {
    area: string;
    bed: string;
    view: string;
    breakfast: string;
    capacityText: string;
    features: string[];
  };
  policies?: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    childrenPolicy: string;
    petsPolicy: string;
  };
}

export function RoomDetailsTabs({ description, amenities, reviews, extraDetails, policies }: RoomDetailsTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"info" | "amenities" | "reviews" | "policies">("info")

  const tabs = [
    { id: "info", label: "О номере", icon: Info },
    { id: "amenities", label: "Удобства", icon: Sparkles },
    { id: "reviews", label: `Отзывы (${reviews.length})`, icon: MessageSquare },
    { id: "policies", label: "Правила", icon: Clock },
  ] as const

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const getInitials = (name: string | null) => {
    if (!name) return "G"
    const parts = name.split(" ")
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-8 w-full">
      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-lg flex-1 justify-center focus:outline-none ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#C5A059]" : "text-gray-400"}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "info" && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <p className="text-gray-600 leading-relaxed text-[15px] font-light">
                    {description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Maximize, label: "Площадь", value: extraDetails.area },
                    { icon: Bed, label: "Спальные места", value: extraDetails.bed },
                    { icon: Eye, label: "Вид из окон", value: extraDetails.view },
                    { icon: Coffee, label: "Питание", value: extraDetails.breakfast },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                      <div className="w-9 h-9 rounded-lg bg-[#C5A059]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <spec.icon className="h-4 w-4 text-[#C5A059]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-0.5">{spec.label}</p>
                        <p className="text-sm font-medium text-gray-900 leading-snug">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Premium Features */}
                <div>
                  <h4 className="text-lg font-serif text-gray-900 mb-4">Особенности номера</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {extraDetails.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <div className="w-5 h-5 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/[0.02] transition-all duration-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                      <span className="text-sm text-gray-700 leading-none">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating summary */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center">
                      <Star className="w-7 h-7 text-[#C5A059] fill-current" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-serif font-medium text-gray-900">{avgRating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">/ 5</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        На основе {reviews.length} {reviews.length === 1 ? "отзыва" : reviews.length < 5 ? "отзывов" : "отзывов"}
                      </p>
                    </div>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Для этого номера пока нет отзывов.</p>
                    <p className="text-gray-400 text-xs mt-1">Вы можете стать первым после проживания!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-5 rounded-xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 transition-colors duration-300 relative group"
                      >
                        {/* Decorative quote */}
                        <div className="absolute top-4 right-5 text-gray-100 group-hover:text-[#C5A059]/10 transition-colors pointer-events-none">
                          <Quote className="w-8 h-8 fill-current" />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating
                                ? 'fill-[#C5A059] text-[#C5A059]'
                                : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        {review.comment && (
                          <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        )}

                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/15 flex items-center justify-center text-[#C5A059] font-bold text-[10px] tracking-wider shrink-0">
                            {getInitials(review.user.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {review.user.name || "Гость"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "policies" && (
              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "Заезд и выезд",
                    content: (
                      <>
                        Заезд: <span className="font-semibold text-gray-900">{policies?.checkInTime || "с 14:00"}</span>
                        {" · "}
                        Выезд: <span className="font-semibold text-gray-900">{policies?.checkOutTime || "до 12:00"}</span>
                      </>
                    ),
                  },
                  {
                    icon: FileText,
                    title: "Условия отмены",
                    content: policies?.cancellationPolicy || "Бесплатная отмена бронирования возможна более чем за 24 часа до заезда.",
                  },
                  {
                    icon: User,
                    title: "Размещение детей",
                    content: policies?.childrenPolicy || "Дети любого возраста допускаются.",
                  },
                  {
                    icon: Sparkles,
                    title: "Дополнительные правила",
                    content: policies?.petsPolicy || "Курение в номерах строго запрещено.",
                  },
                ].map((policy, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-gray-50/60 border border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-[#C5A059]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <policy.icon className="h-4 w-4 text-[#C5A059]" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">{policy.title}</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">{policy.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
