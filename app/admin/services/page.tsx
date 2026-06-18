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
import { Plus, Pencil, Trash2, Check, X, Search, Loader2, Sparkles, ChevronRight, Sparkle, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  isActive: boolean
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // all, active, inactive

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const res = await fetch("/api/admin/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data || [])
        if (data && data.length > 0) {
          setSelectedService(prev => {
            if (prev) {
              const updated = data.find((s: Service) => s.id === prev.id)
              return updated || data[0]
            }
            return data[0]
          })
        }
      }
    } catch {
      toast.error("Ошибка загрузки услуг")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleService(service: Service) {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: service.name,
          price: service.price,
          description: service.description,
          isActive: !service.isActive 
        })
      })

      if (res.ok) {
        toast.success(`Услуга "${service.name}" ${!service.isActive ? "активирована" : "деактивирована"}`)
        fetchServices()
      } else {
        toast.error("Ошибка изменения статуса")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  async function handleDeleteService(service: Service) {
    if (!confirm(`Вы действительно хотите удалить услугу "${service.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success(`Услуга "${service.name}" удалена`)
        setSelectedService(null)
        fetchServices()
      } else {
        toast.error("Ошибка удаления услуги")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && service.isActive) || 
      (statusFilter === "inactive" && !service.isActive)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление каталогом</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Дополнительные услуги</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Настраивайте спа, трансферы, экскурсии и другие сервисы отеля.</p>
          </div>
          <Link href="/admin/services/new" className="shrink-0">
            <Button className="bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/95 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-300 font-sans tracking-wide">
              <Plus className="mr-2 h-4 w-4" /> Добавить услугу
            </Button>
          </Link>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 items-center bg-[#151515] border border-white/5 p-4 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
            <Input
              placeholder="Поиск по названию, описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] text-sm h-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                statusFilter === "all" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Все услуги
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => setStatusFilter("active")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                statusFilter === "active" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Активные
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => setStatusFilter("inactive")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                statusFilter === "inactive" ? "bg-amber-600 text-white hover:bg-amber-700" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Неактивные
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
            
            {/* Left Screen: 60% Width services list */}
            <div className={cn(
              "space-y-6 transition-all duration-500",
              selectedService ? "lg:col-span-6" : "lg:col-span-10"
            )}>
              <div className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <Table>
                  <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                    <TableRow className="hover:bg-transparent border-b border-white/5">
                      <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">Название услуги</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Стоимость</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Статус</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow 
                        key={service.id} 
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          "hover:bg-white/[0.02] border-b border-white/5 transition-colors cursor-pointer",
                          selectedService?.id === service.id ? "bg-white/[0.03] border-l-2 border-l-[#C5A059]" : ""
                        )}
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="font-semibold text-[#FAF9F6] text-sm flex items-center gap-2">
                            {service.name}
                            {selectedService?.id === service.id && <ChevronRight className="h-3.5 w-3.5 text-[#C5A059]" />}
                          </div>
                          {service.description && (
                            <div className="text-xs text-[#8C8C8C] max-w-sm truncate mt-0.5">{service.description}</div>
                          )}
                        </TableCell>
                        <TableCell className="py-4 font-medium text-[#FAF9F6] text-sm">
                          {service.price.toLocaleString('ru-KZ')} ₸
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={cn(
                              "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full transition-all duration-300 shadow-sm",
                              service.isActive 
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                                : "bg-neutral-900 text-[#8C8C8C] border-neutral-800"
                            )}
                          >
                            {service.isActive ? "Активна" : "Неактивна"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end items-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0 border-white/5",
                                service.isActive ? "hover:bg-amber-950/30 hover:text-amber-400" : "hover:bg-emerald-950/30 hover:text-emerald-400"
                              )}
                              onClick={() => handleToggleService(service)}
                              title={service.isActive ? "Деактивировать" : "Активировать"}
                            >
                              {service.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                            
                            <Link href={`/admin/services/${service.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/5 hover:text-[#FAF9F6]">
                                <Pencil className="h-4 w-4 text-[#C5A059]" />
                              </Button>
                            </Link>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-[#8C8C8C] hover:text-rose-400 hover:bg-rose-950/20"
                              onClick={() => handleDeleteService(service)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredServices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-16 text-[#8C8C8C] text-sm">
                          Услуги не найдены
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Right Screen: 40% Width detail viewer */}
            {selectedService && (
              <div className="lg:col-span-4 sticky top-6 bg-[#151515] border border-[#C5A059]/20 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                <div className="p-5 bg-[#181818] border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C5A059] animate-pulse" />
                    <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">Обзор услуги</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedService(null)}
                    className="hover:bg-white/5 text-[#8C8C8C] hover:text-[#FAF9F6] p-1.5 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Service Name & Price */}
                  <div>
                    <h3 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide">{selectedService.name}</h3>
                    <p className="text-xl text-[#C5A059] font-medium mt-1 font-serif">
                      {selectedService.price.toLocaleString('ru-KZ')} ₸
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between bg-[#0E0E0E] border border-white/5 p-4 rounded-lg">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C] block font-semibold">Текущий статус</span>
                      <span className="text-xs text-[#FAF9F6]/70 mt-1 block">
                        {selectedService.isActive ? "Доступна гостям при бронировании" : "Временно отключена администратором"}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full shadow-sm",
                        selectedService.isActive 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                          : "bg-neutral-900 text-[#8C8C8C] border-neutral-800"
                      )}
                    >
                      {selectedService.isActive ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание услуги</h4>
                    <p className="text-sm text-[#FAF9F6]/80 leading-relaxed bg-[#0E0E0E] p-4 rounded-lg border border-white/5 min-h-[80px]">
                      {selectedService.description || "Описание для данной услуги не добавлено. Вы можете заполнить его при редактировании."}
                    </p>
                  </div>

                  {/* Graphic layout placeholder to make it look premium */}
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/15 rounded-lg p-4 flex gap-3 items-center">
                    <div className="p-2 bg-[#C5A059]/10 rounded-lg">
                      <Settings2 className="h-5 w-5 text-[#C5A059]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block font-semibold">Автоматическое начисление</span>
                      <span className="text-xs text-[#FAF9F6]/60 block mt-0.5">Суммируется к чеку номера при выборе гостем.</span>
                    </div>
                  </div>

                  {/* Form actions for updating this service */}
                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <Button 
                      onClick={() => handleToggleService(selectedService)}
                      className={cn(
                        "flex-1 text-xs py-2 font-sans tracking-wide border border-white/5",
                        selectedService.isActive 
                          ? "bg-amber-900/20 hover:bg-amber-900/30 text-amber-400" 
                          : "bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400"
                      )}
                    >
                      {selectedService.isActive ? "Деактивировать" : "Активировать"}
                    </Button>
                    
                    <Link href={`/admin/services/${selectedService.id}/edit`} className="flex-1">
                      <Button className="w-full bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0E0E0E] text-xs py-2 font-sans tracking-wide">
                        <Pencil className="mr-2 h-3.5 w-3.5" /> Редактировать
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

