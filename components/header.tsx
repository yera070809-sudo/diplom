"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { User, Settings, CalendarDays, LogOut, Shield, Search, Menu, Home, Heart } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    }
    return email?.charAt(0).toUpperCase() || "U"
  }

  const closeSheet = () => setIsOpen(false)

  return (
    <header className="glass sticky top-0 z-50 transition-all">
      <div className="container-premium py-5 flex justify-between items-center">
        <div className="flex items-center gap-12">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link
                  href="/"
                  onClick={closeSheet}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  Главная
                </Link>
                <Link
                  href="/rooms"
                  onClick={closeSheet}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                >
                  <Search className="h-5 w-5" />
                  Номера
                </Link>

                <Link
                  href="/about"
                  onClick={closeSheet}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                >
                  <User className="h-5 w-5" />
                  О нас
                </Link>
                {session && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <Link
                      href="/my-bookings"
                      onClick={closeSheet}
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                    >
                      <CalendarDays className="h-5 w-5" />
                      Мои бронирования
                    </Link>
                    <Link
                      href="/profile"
                      onClick={closeSheet}
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Профиль
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={closeSheet}
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-900 py-2 transition-colors"
                      >
                        <Shield className="h-5 w-5" />
                        Админ-панель
                      </Link>
                    )}
                  </>
                )}
                {!session && status !== "loading" && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <Link href="/login" onClick={closeSheet}>
                      <Button variant="outline" className="w-full">Войти</Button>
                    </Link>
                    <Link href="/register" onClick={closeSheet}>
                      <Button className="w-full bg-primary hover:bg-gray-800">Регистрация</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-semibold text-gray-900 tracking-tight hover:text-gray-700 transition-colors">
            Almaty Grand Hotel
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Главная
            </Link>
            <Link href="/rooms" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Номера
            </Link>
            <Link href="/favorites" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors">
              <Heart className="h-4 w-4" />
              Избранное
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              О нас
            </Link>
          </nav>
        </div>

        <nav className="hidden md:flex items-center gap-4">

          {status === "loading" ? (
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-900 text-white font-medium">
                      {getInitials(session.user?.name, session.user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name || "Пользователь"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.user?.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Админ-панель
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-bookings" className="cursor-pointer">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Мои бронирования
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/password" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Сменить пароль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-gray-800">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Avatar */}
        {session && (
          <div className="md:hidden">
            <Link href="/profile">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gray-900 text-white text-sm font-medium">
                  {getInitials(session.user?.name, session.user?.email)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
