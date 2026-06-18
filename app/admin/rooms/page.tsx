"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, Loader2, Sparkles, ChevronRight, X, ShieldAlert, Sparkle, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Room {
  id: string
  number: string
  isClean: boolean
  bookings: { id: string }[]
}

interface RoomType {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string // stringified JSON
  images: string // stringified JSON
  rooms: Room[]
}

export default function AdminRoomsPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [selectedType, setSelectedType] = useState<RoomType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [cleanFilter, setCleanFilter] = useState("all") // all, clean, dirty
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [editingNumber, setEditingNumber] = useState("")
  const [isSavingRoom, setIsSavingRoom] = useState(false)

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  async function fetchRoomTypes() {
    try {
      const res = await fetch("/api/admin/room-types")
      if (res.ok) {
        const data = await res.json()
        setRoomTypes(data.roomTypes || [])
        // Maintain selection or select first
        if (data.roomTypes && data.roomTypes.length > 0) {
          setSelectedType(prev => {
            if (prev) {
              const updated = data.roomTypes.find((r: RoomType) => r.id === prev.id)
              return updated || data.roomTypes[0]
            }
            return data.roomTypes[0]
          })
        }
      }
    } catch {
      toast.error("Ошибка загрузки номеров")
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleCleanliness(room: Room) {
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isClean: !room.isClean })
      })

      if (res.ok) {
        toast.success(`Комната №${room.number} теперь ${!room.isClean ? "готова к заселению" : "требует уборки"}`)
        fetchRoomTypes()
      } else {
        toast.error("Ошибка обновления статуса")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  async function handleSaveRoomNumber(roomId: string) {
    if (!editingNumber.trim()) {
      toast.error("Номер комнаты не может быть пустым")
      return
    }

    setIsSavingRoom(true)
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: editingNumber.trim() })
      })

      if (res.ok) {
        toast.success("Номер комнаты успешно изменен")
        setEditingRoomId(null)
        setEditingNumber("")
        fetchRoomTypes()
      } else {
        const err = await res.json()
        toast.error(err.error || "Ошибка обновления номера")
      }
    } catch {
      toast.error("Ошибка сети")
    } finally {
      setIsSavingRoom(false)
    }
  }

  async function handleDeleteRoom(roomId: string, roomNumber: string) {
    if (!confirm(`Вы действительно хотите удалить комнату №${roomNumber}?`)) return

    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success(`Комната №${roomNumber} успешно удалена`)
        fetchRoomTypes()
      } else {
        const err = await res.json()
        toast.error(err.error || "Невозможно удалить комнату")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  // Filter types and their sub rooms
  const filteredRoomTypes = roomTypes.map(rt => {
    const rooms = rt.rooms.filter(r => {
      const matchesSearch = rt.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.number.includes(searchQuery)
      const matchesClean = 
        cleanFilter === "all" || 
        (cleanFilter === "clean" && r.isClean) || 
        (cleanFilter === "dirty" && !r.isClean)
      return matchesSearch && matchesClean
    })
    return { ...rt, rooms }
  }).filter(rt => rt.rooms.length > 0 || rt.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление фондом</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Номерной фонд отеля</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Редактируйте категории, добавляйте новые комнаты и контролируйте статус уборки.</p>
          </div>
          <Link href="/admin/rooms/new" className="shrink-0">
            <Button className="bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/95 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-300 font-sans tracking-wide">
              <Plus className="mr-2 h-4 w-4" /> Создать категорию
            </Button>
          </Link>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 items-center bg-[#151515] border border-white/5 p-4 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
            <Input
              placeholder="Поиск по категории, номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] text-sm h-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={cleanFilter === "all" ? "default" : "outline"}
              onClick={() => setCleanFilter("all")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                cleanFilter === "all" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Все комнаты
            </Button>
            <Button
              variant={cleanFilter === "clean" ? "default" : "outline"}
              onClick={() => setCleanFilter("clean")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                cleanFilter === "clean" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Готовые
            </Button>
            <Button
              variant={cleanFilter === "dirty" ? "default" : "outline"}
              onClick={() => setCleanFilter("dirty")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                cleanFilter === "dirty" ? "bg-amber-600 text-white hover:bg-amber-700" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Уборка
            </Button>
          </div>
        </div>

        {/* Dynamic Split-Screen Layout */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            
            {/* Left Screen: 60% Width rooms/categories list */}
            <div className={cn(
              "space-y-6 transition-all duration-500",
              selectedType ? "lg:col-span-6" : "lg:col-span-10"
            )}>
              {filteredRoomTypes.map((rt) => (
                <div 
                  key={rt.id} 
                  onClick={() => setSelectedType(rt)}
                  className={cn(
                    "bg-[#151515] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                    selectedType?.id === rt.id 
                      ? "border-[#C5A059] shadow-[0_4px_25px_rgba(197,160,89,0.1)] scale-[1.005]" 
                      : "border-white/5 hover:border-white/10 hover:shadow-lg"
                  )}
                >
                  <div className="p-6 border-b border-white/5 bg-[#181818] flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-serif text-[#FAF9F6] font-medium tracking-wide flex items-center gap-2">
                        {rt.name}
                        <ChevronRight className="h-4 w-4 text-[#C5A059]" />
                      </h3>
                      <p className="text-xs text-[#8C8C8C] mt-1 line-clamp-1 max-w-[400px]">{rt.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/15 text-xs font-semibold px-2.5 py-1">
                        {rt.price.toLocaleString('ru-KZ')} ₸ / ночь
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Table>
                      <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-b border-white/5">
                          <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-3 pl-4 font-semibold">Номер комнаты</TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-3 font-semibold">Вместимость</TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-3 font-semibold">Активных броней</TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-3 font-semibold">Статус уборки</TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-3 pr-4 text-right font-semibold">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rt.rooms.map((room) => (
                          <TableRow 
                            key={room.id} 
                            onClick={(e) => e.stopPropagation()} 
                            className="hover:bg-white/[0.02] border-b border-white/5 transition-colors"
                          >
                            <TableCell className="font-semibold text-[#FAF9F6] pl-4 py-3 text-sm">
                              {editingRoomId === room.id ? (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <Input
                                    value={editingNumber}
                                    onChange={(e) => setEditingNumber(e.target.value)}
                                    className="w-20 bg-[#0E0E0E] border-white/10 text-[#FAF9F6] h-8 text-xs focus:border-[#C5A059]/50"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                                    onClick={() => handleSaveRoomNumber(room.id)}
                                    disabled={isSavingRoom}
                                  >
                                    {isSavingRoom ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-white/5 text-[#8C8C8C] hover:bg-white/5 hover:text-[#FAF9F6] shrink-0"
                                    onClick={() => setEditingRoomId(null)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 group/room">
                                  <span>Комната №{room.number}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover/room:opacity-100 transition-opacity h-6 w-6 p-0 text-[#8C8C8C] hover:text-[#C5A059]"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingRoomId(room.id)
                                      setEditingNumber(room.number)
                                    }}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-sm py-3 text-[#FAF9F6]">
                              {rt.capacity} {rt.capacity > 4 ? "человек" : "чел."}
                            </TableCell>
                            <TableCell className="py-3 text-sm font-medium text-[#FAF9F6]">
                              {room.bookings.length}
                            </TableCell>
                            <TableCell className="py-3">
                              <button 
                                onClick={() => toggleCleanliness(room)}
                                className={cn(
                                  "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full transition-all duration-300 shadow-sm",
                                  room.isClean 
                                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40" 
                                    : "bg-amber-950/40 text-amber-400 border-amber-500/30 hover:bg-amber-900/40"
                                )}
                              >
                                {room.isClean ? "Готов" : "Уборка"}
                              </button>
                            </TableCell>
                            <TableCell className="py-3 pr-4 text-right">
                              {room.bookings.length === 0 ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteRoom(room.id, room.number)}
                                  className="text-[#8C8C8C] hover:text-rose-400 hover:bg-rose-950/20 transition-all duration-300 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <span className="text-[10px] text-[#8C8C8C] tracking-wide italic">Нельзя удалить</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {rt.rooms.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-[#8C8C8C] text-sm">
                              Нет комнат в этой категории
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}

              {filteredRoomTypes.length === 0 && (
                <Card className="bg-[#151515] border-white/5 py-12 text-center">
                  <CardContent>
                    <p className="text-[#8C8C8C] text-sm">Ничего не найдено по вашему запросу.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Screen: 40% Width detail viewer with custom slide-in feel */}
            {selectedType && (
              <div className="lg:col-span-4 sticky top-6 bg-[#151515] border border-[#C5A059]/20 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                <div className="p-5 bg-[#181818] border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C5A059] animate-pulse" />
                    <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">Детальный обзор</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedType(null)}
                    className="hover:bg-white/5 text-[#8C8C8C] hover:text-[#FAF9F6] p-1.5 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Category Name & Price */}
                  <div>
                    <h3 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide">{selectedType.name}</h3>
                    <p className="text-xl text-[#C5A059] font-medium mt-1 font-serif">
                      {selectedType.price.toLocaleString('ru-KZ')} ₸ <span className="text-xs text-[#8C8C8C] uppercase tracking-wider font-sans">/ ночь</span>
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание категории</h4>
                    <p className="text-sm text-[#FAF9F6]/80 leading-relaxed bg-[#0E0E0E] p-4 rounded-lg border border-white/5">
                      {selectedType.description}
                    </p>
                  </div>

                  {/* Room Specs Table */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0E0E0E] border border-white/5 rounded-lg p-3.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C] block">Макс. вместимость</span>
                      <strong className="text-lg text-[#FAF9F6] mt-1 block font-medium">
                        {selectedType.capacity} {selectedType.capacity > 4 ? "гостей" : "гостя"}
                      </strong>
                    </div>
                    <div className="bg-[#0E0E0E] border border-white/5 rounded-lg p-3.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C] block">Всего комнат</span>
                      <strong className="text-lg text-[#FAF9F6] mt-1 block font-medium">
                        {selectedType.rooms.length} номеров
                      </strong>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Удобства номера</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          const list = JSON.parse(selectedType.amenities)
                          return Array.isArray(list) ? list.map((am: string, i: number) => (
                            <Badge key={i} className="bg-[#1C1C1C] text-[#FAF9F6]/90 border border-white/5 px-2.5 py-1 text-xs hover:bg-[#222222]">
                              {am}
                            </Badge>
                          )) : <span className="text-xs text-[#8C8C8C]">Нет удобств</span>
                        } catch {
                          return <span className="text-xs text-[#8C8C8C]">Нет удобств</span>
                        }
                      })()}
                    </div>
                  </div>

                  {/* Large visual preview button or image counts */}
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/15 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block font-semibold">Галерея категории</span>
                      <span className="text-xs text-[#FAF9F6]/70 mt-1 block">
                        Доступно {(() => {
                          try {
                            const imgs = JSON.parse(selectedType.images)
                            return Array.isArray(imgs) ? imgs.length : 0
                          } catch { return 0 }
                        })()} изображений
                      </span>
                    </div>
                    <Sparkle className="h-5 w-5 text-[#C5A059] opacity-60" />
                  </div>

                  {/* Form actions for updating this category */}
                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <Link href={`/admin/rooms/${selectedType.id}/edit`} className="flex-1">
                      <Button className="w-full bg-[#1C1C1C] hover:bg-[#252525] border border-white/5 text-[#FAF9F6] text-xs py-2 font-sans tracking-wide">
                        <Pencil className="mr-2 h-3.5 w-3.5 text-[#C5A059]" /> Изменить категорию
                      </Button>
                    </Link>
                    <Link href={`/admin/rooms/${selectedType.id}/add-room`} className="flex-1">
                      <Button className="w-full bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0E0E0E] text-xs py-2 font-sans tracking-wide">
                        <Plus className="mr-2 h-3.5 w-3.5" /> Добавить комнату
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

