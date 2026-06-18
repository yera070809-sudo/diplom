"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  totalPrice: number
  status: string
  createdAt: string
  user: { name: string | null; email: string }
  room: { number: string; type: { name: string } }
}

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
  all: "Все статусы"
}

const ITEMS_PER_PAGE = 10

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchBookings()
  }, [])

  // Фильтрация бронирований
  useEffect(() => {
    let result = [...bookings]

    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.user.name?.toLowerCase().includes(query) ||
        b.user.email.toLowerCase().includes(query) ||
        b.room.number.includes(query) ||
        b.id.toLowerCase().includes(query)
      )
    }

    setFilteredBookings(result)
    setCurrentPage(1)
  }, [bookings, statusFilter, searchQuery])

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/bookings")
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch {
      toast.error("Ошибка загрузки бронирований")
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(bookingId: string, status: string) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        toast.success(`Статус обновлён: ${statusLabels[status]}`)
        fetchBookings()
      } else {
        toast.error("Ошибка обновления статуса")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Header section */}
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление клиентами</span>
          <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Бронирования номеров</h2>
          <p className="text-[#8C8C8C] text-sm mt-1">Просматривайте, подтверждайте и управляйте визитами гостей.</p>
        </div>

        <Card className="bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <CardHeader className="p-6 border-b border-white/5 bg-[#181818]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg font-serif font-medium tracking-wide text-[#FAF9F6]">
                Все бронирования ({filteredBookings.length})
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
                  <Input
                    placeholder="Поиск по гостю, номеру..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full md:w-[260px] bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] h-10 text-sm"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/5 text-[#FAF9F6]">
                    <SelectItem value="all" className="hover:bg-[#1A1A1A]">Все статусы</SelectItem>
                    <SelectItem value="PENDING" className="hover:bg-[#1A1A1A]">Ожидает</SelectItem>
                    <SelectItem value="CONFIRMED" className="hover:bg-[#1A1A1A]">Подтверждено</SelectItem>
                    <SelectItem value="COMPLETED" className="hover:bg-[#1A1A1A]">Завершено</SelectItem>
                    <SelectItem value="CANCELLED" className="hover:bg-[#1A1A1A]">Отменено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                      <TableRow className="hover:bg-transparent border-b border-white/5">
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">ID</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Гость</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Номер</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Даты проживания</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Сумма</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Статус</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Создано</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                          <TableCell className="font-mono text-xs text-[#8C8C8C] pl-6 py-4">
                            #{booking.id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-medium text-[#FAF9F6] text-sm">{booking.user.name || "—"}</div>
                            <div className="text-xs text-[#8C8C8C] mt-0.5">{booking.user.email}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm font-medium text-[#FAF9F6]">{booking.room.type.name}</div>
                            <div className="text-xs text-[#C5A059] mt-0.5 font-medium">№{booking.room.number}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm text-[#FAF9F6]">
                              {format(new Date(booking.checkIn), 'dd MMM', { locale: ru })} — {format(new Date(booking.checkOut), 'dd MMM yyyy', { locale: ru })}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-semibold text-[#FAF9F6] text-sm">
                            {booking.totalPrice.toLocaleString('ru-KZ')} ₸
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={cn(
                                "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full transition-all duration-300 shadow-sm",
                                booking.status === 'CONFIRMED' && "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
                                booking.status === 'CANCELLED' && "bg-rose-950/40 text-rose-400 border-rose-500/30",
                                booking.status === 'COMPLETED' && "bg-blue-950/40 text-blue-400 border-blue-500/30",
                                booking.status === 'PENDING' && "bg-amber-950/40 text-amber-400 border-amber-500/30"
                              )}
                            >
                              {statusLabels[booking.status] || booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-xs text-[#8C8C8C]">
                            {format(new Date(booking.createdAt), 'dd.MM.yy HH:mm', { locale: ru })}
                          </TableCell>
                          <TableCell className="py-4 pr-6 text-right">
                            <div className="flex gap-2 justify-end">
                              {booking.status === 'PENDING' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0E0E0E] text-[#C5A059] transition-all duration-300 font-sans tracking-wide py-1.5"
                                  onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                >
                                  Подтвердить
                                </Button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0E0E0E] text-[#C5A059] transition-all duration-300 font-sans tracking-wide py-1.5"
                                  onClick={() => updateStatus(booking.id, 'COMPLETED')}
                                >
                                  Выезд
                                </Button>
                              )}
                              {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-300 font-sans tracking-wide py-1.5"
                                  onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                >
                                  Отмена
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-16 text-[#8C8C8C]">
                            {searchQuery || statusFilter !== "all"
                              ? "Бронирования не найдены"
                              : "Бронирований пока нет"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-6 border-t border-white/5 bg-[#181818]/50">
                    <p className="text-xs text-[#8C8C8C]">
                      Показано <strong className="text-[#FAF9F6] font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> — <strong className="text-[#FAF9F6] font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}</strong> из <strong className="text-[#FAF9F6] font-medium">{filteredBookings.length}</strong>
                    </p>
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A] h-8 w-8 p-0"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0 text-xs font-medium transition-all duration-300",
                            currentPage === page 
                              ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 shadow-[0_0_8px_rgba(197,160,89,0.3)]" 
                              : "bg-[#0E0E0E] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A]"
                          )}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A] h-8 w-8 p-0"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

