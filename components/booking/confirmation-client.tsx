"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  CreditCard,
  Home,
  Loader2,
  Lock,
  Smartphone,
  Check,
  Printer,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  QrCode
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingDetails {
  id: string
  checkIn: Date | string
  checkOut: Date | string
  totalPrice: number
  status: string
  paymentStatus: string
  extras: string
  createdAt: Date | string
  user: {
    name: string | null
    email: string
  }
  room: {
    number: string
    type: {
      name: string
      price: number
    }
  }
}

interface ConfirmationClientProps {
  booking: BookingDetails
  initialExtras: string[]
}

export function ConfirmationClient({ booking: initialBooking, initialExtras }: ConfirmationClientProps) {
  const [booking, setBooking] = useState<BookingDetails>(initialBooking)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [activeBank, setActiveBank] = useState<"kaspi" | "halyk" | "forte">("kaspi")
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "sms" | "success">("select")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Halyk / Cards form states
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [isCvvFocused, setIsCvvFocused] = useState(false)

  // Simulation parameters
  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Format card number on input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formatted = value.match(/.{1,4}/g)?.join(" ") || ""
    setCardNumber(formatted.slice(0, 19))
  }

  // Format card expiry on input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 2) {
      setCardExpiry(value)
    } else {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`)
    }
  }

  // Handle CVS change
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCardCvv(value.slice(0, 3))
  }

  // Trigger payment PATCH update to SQLite database
  const finalizePayment = async (bankName: string) => {
    setPaymentStep("processing")
    
    // Simulate transaction processing delays
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CONFIRMED",
          paymentStatus: "PAID"
        })
      })

      if (res.ok) {
        const updatedBooking = await res.json()
        setBooking({
          ...booking,
          paymentStatus: "PAID",
          status: "CONFIRMED"
        })
        setPaymentStep("success")
        toast.success(`Оплата через ${bankName} проведена успешно!`)
      } else {
        toast.error("Не удалось обновить статус оплаты в базе данных")
        setPaymentStep("select")
      }
    } catch (error) {
      console.error("Payment sync error:", error)
      toast.error("Ошибка сети при подтверждении платежа")
      setPaymentStep("select")
    }
  }

  // Start payment simulation for Kaspi QR scan click
  const handleKaspiQRScanSimulation = async () => {
    setPaymentStep("processing")
    // Wait 1.5s then show Kaspi app modal approval screen
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPaymentStep("sms") // Use SMS step as the custom Kaspi confirmation screen
  }

  // Submit card payment (initiates Halyk SMS step)
  const handleCardPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
      toast.error("Пожалуйста, заполните реквизиты карты")
      return
    }
    setPaymentStep("sms")
  }

  // Verify SMS code
  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (smsCode.length < 4) {
      toast.error("Введите 4-значный код подтверждения")
      return
    }
    const bankLabel = activeBank === "kaspi" ? "Kaspi.kz" : activeBank === "halyk" ? "Halyk Bank" : "ForteBank"
    finalizePayment(bankLabel)
  }

  const isPaid = booking.paymentStatus === "PAID"

  return (
    <div className={cn(
      "min-h-screen py-12 transition-all duration-700",
      isPaid ? "bg-gradient-to-b from-emerald-950/40 via-[#0E0E0E] to-[#0E0E0E]" : "bg-gradient-to-b from-[#111111] via-[#0E0E0E] to-[#0E0E0E]"
    )}>
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Success / Status Header */}
        <div className="text-center mb-10 space-y-3 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
            {isPaid ? (
              <CheckCircle className="h-10 w-10 text-emerald-400 fill-emerald-950/20" />
            ) : (
              <Sparkles className="h-10 w-10 text-[#C5A059]" />
            )}
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-[#FAF9F6]">
            {isPaid ? "Бронирование Оплачено!" : "Бронирование Оформлено"}
          </h1>
          <p className="text-[#8C8C8C] text-sm max-w-md mx-auto font-sans leading-relaxed">
            {isPaid 
              ? "Благодарим вас за оплату! Гарантированный заезд Almaty Grand Hotel подтвержден банком." 
              : "Для 100% гарантии сохранения номера, пожалуйста, внесите оплату с помощью удобного онлайн-банка Казахстана."}
          </p>
        </div>

        {/* Booking Card */}
        <Card className="mb-6 overflow-hidden bg-[#151515] border border-white/5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          <div className="bg-[#1C1C1C] border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">Ваучер бронирования</span>
            <Badge className="font-mono bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 text-xs px-3 py-1">
              #{booking.id.slice(-8).toUpperCase()}
            </Badge>
          </div>
          
          <CardContent className="p-6 space-y-6 text-sm font-sans text-[#FAF9F6]">
            {/* Room Category */}
            <div className="flex items-start gap-4 pb-5 border-b border-white/5">
              <div className="bg-[#C5A059]/10 p-3.5 rounded-xl border border-[#C5A059]/20 text-[#C5A059]">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#FAF9F6]">{booking.room.type.name}</h3>
                <p className="text-[#8C8C8C] text-xs mt-1">Физический номер комнаты: <strong className="text-[#FAF9F6]">№{booking.room.number}</strong></p>
              </div>
            </div>

            {/* Stay Dates Grid */}
            <div className="grid grid-cols-2 gap-6 py-1 border-b border-white/5 pb-5">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#8C8C8C] uppercase tracking-wider font-semibold">Заезд</p>
                  <p className="font-bold text-sm mt-1 text-[#FAF9F6]">{format(new Date(booking.checkIn), 'd MMMM yyyy', { locale: ru })}</p>
                  <p className="text-xs text-[#8C8C8C] mt-0.5">с 14:00 (Check-in)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#C5A059] mt-0.5" />
                <div>
                  <p className="text-[11px] text-[#8C8C8C] uppercase tracking-wider font-semibold">Выезд</p>
                  <p className="font-bold text-sm mt-1 text-[#FAF9F6]">{format(new Date(booking.checkOut), 'd MMMM yyyy', { locale: ru })}</p>
                  <p className="text-xs text-[#8C8C8C] mt-0.5">до 12:00 (Check-out)</p>
                </div>
              </div>
            </div>

            {/* Guest Profile Details */}
            <div className="py-1 border-b border-white/5 pb-5 space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <User className="h-4.5 w-4.5 text-[#C5A059]" />
                <span className="font-medium">{booking.user.name || 'Гость отеля'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4.5 w-4.5 text-[#C5A059]" />
                <span className="font-mono text-xs">{booking.user.email}</span>
              </div>
            </div>

            {/* Extras services */}
            {initialExtras.length > 0 && (
              <div className="py-1 border-b border-white/5 pb-5">
                <p className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold mb-2.5">Заказанные доп. услуги</p>
                <div className="flex flex-wrap gap-2">
                  {initialExtras.map((extra: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-[#1C1C1C] border-white/5 text-[#FAF9F6]/90 text-xs px-2.5 py-1">
                      {extra}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div>
              <div className="flex justify-between text-xs text-[#8C8C8C] mb-2 font-mono">
                <span>{booking.room.type.price.toLocaleString('ru-KZ')} ₸ × {nights} ночей</span>
                <span>{(booking.room.type.price * nights).toLocaleString('ru-KZ')} ₸</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2">
                <span className="font-bold text-sm text-[#FAF9F6]">Итого к оплате</span>
                <span className="text-2xl font-extrabold text-[#C5A059] font-mono">
                  {booking.totalPrice.toLocaleString('ru-KZ')} ₸
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Payment State CTA */}
        {isPaid ? (
          <Card className="mb-8 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 shadow-lg shadow-emerald-950/10">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-400 text-sm">Оплачено онлайн (Казахстан шлюз)</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Ваш электронный фискальный чек успешно сгенерирован. Бронирование переведено в статус гарантированного подтверждения. Будем рады видеть вас!
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mb-8 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl p-5 shadow-lg shadow-black/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#C5A059]/10 p-2.5 rounded-xl text-[#C5A059] border border-[#C5A059]/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#FAF9F6] text-sm">Внесите предоплату онлайн</h4>
                  <p className="text-xs text-[#8C8C8C] mt-1 leading-relaxed">
                    Для полной брони требуется предоплата. Мы поддерживаем шлюзыKaspi QR, Halyk Pay и карты РК.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setPaymentStep("select")
                  setIsPaymentOpen(true)
                }} 
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#C5A059]/90 text-zinc-950 font-bold px-6 py-5 rounded-full transition-all duration-300 scale-100 hover:scale-102 flex items-center gap-1 shrink-0 shadow-lg shadow-[#C5A059]/10"
              >
                <span>Оплатить онлайн</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Public info banner */}
        <Card className="mb-8 bg-[#151515] border border-white/5 rounded-2xl overflow-hidden shadow-md">
          <CardContent className="p-5 flex items-start gap-4 text-xs">
            <MapPin className="h-5 w-5 text-[#C5A059] mt-0.5 shrink-0" />
            <div className="space-y-1 text-[#8C8C8C]">
              <h4 className="font-bold text-[#FAF9F6] text-sm">Almaty Grand Hotel</h4>
              <p>г. Алматы, пр. Достык, 85 (уг. ул. Курмангазы)</p>
              <p>Служба приема и размещения: +7 (727) 123-45-67, reception@almatygrand.kz</p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Page Actions */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <Button 
            variant="outline"
            className="flex-1 bg-transparent border-white/10 hover:bg-white/5 text-[#FAF9F6] h-12 rounded-xl text-sm"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Распечатать ваучер
          </Button>
          <Link href="/my-bookings" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-[#FAF9F6] h-12 rounded-xl text-sm">
              Личный кабинет
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-[#FAF9F6] text-[#0E0E0E] hover:bg-[#FAF9F6]/90 h-12 rounded-xl text-sm font-semibold">
              На главную
            </Button>
          </Link>
        </div>
      </div>

      {/* ====================================================== */}
      {/* KAZAKHSTAN BANKING SIMULATION PAYMENT GATEWAY MODAL    */}
      {/* ====================================================== */}
      <Dialog open={isPaymentOpen} onOpenChange={(open: boolean) => !isSubmitting && setIsPaymentOpen(open)}>
        <DialogContent className="bg-[#151515] border border-white/10 text-[#FAF9F6] max-w-md rounded-2xl shadow-2xl p-6 select-none font-sans overflow-hidden">
          
          {/* Header block with SSL padlock */}
          <DialogHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-[#FAF9F6] tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Шлюз Безопасных Платежей РК</span>
            </DialogTitle>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Lock className="w-3 h-3" />
              <span>SSL 256-bit</span>
            </div>
          </DialogHeader>

          {/* PAYMENT STEP 1: CHOOSE BANK METHOD */}
          {paymentStep === "select" && (
            <div className="space-y-6 pt-4">
              
              {/* Payment sum bar */}
              <div className="bg-[#0E0E0E] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                <span className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Сумма к оплате</span>
                <span className="text-xl font-extrabold text-[#C5A059] font-mono">
                  {booking.totalPrice.toLocaleString("ru-KZ")} ₸
                </span>
              </div>

              {/* Toggles for RK Banks */}
              <div className="space-y-3">
                <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold block mb-1">Выберите банк для оплаты</span>
                
                {/* 1. KASPI QR Tab */}
                <button
                  type="button"
                  onClick={() => setActiveBank("kaspi")}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.01]",
                    activeBank === "kaspi"
                      ? "bg-rose-950/20 border-rose-600 text-rose-100 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                      : "bg-[#0E0E0E] border-white/5 text-[#8C8C8C] hover:border-white/10 hover:text-[#FAF9F6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black text-xl tracking-tight shadow-md">
                      K
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#FAF9F6]">Оплата через Kaspi.kz</h4>
                      <p className="text-[10px] text-[#8C8C8C] mt-0.5">Kaspi QR / Быстрый перевод</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-55" />
                </button>

                {/* 2. HALYK PAY Tab */}
                <button
                  type="button"
                  onClick={() => setActiveBank("halyk")}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.01]",
                    activeBank === "halyk"
                      ? "bg-emerald-950/20 border-emerald-600 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-[#0E0E0E] border-white/5 text-[#8C8C8C] hover:border-white/10 hover:text-[#FAF9F6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#005A3C] rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                      Halyk
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#FAF9F6]">Оплата через Halyk Bank</h4>
                      <p className="text-[10px] text-[#8C8C8C] mt-0.5">Halyk Pay / Карты РК</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-55" />
                </button>

                {/* 3. FORTEBANK Tab */}
                <button
                  type="button"
                  onClick={() => setActiveBank("forte")}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.01]",
                    activeBank === "forte"
                      ? "bg-amber-950/20 border-amber-600 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-[#0E0E0E] border-white/5 text-[#8C8C8C] hover:border-white/10 hover:text-[#FAF9F6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF5A00] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                      Forte
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#FAF9F6]">Премиум ForteBank</h4>
                      <p className="text-[10px] text-[#8C8C8C] mt-0.5">Моментальное зачисление Forte</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-55" />
                </button>
              </div>

              {/* Action Forms based on selected bank */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                
                {/* A. KASPI QR INTERFACE */}
                {activeBank === "kaspi" && (
                  <div className="space-y-4 text-center">
                    <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold block">Отсканируйте Kaspi QR</span>
                    
                    {/* QR Code Container Simulation */}
                    <div 
                      onClick={handleKaspiQRScanSimulation}
                      className="mx-auto w-52 h-52 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer border border-rose-600/30 relative group shadow-lg"
                    >
                      {/* Scanning animated laser line */}
                      <div className="absolute left-2 right-2 h-[2px] bg-rose-600 top-2 animate-bounce shadow-[0_0_8px_rgba(225,29,72,0.8)] z-10" />

                      <QrCode className="w-44 h-44 text-zinc-900" />
                      
                      {/* Click overlay simulator hint */}
                      <div className="absolute inset-0 bg-rose-600/90 rounded-2xl flex flex-col items-center justify-center p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                        <Smartphone className="w-8 h-8 animate-bounce mb-2" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-center leading-snug">
                          Кликните сюда,<br/>чтобы имитировать<br/>сканирование в Kaspi
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8C8C8C] leading-relaxed max-w-xs mx-auto">
                      Или просто кликните по QR-коду, чтобы отсканировать его с этого телефона и открыть окно Kaspi Pay.
                    </p>
                  </div>
                )}

                {/* B. HALYK PAY & FORTE CARD FORM INTERFACE */}
                {(activeBank === "halyk" || activeBank === "forte") && (
                  <form onSubmit={handleCardPaymentSubmit} className="space-y-4">
                    <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold block mb-1">
                      Реквизиты банковской карты РК
                    </span>
                    
                    {/* Simulated Credit Card view */}
                    <div className={cn(
                      "w-full h-44 rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500",
                      activeBank === "halyk" 
                        ? "bg-gradient-to-br from-[#004d33] to-[#002e1f] border-emerald-500/20 text-[#FAF9F6]" 
                        : "bg-gradient-to-br from-[#FF5A00]/90 to-zinc-950 border-orange-500/20 text-[#FAF9F6]"
                    )}>
                      {/* Bank label */}
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black/30 px-2.5 py-1 rounded-full">
                          {activeBank === "halyk" ? "Halyk Bank" : "Forte Premium"}
                        </span>
                        <div className="w-8 h-5 bg-yellow-500/80 rounded-md shrink-0 border border-white/10 flex items-center justify-center font-bold text-[8px] text-black">
                          CHIP
                        </div>
                      </div>

                      {/* Card number input / preview */}
                      <div className="space-y-1.5 z-10">
                        <label className="text-[8px] uppercase tracking-widest opacity-60">Номер карты</label>
                        <Input
                          placeholder="4400 4300 1200 8500"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="bg-black/40 border-white/10 text-[#FAF9F6] h-10 tracking-widest font-mono text-sm placeholder:text-white/20"
                          maxLength={19}
                          required
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-4 z-10">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest opacity-60">Срок действия</label>
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            className="bg-black/40 border-white/10 text-[#FAF9F6] h-8 text-center text-xs font-mono placeholder:text-white/20"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest opacity-60">CVV / CVC</label>
                          <Input
                            type="password"
                            placeholder="***"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            onFocus={() => setIsCvvFocused(true)}
                            onBlur={() => setIsCvvFocused(false)}
                            className="bg-black/40 border-white/10 text-[#FAF9F6] h-8 text-center text-xs font-mono placeholder:text-white/20"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className={cn(
                        "w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md mt-2",
                        activeBank === "halyk" 
                          ? "bg-[#005A3C] hover:bg-[#004D33] text-white" 
                          : "bg-[#FF5A00] hover:bg-[#E04F00] text-white"
                      )}
                    >
                      Оплатить карту {booking.totalPrice.toLocaleString("ru-KZ")} ₸
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* PAYMENT STEP 2: LOADER / TRANSACTION SPINNER */}
          {paymentStep === "processing" && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin" />
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#FAF9F6] tracking-wide uppercase">Процессинг Транзакции</h4>
                <p className="text-xs text-[#8C8C8C] max-w-xs leading-relaxed">
                  Связываемся со шлюзом платежной системы {activeBank === "kaspi" ? "Kaspi.kz" : activeBank === "halyk" ? "Halyk Bank" : "ForteBank"}. Пожалуйста, не закрывайте вкладку...
                </p>
              </div>
            </div>
          )}

          {/* PAYMENT STEP 3: SMS OTP OR KASPI CONFIRM SCREEN */}
          {paymentStep === "sms" && (
            <div className="space-y-6 pt-4">
              
              {/* If KASPI - show simulated red Kaspi Pay confirmation screen */}
              {activeBank === "kaspi" ? (
                <form onSubmit={handleSmsSubmit} className="space-y-6 text-center">
                  <div className="bg-rose-600/10 border border-rose-500/20 p-5 rounded-2xl space-y-4">
                    <div className="w-12 h-12 bg-rose-600 text-white font-bold text-xl rounded-full flex items-center justify-center mx-auto tracking-tight">K</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#FAF9F6] text-sm">Подтверждение Kaspi Pay</h4>
                      <p className="text-[11px] text-[#8C8C8C]">Авторизованный перевод с Kaspi Gold</p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl flex justify-between items-center text-left">
                      <div>
                        <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider block">Получатель</span>
                        <strong className="text-xs text-[#FAF9F6]">Almaty Grand Hotel LLP</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider block">Сумма списания</span>
                        <strong className="text-sm text-rose-500 font-mono">{booking.totalPrice.toLocaleString("ru-KZ")} ₸</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold block mb-1">
                      Введите секретный код списания Kaspi (SMS или Push-код)
                    </label>
                    <Input
                      type="password"
                      placeholder="Введите 4-значный код (например, 1234)"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-11 text-center font-mono tracking-widest text-lg focus:border-rose-600"
                      maxLength={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold h-11 text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Подтвердить списание {booking.totalPrice.toLocaleString("ru-KZ")} ₸
                  </Button>
                </form>
              ) : (
                /* Card 3D-Secure form (Halyk or Forte styled) */
                <form onSubmit={handleSmsSubmit} className="space-y-6">
                  <div className="bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl text-center space-y-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xs bg-slate-800">
                      3DS
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#FAF9F6]">3-D Secure верификация РК</h4>
                      <p className="text-[11px] text-[#8C8C8C]">
                        Мы отправили SMS с одноразовым кодом на ваш номер мобильного телефона, привязанный к карте {cardNumber.slice(-4)}.
                      </p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-[10px] font-bold">
                      Тестовый SMS-код подтверждения: 7712
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-bold block text-center">
                      Введите 4-значный SMS-код подтверждения
                    </label>
                    <Input
                      placeholder="****"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className={cn(
                        "bg-[#0E0E0E] border-white/5 text-[#FAF9F6] h-11 text-center font-mono tracking-widest text-lg",
                        activeBank === "halyk" ? "focus:border-emerald-600" : "focus:border-orange-600"
                      )}
                      maxLength={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      "w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md",
                      activeBank === "halyk" ? "bg-[#005A3C] hover:bg-[#004D33]" : "bg-[#FF5A00] hover:bg-[#E04F00]"
                    )}
                  >
                    Подтвердить перевод
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* PAYMENT STEP 4: SUCCESS WITH CHECKMARK & CONFETTI METRIC */}
          {paymentStep === "success" && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-scale-in">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 relative">
                {/* Floating check particles mock */}
                <div className="absolute top-1/10 right-1/10 w-2.5 h-2.5 bg-emerald-400 rounded-full blur-[1px] animate-ping" />
                <Check className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-lg text-emerald-400 tracking-wide uppercase">Оплата Успешно Проведена!</h4>
                <p className="text-xs text-[#8C8C8C] max-w-xs leading-relaxed">
                  Банковский шлюз {activeBank === "kaspi" ? "Kaspi.kz" : activeBank === "halyk" ? "Halyk Bank" : "ForteBank"} подтвердил списание. Статус бронирования в Almaty Grand Hotel успешно обновлен в базе данных SQLite.
                </p>
              </div>

              <Button
                onClick={() => setIsPaymentOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-8 h-10 rounded-xl text-xs uppercase tracking-wider shadow-md"
              >
                Закрыть шлюз
              </Button>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}
