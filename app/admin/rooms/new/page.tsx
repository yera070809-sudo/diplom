"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/image-uploader"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, Loader2, Sparkles, Plus, Trash } from "lucide-react"

export default function NewRoomTypePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [capacity, setCapacity] = useState("")
  const [amenities, setAmenities] = useState("")

  // Spec fields ("О номере")
  const [area, setArea] = useState("")
  const [bed, setBed] = useState("")
  const [view, setView] = useState("")
  const [breakfast, setBreakfast] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  // Policies fields ("Правила")
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [cancellationPolicy, setCancellationPolicy] = useState("")
  const [childrenPolicy, setChildrenPolicy] = useState("")
  const [petsPolicy, setPetsPolicy] = useState("")

  function handleAddFeature() {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  function handleRemoveFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (images.length === 0) {
      toast.error("Добавьте хотя бы одно изображение")
      return
    }

    setIsLoading(true)

    const res = await fetch("/api/admin/room-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        amenities: amenities.split(",").map(a => a.trim()).filter(Boolean),
        images,
        area: area.trim() || undefined,
        bed: bed.trim() || undefined,
        view: view.trim() || undefined,
        breakfast: breakfast.trim() || undefined,
        features: features.length > 0 ? features : undefined,
        checkInTime: checkInTime.trim() || undefined,
        checkOutTime: checkOutTime.trim() || undefined,
        cancellationPolicy: cancellationPolicy.trim() || undefined,
        childrenPolicy: childrenPolicy.trim() || undefined,
        petsPolicy: petsPolicy.trim() || undefined,
      }),
    })

    if (res.ok) {
      toast.success("Категория создана")
      router.push("/admin/rooms")
      router.refresh()
    } else {
      toast.error("Ошибка создания категории")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        
        {/* Title Block */}
        <div className="flex items-center gap-4">
          <Link href="/admin/rooms">
            <Button variant="outline" size="icon" className="bg-[#151515] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A] h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Создание Номера
            </span>
            <h1 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide mt-0.5">Новая категория номеров</h1>
          </div>
        </div>

        <Card className="bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: Основная информация */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase border-b border-white/5 pb-2">1. Основная информация</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Название категории</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Presidential Suite"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Роскошный номер с панорамными окнами на горы Алатау..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 text-sm min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Цена за ночь (₸)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="85000"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Вместимость (чел.)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="2"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Параметры «О номере» */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase border-b border-white/5 pb-2">2. О номере (Параметры и Преимущества)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Площадь номера (например: 65 м²)</Label>
                    <Input
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Оставьте пустым для автозаполнения"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bed" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Спальные места</Label>
                    <Input
                      id="bed"
                      value={bed}
                      onChange={(e) => setBed(e.target.value)}
                      placeholder="King-size (двуспальная)"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="view" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Вид из окон</Label>
                    <Input
                      id="view"
                      value={view}
                      onChange={(e) => setView(e.target.value)}
                      placeholder="Панорамный вид на сосновый парк"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breakfast" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Условия питания</Label>
                    <Input
                      id="breakfast"
                      value={breakfast}
                      onChange={(e) => setBreakfast(e.target.value)}
                      placeholder="Завтрак шведский стол включен"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold block">Премиум-особенности (Особые преимущества)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Кофемашина Nespresso в номере"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/40 h-10 text-sm flex-1"
                    />
                    <Button type="button" onClick={handleAddFeature} className="bg-[#C5A059] text-zinc-950 hover:bg-[#C5A059]/90 font-bold px-4">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature, idx) => (
                      <span key={idx} className="bg-[#1C1C1C] border border-white/5 text-xs text-gray-300 px-3 py-1.5 rounded-full flex items-center gap-2">
                        {feature}
                        <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-rose-500 hover:text-rose-400">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Удобства */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase border-b border-white/5 pb-2">3. Удобства в номере</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="amenities" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Стандартные удобства (через запятую)</Label>
                  <Input
                    id="amenities"
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    placeholder="Wi-Fi, Кондиционер, Сейф, Мини-бар"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* SECTION 4: Правила проживания */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase border-b border-white/5 pb-2">4. Правила проживания</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInTime" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Время заезда</Label>
                    <Input
                      id="checkInTime"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      placeholder="с 14:00"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutTime" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Время выезда</Label>
                    <Input
                      id="checkOutTime"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      placeholder="до 12:00"
                      className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Условия отмены</Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                    placeholder="Бесплатная отмена возможна более чем за 24 часа..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childrenPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Размещение детей</Label>
                  <Textarea
                    id="childrenPolicy"
                    value={childrenPolicy}
                    onChange={(e) => setChildrenPolicy(e.target.value)}
                    placeholder="Дети любого возраста допускаются..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petsPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Дополнительные правила (животные, курение)</Label>
                  <Textarea
                    id="petsPolicy"
                    value={petsPolicy}
                    onChange={(e) => setPetsPolicy(e.target.value)}
                    placeholder="Курение запрещено. Размещение с мелкими животными допускается..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                    rows={2}
                  />
                </div>
              </div>

              {/* SECTION 5: Изображения */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase border-b border-white/5 pb-2">5. Галерея фотографий</h3>
                <div className="bg-[#0E0E0E] border border-white/5 rounded-lg p-4">
                  <ImageUploader images={images} onChange={setImages} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/5">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-grow bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 font-sans tracking-wide py-2.5 font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Создать категорию номеров
                </Button>
                
                <Link href="/admin/rooms">
                  <Button variant="outline" type="button" className="border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C] h-11 px-6">
                    Отмена
                  </Button>
                </Link>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
