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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Loader2, Sparkles, UserCheck, Trash2, Mail, Phone, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  createdAt: string
  bookings: { id: string }[]
}

const roleLabels: Record<string, string> = {
  ADMIN: "Администратор",
  STAFF: "Сотрудник",
  GUEST: "Гость"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all") // all, ADMIN, STAFF, GUEST

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data || [])
      }
    } catch {
      toast.error("Ошибка загрузки пользователей")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      })

      if (res.ok) {
        toast.success("Роль успешно обновлена")
        fetchUsers()
      } else {
        const err = await res.json()
        toast.error(err.error || "Ошибка обновления роли")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  async function handleDeleteUser(userId: string, name: string) {
    if (!confirm(`Вы действительно хотите удалить пользователя "${name || 'Без имени'}"?`)) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success("Пользователь успешно удален")
        fetchUsers()
      } else {
        const err = await res.json()
        toast.error(err.error || "Ошибка удаления")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const nameMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const phoneMatch = user.phone?.includes(searchQuery) || false
    const matchesSearch = nameMatch || emailMatch || phoneMatch

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление учетными записями</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Пользователи и Персонал</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Управляйте правами доступа, изменяйте роли и просматривайте активность гостей отеля.</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 items-center bg-[#151515] border border-white/5 p-4 rounded-xl shadow-md">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
            <Input
              placeholder="Поиск по имени, email, телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] text-sm h-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={roleFilter === "all" ? "default" : "outline"}
              onClick={() => setRoleFilter("all")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                roleFilter === "all" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Все пользователи
            </Button>
            <Button
              variant={roleFilter === "ADMIN" ? "default" : "outline"}
              onClick={() => setRoleFilter("ADMIN")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                roleFilter === "ADMIN" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Администраторы
            </Button>
            <Button
              variant={roleFilter === "STAFF" ? "default" : "outline"}
              onClick={() => setRoleFilter("STAFF")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                roleFilter === "STAFF" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Сотрудники
            </Button>
            <Button
              variant={roleFilter === "GUEST" ? "default" : "outline"}
              onClick={() => setRoleFilter("GUEST")}
              className={cn(
                "text-xs transition-all h-9 px-4",
                roleFilter === "GUEST" ? "bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]" : "border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
              )}
            >
              Гости
            </Button>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
          </div>
        ) : (
          <div className="bg-[#151515] border border-white/5 rounded-xl shadow-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">Имя</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Контакты</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Роль доступа</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Бронирования</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Дата регистрации</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="font-semibold text-[#FAF9F6] text-sm flex items-center gap-2">
                        {user.name || "Без имени"}
                        {user.role === "ADMIN" && <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />}
                      </div>
                      <div className="text-[10px] text-[#8C8C8C] font-mono mt-0.5">#{user.id}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#FAF9F6]/85">
                        <Mail className="h-3.5 w-3.5 text-[#C5A059]" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-[#8C8C8C] mt-1">
                          <Phone className="h-3.5 w-3.5 text-[#8C8C8C]" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Select 
                        value={user.role} 
                        onValueChange={(val) => handleRoleChange(user.id, val)}
                      >
                        <SelectTrigger className="w-[180px] bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#151515] border-white/5 text-[#FAF9F6]">
                          <SelectItem value="GUEST" className="hover:bg-[#1A1A1A] text-xs">Гость</SelectItem>
                          <SelectItem value="STAFF" className="hover:bg-[#1A1A1A] text-xs">Сотрудник</SelectItem>
                          <SelectItem value="ADMIN" className="hover:bg-[#1A1A1A] text-xs">Администратор</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#FAF9F6] font-medium">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-[#C5A059]" />
                        <span>{user.bookings.length} броней</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#8C8C8C]">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        className="text-[#8C8C8C] hover:text-rose-400 hover:bg-rose-950/20 p-2 transition-all duration-300 rounded"
                        title="Удалить аккаунт"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-[#8C8C8C] text-sm">
                      Пользователи не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
