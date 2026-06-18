"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Save, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Settings State
  const [hotelName, setHotelName] = useState("")
  const [hotelPhone, setHotelPhone] = useState("")
  const [hotelEmail, setHotelEmail] = useState("")
  const [hotelAddress, setHotelAddress] = useState("")
  const [hotelMapIframe, setHotelMapIframe] = useState("")
  const [aboutHeroTitle, setAboutHeroTitle] = useState("")
  const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState("")
  const [aboutPhilosophyTitle, setAboutPhilosophyTitle] = useState("")
  const [aboutPhilosophyText1, setAboutPhilosophyText1] = useState("")
  const [aboutPhilosophyText2, setAboutPhilosophyText2] = useState("")
  const [aboutPhilosophyText3, setAboutPhilosophyText3] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setHotelName(data.hotel_name || "")
        setHotelPhone(data.hotel_phone || "")
        setHotelEmail(data.hotel_email || "")
        setHotelAddress(data.hotel_address || "")
        setHotelMapIframe(data.hotel_map_iframe || "")
        setAboutHeroTitle(data.about_hero_title || "")
        setAboutHeroSubtitle(data.about_hero_subtitle || "")
        setAboutPhilosophyTitle(data.about_philosophy_title || "")
        setAboutPhilosophyText1(data.about_philosophy_text_1 || "")
        setAboutPhilosophyText2(data.about_philosophy_text_2 || "")
        setAboutPhilosophyText3(data.about_philosophy_text_3 || "")
      }
    } catch {
      toast.error("Ошибка загрузки настроек")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_name: hotelName,
          hotel_phone: hotelPhone,
          hotel_email: hotelEmail,
          hotel_address: hotelAddress,
          hotel_map_iframe: hotelMapIframe,
          about_hero_title: aboutHeroTitle,
          about_hero_subtitle: aboutHeroSubtitle,
          about_philosophy_title: aboutPhilosophyTitle,
          about_philosophy_text_1: aboutPhilosophyText1,
          about_philosophy_text_2: aboutPhilosophyText2,
          about_philosophy_text_3: aboutPhilosophyText3,
        })
      })

      if (res.ok) {
        toast.success("Все настройки успешно сохранены!")
        fetchSettings()
      } else {
        toast.error("Ошибка сохранения настроек")
      }
    } catch {
      toast.error("Ошибка сети")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1200px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Консоль настроек</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Управление Контентом Сайта</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Редактируйте тексты, контактные телефоны, заголовки и общую информацию на сайте.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Contacts */}
          <Card className="bg-[#151515] border border-white/5 rounded-xl shadow-lg">
            <CardHeader className="p-6 border-b border-white/5 bg-[#181818]/60 flex flex-row items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#C5A059]" />
              <div>
                <CardTitle className="text-lg font-serif text-[#FAF9F6] font-medium tracking-wide">Общая информация & Контакты</CardTitle>
                <CardDescription className="text-xs text-[#8C8C8C]">Основные реквизиты, используемые в футере и на странице контактов.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Название отеля</Label>
                  <Input
                    id="hotelName"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    placeholder="Almaty Grand Hotel"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelPhone" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Телефон</Label>
                  <Input
                    id="hotelPhone"
                    value={hotelPhone}
                    onChange={(e) => setHotelPhone(e.target.value)}
                    placeholder="+7 (727) 123-45-67"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelEmail" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Email-адрес</Label>
                  <Input
                    id="hotelEmail"
                    value={hotelEmail}
                    onChange={(e) => setHotelEmail(e.target.value)}
                    placeholder="info@almatygrand.kz"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelAddress" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Физический Адрес</Label>
                  <Input
                    id="hotelAddress"
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    placeholder="ул. Достык, 85..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelMapIframe" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Ссылка на карту Google Maps (Iframe Src)</Label>
                <Input
                  id="hotelMapIframe"
                  value={hotelMapIframe}
                  onChange={(e) => setHotelMapIframe(e.target.value)}
                  placeholder="https://www.google.com/maps/embed..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: About Page Hero & Philosophy */}
          <Card className="bg-[#151515] border border-white/5 rounded-xl shadow-lg">
            <CardHeader className="p-6 border-b border-white/5 bg-[#181818]/60 flex flex-row items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#C5A059] animate-pulse" />
              <div>
                <CardTitle className="text-lg font-serif text-[#FAF9F6] font-medium tracking-wide">Дизайн & Описание «О Нас»</CardTitle>
                <CardDescription className="text-xs text-[#8C8C8C]">Кастомизируйте информацию об истории и философии отеля Almaty Grand Hotel.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutHeroTitle" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Заголовок страницы «О Нас»</Label>
                  <Input
                    id="aboutHeroTitle"
                    value={aboutHeroTitle}
                    onChange={(e) => setAboutHeroTitle(e.target.value)}
                    placeholder="Искусство Роскоши и Гостеприимства"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutPhilosophyTitle" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Заголовок раздела «Философия»</Label>
                  <Input
                    id="aboutPhilosophyTitle"
                    value={aboutPhilosophyTitle}
                    onChange={(e) => setAboutPhilosophyTitle(e.target.value)}
                    placeholder="Где Величественные Горы Встречаются..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutHeroSubtitle" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Подзаголовок Hero-блока</Label>
                <Textarea
                  id="aboutHeroSubtitle"
                  value={aboutHeroSubtitle}
                  onChange={(e) => setAboutHeroSubtitle(e.target.value)}
                  placeholder="С 2010 года Almaty Grand Hotel..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 text-sm min-h-[70px]"
                  required
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-white/5">
                <h4 className="text-xs uppercase tracking-wider text-[#C5A059] font-bold">Текстовые абзацы философии отеля</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutPhilosophyText1" className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-semibold">Абзац 1</Label>
                  <Textarea
                    id="aboutPhilosophyText1"
                    value={aboutPhilosophyText1}
                    onChange={(e) => setAboutPhilosophyText1(e.target.value)}
                    placeholder="Первый абзац..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 text-sm min-h-[90px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutPhilosophyText2" className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-semibold">Абзац 2</Label>
                  <Textarea
                    id="aboutPhilosophyText2"
                    value={aboutPhilosophyText2}
                    onChange={(e) => setAboutPhilosophyText2(e.target.value)}
                    placeholder="Второй абзац..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 text-sm min-h-[90px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutPhilosophyText3" className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-semibold">Абзац 3</Label>
                  <Textarea
                    id="aboutPhilosophyText3"
                    value={aboutPhilosophyText3}
                    onChange={(e) => setAboutPhilosophyText3(e.target.value)}
                    placeholder="Третий абзац..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 text-sm min-h-[90px]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/95 hover:shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-all duration-300 px-8 py-3.5 text-sm font-sans tracking-wide flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Сохранить изменения настроек
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
