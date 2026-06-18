"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminNotifications } from "@/components/admin-notifications"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/bookings", label: "Бронирования" },
  { href: "/admin/rooms", label: "Номера" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/housekeeping", label: "Уборка" },
  { href: "/admin/users", label: "Пользователи" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "Контент" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/calendar", label: "Календарь" },
  { href: "/admin/reports", label: "Отчёты" },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <div className="bg-[#0E0E0E] border-b border-[#C5A059]/20 px-8 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-serif tracking-wider text-[#C5A059] font-medium">
              Almaty Grand <span className="text-xs uppercase tracking-[0.25em] text-[#FAF9F6]/50 block font-sans mt-0.5">Admin</span>
            </h1>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-wide transition-all duration-300 relative py-1",
                    isActive 
                      ? "text-[#C5A059] font-medium" 
                      : "text-[#8C8C8C] hover:text-[#FAF9F6]"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <AdminNotifications />
          <Link 
            href="/" 
            className="text-xs tracking-wider uppercase font-medium text-[#FAF9F6]/60 hover:text-[#C5A059] border border-[#FAF9F6]/10 hover:border-[#C5A059]/30 rounded px-3 py-1.5 transition-all duration-300"
          >
            ← Сайт
          </Link>
        </div>
      </div>
    </div>
  )
}

