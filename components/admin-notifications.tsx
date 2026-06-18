"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import Link from "next/link"

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  totalPrice: number
  createdAt: string
  user: { name: string | null; email: string }
  room: { type: { name: string } }
}

interface NotificationsData {
  bookings: Booking[]
  pendingCount: number
  timestamp: string
}

const POLL_INTERVAL = 30000 // 30 секунд

export function AdminNotifications() {
  const [data, setData] = useState<NotificationsData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const dataRef = useRef<NotificationsData | null>(null)
  const lastCheckedRef = useRef<string | null>(null)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    lastCheckedRef.current = lastChecked
  }, [lastChecked])

  const fetchNotifications = useCallback(async () => {
    try {
      const url = lastCheckedRef.current
        ? `/api/admin/notifications?since=${lastCheckedRef.current}`
        : "/api/admin/notifications"

      const res = await fetch(url)
      if (res.ok) {
        const newData = await res.json()

        if (dataRef.current && newData.bookings.length > 0 && lastCheckedRef.current) {
          setHasNew(true)
          // Play notification sound
          try {
            const audio = new Audio("/notification.mp3")
            audio.volume = 0.5
            audio.play().catch(() => { })
          } catch { }
        }

        setData(newData)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }, [])

  useEffect(() => {
    setTimeout(fetchNotifications, 0)
    const interval = setInterval(fetchNotifications, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setHasNew(false)
      setLastChecked(new Date().toISOString())
    }
  }

  const pendingCount = data?.pendingCount || 0

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {(pendingCount > 0 || hasNew) && (
            <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center text-white ${hasNew ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}>
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 border-b">
          <h3 className="font-semibold">Уведомления</h3>
          <p className="text-xs text-gray-500">
            {pendingCount} бронирований ожидают подтверждения
          </p>
        </div>

        {data?.bookings && data.bookings.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {data.bookings.map((booking) => (
              <DropdownMenuItem key={booking.id} asChild>
                <Link
                  href={`/admin/bookings`}
                  className="flex flex-col items-start p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    {booking.user.name || booking.user.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.room.type.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(booking.checkIn), "d MMM", { locale: ru })} — {format(new Date(booking.checkOut), "d MMM", { locale: ru })}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {booking.totalPrice.toLocaleString("ru-KZ")} ₸
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            Нет новых уведомлений
          </div>
        )}

        <div className="p-2 border-t">
          <Link href="/admin/bookings">
            <Button variant="ghost" size="sm" className="w-full">
              Все бронирования
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
