"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, TrendingUp, DollarSign, CalendarDays, Star, Download, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stats {
  totalRevenue: number
  bookingsCount: number
  averageBookingValue: number
  occupancyRate: number
  avgRating: number
  reviewsCount: number
  topRoomTypes: { name: string; count: number; revenue: number }[]
  revenueByDay: { date: string; revenue: number }[]
  bookingsByStatus: { status: string; count: number }[]
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/admin/reports?days=${period}`)
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [period])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Header and period selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Финансовая аналитика</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Отчёты и статистика</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Детальный обзор прибыльности, загрузки номерного фонда и удовлетворенности гостей.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a href="/api/admin/export?type=bookings" download className="flex-1 md:flex-initial">
              <Button variant="outline" size="sm" className="w-full text-xs border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0E0E0E] text-[#C5A059] transition-all duration-300 font-sans tracking-wide py-1.5 h-10">
                <Download className="h-4 w-4 mr-2" />
                Экспорт броней
              </Button>
            </a>
            
            <a href="/api/admin/export?type=guests" download className="flex-1 md:flex-initial">
              <Button variant="outline" size="sm" className="w-full text-xs border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0E0E0E] text-[#C5A059] transition-all duration-300 font-sans tracking-wide py-1.5 h-10">
                <Download className="h-4 w-4 mr-2" />
                Экспорт гостей
              </Button>
            </a>
            
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full md:w-[190px] bg-[#151515] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/5 text-[#FAF9F6]">
                <SelectItem value="7" className="hover:bg-[#1A1A1A]">Последние 7 дней</SelectItem>
                <SelectItem value="30" className="hover:bg-[#1A1A1A]">Последние 30 дней</SelectItem>
                <SelectItem value="90" className="hover:bg-[#1A1A1A]">Последние 90 дней</SelectItem>
                <SelectItem value="365" className="hover:bg-[#1A1A1A]">За год</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Общая выручка</span>
              <DollarSign className="h-4 w-4 text-[#C5A059]" />
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {stats?.totalRevenue.toLocaleString('ru-KZ')} ₸
              </div>
              <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] mt-1 font-medium">За выбранный период</p>
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Всего броней</span>
              <CalendarDays className="h-4 w-4 text-[#C5A059]" />
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {stats?.bookingsCount}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] mt-1 font-medium">
                Средний чек: <strong className="text-[#C5A059] font-medium">{stats?.averageBookingValue.toLocaleString('ru-KZ')} ₸</strong>
              </p>
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Загрузка номеров</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-emerald-400 font-semibold tracking-wide">
                {stats?.occupancyRate.toFixed(1)}%
              </div>
              <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] mt-1 font-medium">Средняя заполненность фонда</p>
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Рейтинг отеля</span>
              <Star className="h-4 w-4 text-[#C5A059]" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide flex items-center gap-1.5">
                  {stats?.avgRating.toFixed(1)}
                  <Star className="h-5 w-5 fill-[#C5A059] text-[#C5A059] inline" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] mt-1 font-medium">{stats?.reviewsCount} отзывов от гостей</p>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Room Types */}
          <div className="bg-[#151515] border border-white/5 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-[#181818]">
              <h3 className="text-base font-serif text-[#FAF9F6] font-medium tracking-wide">Популярные категории</h3>
            </div>
            <div className="p-6 space-y-5">
              {stats?.topRoomTypes.map((rt, i) => (
                <div key={i} className="flex items-center justify-between hover:bg-white/[0.02] p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center text-xs font-bold font-mono">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#FAF9F6]">{rt.name}</p>
                      <p className="text-xs text-[#8C8C8C] mt-0.5">{rt.count} успешных бронирований</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-[#FAF9F6]">{rt.revenue.toLocaleString('ru-KZ')} ₸</p>
                </div>
              ))}
              {(!stats?.topRoomTypes || stats.topRoomTypes.length === 0) && (
                <div className="text-center py-8 text-xs text-[#8C8C8C]">Нет данных по категориям</div>
              )}
            </div>
          </div>

          {/* Bookings by Status */}
          <div className="bg-[#151515] border border-white/5 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-[#181818]">
              <h3 className="text-base font-serif text-[#FAF9F6] font-medium tracking-wide">Статусы бронирований</h3>
            </div>
            <div className="p-6 space-y-6">
              {stats?.bookingsByStatus.map((item) => {
                const statusLabels: Record<string, { label: string; color: string; barColor: string }> = {
                  PENDING: { label: "Ожидает", color: "text-amber-400", barColor: "bg-amber-500" },
                  CONFIRMED: { label: "Подтверждено", color: "text-emerald-400", barColor: "bg-emerald-500" },
                  COMPLETED: { label: "Завершено", color: "text-blue-400", barColor: "bg-blue-500" },
                  CANCELLED: { label: "Отменено", color: "text-rose-400", barColor: "bg-rose-500" },
                }
                const { label, color, barColor } = statusLabels[item.status] || { label: item.status, color: "text-gray-400", barColor: "bg-gray-500" }
                const total = stats.bookingsByStatus.reduce((sum, s) => sum + s.count, 0)
                const percentage = total > 0 ? (item.count / total) * 100 : 0

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold tracking-wide uppercase">
                      <span className={color}>{label}</span>
                      <span className="text-[#FAF9F6]">{item.count} броней ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-[#0E0E0E] rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", barColor)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {(!stats?.bookingsByStatus || stats.bookingsByStatus.length === 0) && (
                <div className="text-center py-8 text-xs text-[#8C8C8C]">Нет данных по статусам</div>
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-[#151515] border border-white/5 rounded-xl shadow-lg overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-white/5 bg-[#181818] flex items-center justify-between">
              <h3 className="text-base font-serif text-[#FAF9F6] font-medium tracking-wide">Динамика выручки по дням</h3>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-[#C5A059] animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C]">Последние 30 точек</span>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end gap-1.5 bg-[#0E0E0E]/40 border border-white/5 rounded-xl p-4 overflow-hidden">
                {stats?.revenueByDay.slice(-30).map((day, i) => {
                  const maxRevenue = Math.max(...(stats?.revenueByDay.map(d => d.revenue) || [1]))
                  const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0

                  return (
                    <div
                      key={i}
                      className="flex-1 bg-[#C5A059]/40 hover:bg-[#C5A059] border border-[#C5A059]/25 rounded-t transition-all duration-300 relative group cursor-pointer"
                      style={{ height: `${Math.max(height, 3)}%` }}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1A1A1A] border border-white/10 text-white text-[10px] py-1.5 px-2.5 rounded shadow-2xl whitespace-nowrap z-30 font-sans tracking-wide">
                        <span className="text-[#8C8C8C] block text-[8px] uppercase tracking-widest mb-0.5">
                          {format(new Date(day.date), "d MMMM", { locale: ru })}
                        </span>
                        <strong className="text-[#C5A059]">{day.revenue.toLocaleString('ru-KZ')} ₸</strong>
                      </div>
                    </div>
                  )
                })}
                {(!stats?.revenueByDay || stats.revenueByDay.length === 0) && (
                  <div className="w-full text-center py-20 text-xs text-[#8C8C8C]">Нет данных о доходах</div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

