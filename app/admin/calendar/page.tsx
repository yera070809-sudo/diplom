"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, differenceInDays } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Loader2, Calendar, User, DollarSign, Key, Info, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  status: string
  paymentStatus: string
  totalPrice: number
  userId: string
  roomId: string
  user: { name: string | null; email: string; phone?: string | null }
}

interface Room {
  id: string
  number: string
  type: { id: string; name: string; price: number }
  bookings: Booking[]
}

interface GuestUser {
  id: string
  name: string | null
  email: string
  phone: string | null
}

export default function CalendarPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewDays, setViewDays] = useState<14 | 30>(14)
  const [startDate, setStartDate] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  // Active state for modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false)

  // Quick Booking form states
  const [qbRoom, setQbRoom] = useState<Room | null>(null)
  const [qbCheckIn, setQbCheckIn] = useState("")
  const [qbCheckOut, setQbCheckOut] = useState("")
  const [qbSelectedGuestType, setQbSelectedGuestType] = useState<"existing" | "new">("new")
  const [qbGuestId, setQbGuestId] = useState("")
  const [qbGuestName, setQbGuestName] = useState("")
  const [qbGuestEmail, setQbGuestEmail] = useState("")
  const [qbGuestPhone, setQbGuestPhone] = useState("")
  const [qbStatus, setQbStatus] = useState("CONFIRMED")
  const [qbPaymentStatus, setQbPaymentStatus] = useState("UNPAID")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Details Modal edit states
  const [editStatus, setEditStatus] = useState("")
  const [editPaymentStatus, setEditPaymentStatus] = useState("")
  const [editRoomId, setEditRoomId] = useState("")

  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, viewDays - 1)
  })

  // Fetch rooms & bookings
  async function fetchRooms() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/calendar?start=${startDate.toISOString()}&end=${addDays(startDate, viewDays).toISOString()}`)
      if (res.ok) {
        const data = await res.json()
        setRooms(data || [])
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast.error("Ошибка загрузки сетки занятости")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch guest users for dropdown list
  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setGuestUsers(data || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [startDate, viewDays])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Calculate dynamic price based on date inputs in quick booking
  const calculateQbPrice = () => {
    if (!qbRoom || !qbCheckIn || !qbCheckOut) return 0
    const inDate = new Date(qbCheckIn)
    const outDate = new Date(qbCheckOut)
    const nights = differenceInDays(outDate, inDate)
    return nights > 0 ? nights * (qbRoom.type?.price || 0) : 0
  }

  // Open Quick Booking Modal for a specific room and day
  const handleCellClick = (room: Room, day: Date) => {
    // Check if cell is already occupied
    const hasBooking = room.bookings.some(b => {
      const bIn = new Date(b.checkIn)
      const bOut = new Date(b.checkOut)
      return day >= bIn && day < bOut && b.status !== "CANCELLED"
    })
    if (hasBooking) return // Already occupied

    setQbRoom(room)
    setQbCheckIn(format(day, "yyyy-MM-dd"))
    setQbCheckOut(format(addDays(day, 1), "yyyy-MM-dd"))
    setQbGuestName("")
    setQbGuestEmail("")
    setQbGuestPhone("")
    setQbGuestId("")
    setQbSelectedGuestType("new")
    setQbStatus("CONFIRMED")
    setQbPaymentStatus("UNPAID")
    setIsQuickBookingOpen(true)
  }

  // Save quick booking
  const handleQuickBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qbRoom || !qbCheckIn || !qbCheckOut) return

    const checkInDate = new Date(qbCheckIn)
    const checkOutDate = new Date(qbCheckOut)

    if (checkOutDate <= checkInDate) {
      toast.error("Дата выезда должна быть позже даты заезда")
      return
    }

    let finalName = qbGuestName.trim()
    let finalEmail = qbGuestEmail.trim()
    let finalPhone = qbGuestPhone.trim()

    if (qbSelectedGuestType === "existing") {
      const selectedUser = guestUsers.find(u => u.id === qbGuestId)
      if (!selectedUser) {
        toast.error("Пожалуйста, выберите гостя")
        return
      }
      finalName = selectedUser.name || ""
      finalEmail = selectedUser.email
      finalPhone = selectedUser.phone || ""
    } else {
      if (!finalName || !finalPhone || !finalEmail) {
        toast.error("Пожалуйста, заполните все данные нового гостя")
        return
      }
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: qbRoom.id,
          guestEmail: finalEmail,
          guestName: finalName,
          guestPhone: finalPhone,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          totalPrice: calculateQbPrice(),
          status: qbStatus,
          paymentStatus: qbPaymentStatus
        })
      })

      if (res.ok) {
        toast.success("Бронирование успешно создано")
        setIsQuickBookingOpen(false)
        fetchRooms()
        fetchUsers() // Refresh users list
      } else {
        const errData = await res.json()
        toast.error(errData.error || "Ошибка создания бронирования")
      }
    } catch {
      toast.error("Ошибка сети при отправке бронирования")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open booking details modal
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditStatus(booking.status)
    setEditPaymentStatus(booking.paymentStatus)
    setEditRoomId(booking.roomId)
    setIsDetailModalOpen(true)
  }

  // Update existing booking details (status, room relocation, payment)
  const handleUpdateBooking = async () => {
    if (!selectedBooking) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          paymentStatus: editPaymentStatus,
          roomId: editRoomId !== selectedBooking.roomId ? editRoomId : undefined
        })
      })

      if (res.ok) {
        toast.success("Бронирование успешно обновлено")
        setIsDetailModalOpen(false)
        fetchRooms()
      } else {
        const errData = await res.json()
        toast.error(errData.error || "Ошибка сохранения изменений")
      }
    } catch {
      toast.error("Ошибка сети")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Find other rooms conflict-free for the active booking dates (Room Relocation options)
  const getRelocationRooms = () => {
    if (!selectedBooking) return []
    const bIn = new Date(selectedBooking.checkIn)
    const bOut = new Date(selectedBooking.checkOut)

    return rooms.filter(room => {
      // Find overlap with any OTHER booking in this room
      const hasConflict = room.bookings.some(b => {
        if (b.id === selectedBooking.id) return false // Ignore itself
        if (b.status === "CANCELLED") return false
        const currentIn = new Date(b.checkIn)
        const currentOut = new Date(b.checkOut)
        return (bIn < currentOut && bOut > currentIn)
      })
      return !hasConflict
    })
  }

  // Pre-calculate positioning metrics for booking spans
  const getBookingRenderProps = (booking: Booking) => {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const startRange = startDate
    const endRange = addDays(startDate, viewDays)

    // Overlap checks
    if (checkOut <= startRange || checkIn >= endRange) {
      return null // Outside visible calendar
    }

    // Clip to range limits
    const visibleStart = checkIn < startRange ? startRange : checkIn
    const visibleEnd = checkOut > endRange ? endRange : checkOut

    const startOffsetDays = differenceInDays(visibleStart, startRange)
    const durationDays = differenceInDays(visibleEnd, visibleStart)

    if (durationDays <= 0) return null

    const leftPercent = (startOffsetDays / viewDays) * 100
    const widthPercent = (durationDays / viewDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      isClippedStart: checkIn < startRange,
      isClippedEnd: checkOut > endRange,
    }
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-bold">Мониторинг Загрузки</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Календарь Занятости (Шахматка)</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Интерактивный таймлайн Almaty Grand Hotel. Управляйте заездами, переселяйте гостей и создавайте брони на лету.</p>
          </div>

          {/* View Days range toggles */}
          <div className="flex gap-2 bg-[#151515] border border-white/5 p-1 rounded-xl shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewDays(14)}
              className={cn(
                "text-xs px-4 h-9 font-sans transition-all rounded-lg",
                viewDays === 14 ? "bg-[#C5A059] text-[#0E0E0E] font-semibold hover:bg-[#C5A059]" : "text-[#8C8C8C] hover:text-[#FAF9F6] hover:bg-[#1A1A1A]"
              )}
            >
              14 Дней
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewDays(30)}
              className={cn(
                "text-xs px-4 h-9 font-sans transition-all rounded-lg",
                viewDays === 30 ? "bg-[#C5A059] text-[#0E0E0E] font-semibold hover:bg-[#C5A059]" : "text-[#8C8C8C] hover:text-[#FAF9F6] hover:bg-[#1A1A1A]"
              )}
            >
              30 Дней
            </Button>
          </div>
        </div>

        {/* Calendar Nav & Grid Card */}
        <Card className="bg-[#151515] border border-white/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="p-6 border-b border-white/5 bg-[#181818] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-full font-bold">
                {viewDays === 14 ? "Двухнедельный интервал" : "Месячный обзор"}
              </span>
            </div>
            
            {/* Nav controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setStartDate(d => addDays(d, viewDays === 14 ? -14 : -30))}
                className="bg-[#0E0E0E] border-white/5 hover:bg-[#1C1C1C] h-9 w-9 text-[#FAF9F6] rounded-lg transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-xs font-semibold tracking-wider uppercase min-w-[240px] text-center bg-[#0E0E0E] border border-white/5 py-2.5 px-4 rounded-lg text-[#FAF9F6] font-mono">
                {format(startDate, "d MMMM", { locale: ru })} — {format(addDays(startDate, viewDays - 1), "d MMMM yyyy", { locale: ru })}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setStartDate(d => addDays(d, viewDays === 14 ? 14 : 30))}
                className="bg-[#0E0E0E] border-white/5 hover:bg-[#1C1C1C] h-9 w-9 text-[#FAF9F6] rounded-lg transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-36">
                <Loader2 className="h-10 w-10 animate-spin text-[#C5A059]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#0E0E0E]/40">
                      <th className="p-4 bg-[#181818] text-xs font-semibold text-[#8C8C8C] uppercase tracking-wider text-left sticky left-0 min-w-[200px] z-20 border-r border-white/5 shadow-[3px_0_10px_rgba(0,0,0,0.3)]">
                        Номер & Категория
                      </th>
                      {days.map((day) => {
                        const isToday = isSameDay(day, new Date())
                        return (
                          <th
                            key={day.toISOString()}
                            className={cn(
                              "p-3 text-center min-w-[50px] md:min-w-[70px] border-r border-white/5 text-[#FAF9F6] transition-all font-mono",
                              isToday && "bg-[#C5A059]/10 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A059]"
                            )}
                          >
                            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C]">
                              {format(day, "EE", { locale: ru })}
                            </div>
                            <div className={cn("font-bold text-sm mt-0.5", isToday && "text-[#C5A059]")}>
                              {format(day, "d")}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors h-20">
                        {/* Sticky left room badge */}
                        <td className="p-4 bg-[#181818] sticky left-0 z-20 border-r border-white/5 shadow-[3px_0_10px_rgba(0,0,0,0.3)] min-w-[200px]">
                          <div className="font-bold text-sm text-[#FAF9F6]">Комната №{room.number}</div>
                          <div className="text-[10px] text-[#C5A059] uppercase tracking-wider mt-1 font-semibold truncate max-w-[170px]" title={room.type.name}>
                            {room.type.name}
                          </div>
                        </td>

                        {/* Interactive Gantt Chessboard area */}
                        <td colSpan={viewDays} className="relative p-0 border-r border-white/5">
                          
                          {/* 1. Underlying columns with hover & quick booking click listeners */}
                          <div className="absolute inset-0 grid h-full w-full" style={{ gridTemplateColumns: `repeat(${viewDays}, 1fr)` }}>
                            {days.map((day) => {
                              const isToday = isSameDay(day, new Date())
                              return (
                                <div
                                  key={day.toISOString()}
                                  onClick={() => handleCellClick(room, day)}
                                  className={cn(
                                    "border-r border-white/5 h-full cursor-pointer hover:bg-[#C5A059]/5 transition-colors relative group",
                                    isToday && "bg-[#C5A059]/[0.02]"
                                  )}
                                  title={`Кликните, чтобы забронировать Комнату №${room.number} на ${format(day, "dd.MM.yyyy")}`}
                                >
                                  {/* Tiny plus icon appearing on hover to suggest quick booking */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-xs text-[#C5A059] font-bold bg-[#C5A059]/10 px-1.5 py-0.5 rounded">+</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* 2. Absolute booking bars positioned on top of the grid columns */}
                          {room.bookings
                            .filter(b => b.status !== "CANCELLED")
                            .map((booking) => {
                              const renderProps = getBookingRenderProps(booking)
                              if (!renderProps) return null

                              const isConfirmed = booking.status === "CONFIRMED"
                              const isPending = booking.status === "PENDING"
                              const isCompleted = booking.status === "COMPLETED"

                              return (
                                <div
                                  key={booking.id}
                                  onClick={() => handleBookingClick(booking)}
                                  style={{
                                    left: renderProps.left,
                                    width: renderProps.width,
                                  }}
                                  className={cn(
                                    "absolute h-12 top-4 flex items-center justify-between px-3.5 text-[11px] rounded-xl shadow-lg border cursor-pointer select-none font-sans font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 group",
                                    isConfirmed && "bg-emerald-950/70 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_4px_12px_rgba(16,185,129,0.08)]",
                                    isPending && "bg-amber-950/70 border-amber-500/30 text-amber-300 hover:bg-amber-900/80 shadow-[0_4px_12px_rgba(245,158,11,0.08)]",
                                    isCompleted && "bg-blue-950/70 border-blue-500/30 text-blue-300 hover:bg-blue-900/80 shadow-[0_4px_12px_rgba(59,130,246,0.08)]",
                                    renderProps.isClippedStart && "rounded-l-none border-l-dashed border-l-2",
                                    renderProps.isClippedEnd && "rounded-r-none border-r-dashed border-r-2"
                                  )}
                                  title={`${booking.user.name || "Гость"} (${format(new Date(booking.checkIn), "dd.MM")} - ${format(new Date(booking.checkOut), "dd.MM")})`}
                                >
                                  {/* Guest Initials or name */}
                                  <span className="truncate max-w-[85%] font-semibold tracking-wide flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                    {booking.user.name || "Гость отеля"}
                                  </span>

                                  {/* Small helper tags or icons */}
                                  <span className="text-[9px] uppercase opacity-60 font-bold shrink-0 bg-black/20 px-1.5 py-0.5 rounded ml-1.5">
                                    {booking.totalPrice.toLocaleString("ru-KZ")} ₸
                                  </span>
                                </div>
                              )
                            })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Elegant Legend Grid */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 border-t border-white/5 bg-[#181818]/50 text-xs font-sans tracking-wide">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-950/70 border border-emerald-500/30"></div>
                  <span className="text-[#8C8C8C]">Подтверждено (`CONFIRMED`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-amber-950/70 border border-amber-500/30"></div>
                  <span className="text-[#8C8C8C]">Ожидает подтверждения (`PENDING`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-blue-950/70 border border-blue-500/30"></div>
                  <span className="text-[#8C8C8C]">Гость выехал (`COMPLETED`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#C5A059]/10 border border-[#C5A059]/40"></div>
                  <span className="text-[#8C8C8C]">Текущий день</span>
                </div>
              </div>

              <div className="text-[#8C8C8C] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Кликните на свободное поле для быстрого бронирования, или на бронь для её изменения.</span>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* ====================================================== */}
      {/* MODAL 1: BOOKING DETAILS & ROOM RELOCATION WORKSPACE    */}
      {/* ====================================================== */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="bg-[#151515] border border-white/10 text-[#FAF9F6] max-w-lg rounded-2xl shadow-2xl p-6">
          <DialogHeader className="border-b border-white/5 pb-4">
            <DialogTitle className="text-xl font-serif text-[#FAF9F6] font-medium tracking-wide flex items-center gap-2.5">
              <Key className="w-5 h-5 text-[#C5A059]" />
              <span>Панель Бронирования</span>
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6 pt-4 text-sm font-sans">
              
              {/* Guest Profile Summary Card */}
              <div className="bg-[#0E0E0E] border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>Профиль Гостя</span>
                </div>
                <h4 className="text-base font-bold text-[#FAF9F6]">
                  {selectedBooking.user.name || "Гость отеля"}
                </h4>
                <p className="text-xs text-[#8C8C8C]">{selectedBooking.user.email}</p>
                {selectedBooking.user.phone && (
                  <p className="text-xs text-[#8C8C8C]">Тел: {selectedBooking.user.phone}</p>
                )}
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Дата Заезда</span>
                  <div className="flex items-center gap-2 text-[#FAF9F6] font-mono bg-[#0E0E0E] p-2.5 rounded-lg border border-white/5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{format(new Date(selectedBooking.checkIn), "dd.MM.yyyy")}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Дата Выезда</span>
                  <div className="flex items-center gap-2 text-[#FAF9F6] font-mono bg-[#0E0E0E] p-2.5 rounded-lg border border-white/5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{format(new Date(selectedBooking.checkOut), "dd.MM.yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Status selectors & pricing */}
              <div className="grid grid-cols-2 gap-4">
                {/* Booking status select */}
                <div className="space-y-2">
                  <label className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Статус брони</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs">
                      <SelectItem value="PENDING">Ожидает (`PENDING`)</SelectItem>
                      <SelectItem value="CONFIRMED">Подтвержден (`CONFIRMED`)</SelectItem>
                      <SelectItem value="COMPLETED">Гость выехал (`COMPLETED`)</SelectItem>
                      <SelectItem value="CANCELLED">Отменено (`CANCELLED`)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment status select */}
                <div className="space-y-2">
                  <label className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Оплата</label>
                  <Select value={editPaymentStatus} onValueChange={setEditPaymentStatus}>
                    <SelectTrigger className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs">
                      <SelectItem value="UNPAID">Не оплачено (`UNPAID`)</SelectItem>
                      <SelectItem value="PAID">Оплачено (`PAID`)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Relocation workspace (Change Room ID) */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Переселение гостя (Комната)</label>
                  <span className="text-[10px] text-[#C5A059] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded-full">Умная проверка конфликтов</span>
                </div>
                <Select value={editRoomId} onValueChange={setEditRoomId}>
                  <SelectTrigger className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs max-h-56">
                    {getRelocationRooms().map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        Комната №{room.number} — {room.type?.name || "—"} ({(room.type?.price || 0).toLocaleString("ru-KZ")} ₸/ночь)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-[#8C8C8C] mt-1 leading-relaxed">
                  Показываются только доступные номера без конфликтующих бронирований на выбранные даты проживания гостя.
                </p>
              </div>

              {/* Pricing banner */}
              <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-300 font-semibold tracking-wide uppercase">Стоимость проживания</span>
                <span className="text-base font-bold text-[#C5A059] font-mono">
                  {selectedBooking.totalPrice.toLocaleString("ru-KZ")} ₸
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-white/5 pt-4 mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C] text-xs h-10"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleUpdateBooking}
              className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-zinc-950 font-bold text-xs h-10 px-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================================================== */}
      {/* MODAL 2: QUICK BOOKING DIRECTLY FROM GANTT CELLS        */}
      {/* ====================================================== */}
      <Dialog open={isQuickBookingOpen} onOpenChange={setIsQuickBookingOpen}>
        <DialogContent className="bg-[#151515] border border-white/10 text-[#FAF9F6] max-w-lg rounded-2xl shadow-2xl p-6">
          <DialogHeader className="border-b border-white/5 pb-4">
            <DialogTitle className="text-xl font-serif text-[#FAF9F6] font-medium tracking-wide flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <span>Быстрое Бронирование</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleQuickBookingSubmit} className="space-y-5 pt-4 text-xs font-sans">
            {/* Auto selected room info banner */}
            {qbRoom && (
              <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#FAF9F6] text-sm">Комната №{qbRoom.number}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{qbRoom.type.name}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#C5A059] font-mono text-sm">
                    {(qbRoom.type?.price || 0).toLocaleString("ru-KZ")} ₸
                  </span>
                  <p className="text-[9px] text-gray-400 mt-0.5">за ночь</p>
                </div>
              </div>
            )}

            {/* Check-In / Check-Out dates pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold">Дата Заезда</label>
                <Input
                  type="date"
                  value={qbCheckIn}
                  onChange={(e) => setQbCheckIn(e.target.value)}
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs text-center"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold">Дата Выезда</label>
                <Input
                  type="date"
                  value={qbCheckOut}
                  onChange={(e) => setQbCheckOut(e.target.value)}
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs text-center"
                  required
                />
              </div>
            </div>

            {/* Existing user vs New user switcher tabs */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold">Выбор Гостя</label>
              
              <div className="flex bg-[#0E0E0E] border border-white/5 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQbSelectedGuestType("new")}
                  className={cn(
                    "flex-1 text-center py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all",
                    qbSelectedGuestType === "new" ? "bg-[#C5A059] text-zinc-950" : "text-[#8C8C8C] hover:text-[#FAF9F6]"
                  )}
                >
                  Новый Гость
                </button>
                <button
                  type="button"
                  onClick={() => setQbSelectedGuestType("existing")}
                  className={cn(
                    "flex-1 text-center py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all",
                    qbSelectedGuestType === "existing" ? "bg-[#C5A059] text-zinc-950" : "text-[#8C8C8C] hover:text-[#FAF9F6]"
                  )}
                >
                  Зарегистрированный Гость
                </button>
              </div>
            </div>

            {/* Guest form fields */}
            {qbSelectedGuestType === "new" ? (
              <div className="space-y-3.5 bg-[#0E0E0E] border border-white/5 p-4 rounded-xl">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#8C8C8C] uppercase tracking-wider">ФИО Гостя</label>
                  <Input
                    placeholder="Иван Петров"
                    value={qbGuestName}
                    onChange={(e) => setQbGuestName(e.target.value)}
                    className="bg-[#151515] border-white/5 text-[#FAF9F6] h-10 text-xs"
                    required={qbSelectedGuestType === "new"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#8C8C8C] uppercase tracking-wider">Email</label>
                    <Input
                      type="email"
                      placeholder="guest@mail.ru"
                      value={qbGuestEmail}
                      onChange={(e) => setQbGuestEmail(e.target.value)}
                      className="bg-[#151515] border-white/5 text-[#FAF9F6] h-10 text-xs"
                      required={qbSelectedGuestType === "new"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#8C8C8C] uppercase tracking-wider">Телефон</label>
                    <Input
                      placeholder="+7 777 123 45 67"
                      value={qbGuestPhone}
                      onChange={(e) => setQbGuestPhone(e.target.value)}
                      className="bg-[#151515] border-white/5 text-[#FAF9F6] h-10 text-xs"
                      required={qbSelectedGuestType === "new"}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0E0E0E] border border-white/5 p-4 rounded-xl space-y-2">
                <label className="text-[9px] text-[#8C8C8C] uppercase tracking-wider block">Выберите гостя по Email</label>
                <Select value={qbGuestId} onValueChange={setQbGuestId}>
                  <SelectTrigger className="bg-[#151515] border-white/5 text-[#FAF9F6] h-10 text-xs">
                    <SelectValue placeholder="Искать гостя..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs max-h-48">
                    {guestUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || "Без имени"} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold">Статус брони</label>
                <Select value={qbStatus} onValueChange={setQbStatus}>
                  <SelectTrigger className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs">
                    <SelectItem value="PENDING">Ожидает (`PENDING`)</SelectItem>
                    <SelectItem value="CONFIRMED">Подтверждено (`CONFIRMED`)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold">Статус Оплаты</label>
                <Select value={qbPaymentStatus} onValueChange={setQbPaymentStatus}>
                  <SelectTrigger className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/10 text-[#FAF9F6] text-xs">
                    <SelectItem value="UNPAID">Не оплачено (`UNPAID`)</SelectItem>
                    <SelectItem value="PAID">Оплачено (`PAID`)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calculated price summary box */}
            <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 p-4 rounded-xl flex items-center justify-between">
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Итоговая стоимость</span>
              <span className="text-base font-bold text-[#C5A059] font-mono">
                {calculateQbPrice().toLocaleString("ru-KZ")} ₸
              </span>
            </div>

            <DialogFooter className="border-t border-white/5 pt-4 mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickBookingOpen(false)}
                className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C] text-xs h-10"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-zinc-950 font-bold text-xs h-10 px-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Создать бронь"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
