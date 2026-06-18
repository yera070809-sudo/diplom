"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/image-uploader"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Loader2, 
  Trash2, 
  Sparkles, 
  Info, 
  Coffee, 
  Clock, 
  MessageSquare, 
  Plus, 
  Trash,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomType {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
  images: string
  
  // Specs
  area?: string | null
  bed?: string | null
  view?: string | null
  breakfast?: string | null
  features?: string | null // JSON string
  
  // Policies
  checkInTime?: string | null
  checkOutTime?: string | null
  cancellationPolicy?: string | null
  childrenPolicy?: string | null
  petsPolicy?: string | null
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  booking: {
    room: {
      typeId: string
    }
  }
}

export default function EditRoomTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"info" | "amenities" | "policies" | "reviews">("info")
  
  // Loading & states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [categoryReviews, setCategoryReviews] = useState<Review[]>([])
  
  // Fields state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [capacity, setCapacity] = useState("")
  const [amenities, setAmenities] = useState("")
  const [images, setImages] = useState<string[]>([])
  
  // Specs state ("О номере")
  const [area, setArea] = useState("")
  const [bed, setBed] = useState("")
  const [view, setView] = useState("")
  const [breakfast, setBreakfast] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  // Policies state ("Правила")
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [cancellationPolicy, setCancellationPolicy] = useState("")
  const [childrenPolicy, setChildrenPolicy] = useState("")
  const [petsPolicy, setPetsPolicy] = useState("")

  // Fetch Category Details
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Room Type details
        const typeRes = await fetch(`/api/admin/room-types/${id}`)
        if (!typeRes.ok) throw new Error("Не удалось загрузить данные")
        const data = await typeRes.json()
        setRoomType(data)
        
        setName(data.name)
        setDescription(data.description)
        setPrice(data.price.toString())
        setCapacity(data.capacity.toString())
        setAmenities(JSON.parse(data.amenities).join(", "))
        setImages(JSON.parse(data.images || "[]"))
        
        setArea(data.area || "")
        setBed(data.bed || "")
        setView(data.view || "")
        setBreakfast(data.breakfast || "")
        setFeatures(JSON.parse(data.features || "[]"))

        setCheckInTime(data.checkInTime || "")
        setCheckOutTime(data.checkOutTime || "")
        setCancellationPolicy(data.cancellationPolicy || "")
        setChildrenPolicy(data.childrenPolicy || "")
        setPetsPolicy(data.petsPolicy || "")

        // 2. Fetch all reviews and filter for this room type category
        const reviewsRes = await fetch("/api/admin/reviews")
        if (reviewsRes.ok) {
          const reviewsData: Review[] = await reviewsRes.json()
          const filtered = reviewsData.filter(rev => rev.booking?.room?.typeId === id)
          setCategoryReviews(filtered)
        }

      } catch {
        setError("Ошибка загрузки данных")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Feature handling
  function handleAddFeature() {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  function handleRemoveFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // Handle Review deletion
  async function handleDeleteReview(reviewId: string) {
    if (!confirm("Вы действительно хотите окончательно удалить этот отзыв гостя?")) return

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Не удалось удалить отзыв")
      
      toast.success("Отзыв успешно удален")
      setCategoryReviews(prev => prev.filter(r => r.id !== reviewId))
      router.refresh()
    } catch (err) {
      toast.error("Ошибка при удалении отзыва")
    }
  }

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/room-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          capacity: parseInt(capacity),
          amenities: amenities.split(",").map(a => a.trim()).filter(Boolean),
          images,
          area: area.trim() || null,
          bed: bed.trim() || null,
          view: view.trim() || null,
          breakfast: breakfast.trim() || null,
          features,
          checkInTime: checkInTime.trim() || null,
          checkOutTime: checkOutTime.trim() || null,
          cancellationPolicy: cancellationPolicy.trim() || null,
          childrenPolicy: childrenPolicy.trim() || null,
          petsPolicy: petsPolicy.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Ошибка сохранения")
      }

      toast.success("Изменения успешно сохранены")
      router.push("/admin/rooms")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
      toast.error("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete Category Handler
  async function handleDeleteCategory() {
    if (!confirm("Вы уверены, что хотите полностью удалить эту категорию? Все связанные физические номера также будут удалены.")) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/room-types/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Ошибка удаления")
      }

      toast.success("Категория успешно удалена")
      router.push("/admin/rooms")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
      </div>
    )
  }

  if (!roomType) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <p className="text-rose-500 font-medium">Категория не найдена</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/rooms">
              <Button variant="outline" size="icon" className="bg-[#151515] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A] h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Номерной фонд
              </span>
              <h1 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide mt-0.5">
                Редактирование: {roomType.name}
              </h1>
            </div>
          </div>
          
          <Button
            variant="destructive"
            onClick={handleDeleteCategory}
            disabled={isDeleting}
            className="bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-900/40"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Удалить категорию
          </Button>
        </div>

        {/* Tab Switcher Grid */}
        <div className="bg-[#151515] border border-white/5 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "info" ? "bg-[#C5A059] text-zinc-950 shadow-md font-extrabold" : "text-gray-400 hover:text-[#FAF9F6]"
            )}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Основное & О номере</span>
          </button>
          
          <button
            onClick={() => setActiveTab("amenities")}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "amenities" ? "bg-[#C5A059] text-zinc-950 shadow-md font-extrabold" : "text-gray-400 hover:text-[#FAF9F6]"
            )}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Удобства & Особенности</span>
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "policies" ? "bg-[#C5A059] text-zinc-950 shadow-md font-extrabold" : "text-gray-400 hover:text-[#FAF9F6]"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Правила проживания</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 relative",
              activeTab === "reviews" ? "bg-[#C5A059] text-zinc-950 shadow-md font-extrabold" : "text-gray-400 hover:text-[#FAF9F6]"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Отзывы</span>
            {categoryReviews.length > 0 && (
              <span className={cn(
                "absolute top-1.5 right-1.5 w-4.5 h-4.5 text-[9px] rounded-full flex items-center justify-center font-mono font-bold shadow-sm",
                activeTab === "reviews" ? "bg-zinc-950 text-[#C5A059]" : "bg-[#C5A059] text-zinc-950"
              )}>
                {categoryReviews.length}
              </span>
            )}
          </button>
        </div>

        {/* Form Wrap */}
        <form onSubmit={handleSubmit} className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] space-y-6">
          
          {/* TAB 1: Основное & О номере */}
          {activeTab === "info" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Название категории</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Presidential Suite"
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание категории</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Подробный рекламный текст..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 text-sm min-h-[100px]"
                  rows={4}
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
                    placeholder="25000"
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

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Площадь номера (например: 65 м²)</Label>
                  <Input
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Например: 65 м² (или оставьте пустым для автозаполнения)"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bed" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Спальные места</Label>
                  <Input
                    id="bed"
                    value={bed}
                    onChange={(e) => setBed(e.target.value)}
                    placeholder="Например: King-size (двуспальная)"
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
                    placeholder="Например: Панорамный вид на горы Заилийского Алатау"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakfast" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Питание</Label>
                  <Input
                    id="breakfast"
                    value={breakfast}
                    onChange={(e) => setBreakfast(e.target.value)}
                    placeholder="Например: Шеф-завтрак включен в стоимость"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold block mb-1">Изображения номера</Label>
                <div className="bg-[#0E0E0E] border border-white/5 rounded-lg p-4">
                  <ImageUploader images={images} onChange={setImages} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Удобства & Особенности */}
          {activeTab === "amenities" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="amenities" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Удобства (через запятую)</Label>
                <Input
                  id="amenities"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="Wi-Fi, Кондиционер, Сейф, Мини-бар"
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                  <h4 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase mb-1">Премиум-особенности номера</h4>
                  <p className="text-xs text-[#8C8C8C] mb-4">Индивидуальный список дополнительных преимуществ, отображаемый галочками на публичном сайте.</p>
                </div>

                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Например: Акустическая система Bang & Olufsen"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/40 h-10 text-sm flex-1"
                  />
                  <Button type="button" onClick={handleAddFeature} className="bg-[#C5A059] text-zinc-950 hover:bg-[#C5A059]/90 font-bold px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {features.map((feature, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#0E0E0E] border border-white/5 px-4 py-2.5 rounded-lg text-sm text-gray-300">
                      <span>{feature}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(index)}
                        className="text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-xs text-gray-500 italic text-center py-6">Список пуст. Добавьте преимущества выше или применится стандартный шаблон.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Правила проживания */}
          {activeTab === "policies" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Время заезда</Label>
                  <Input
                    id="checkInTime"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    placeholder="Например: с 14:00"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutTime" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Время выезда</Label>
                  <Input
                    id="checkOutTime"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    placeholder="Например: до 12:00"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Условия отмены бронирования</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="Бесплатная отмена возможна более чем за 24 часа до заезда..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="childrenPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Размещение детей и дополнительных кроватей</Label>
                <Textarea
                  id="childrenPolicy"
                  value={childrenPolicy}
                  onChange={(e) => setChildrenPolicy(e.target.value)}
                  placeholder="Дети любого возраста допускаются. Кроватки предоставляются..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petsPolicy" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Дополнительные правила отеля (животные, курение)</Label>
                <Textarea
                  id="petsPolicy"
                  value={petsPolicy}
                  onChange={(e) => setPetsPolicy(e.target.value)}
                  placeholder="Курение в номерах строго запрещено. Животные разрешены..."
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/30 text-sm min-h-[60px]"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* TAB 4: Управление отзывами */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="text-sm font-bold tracking-wider text-[#C5A059] uppercase mb-1">Отзывы об этой категории</h4>
                <p className="text-xs text-[#8C8C8C] mb-4">Вы можете просматривать и удалять отзывы гостей, оставленные для номеров этой категории.</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {categoryReviews.map((review) => (
                  <div key={review.id} className="bg-[#0E0E0E] border border-white/5 p-4 rounded-xl space-y-3 shadow-inner">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-200">{review.user.name || "Гость отеля"}</span>
                        <span className="text-[10px] text-gray-500 ml-2 font-mono">{review.user.email}</span>
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3 fill-current",
                                i < review.rating ? "text-[#C5A059]" : "text-white/10"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#8C8C8C] font-mono">
                          {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-rose-500 hover:text-rose-400 p-1 hover:bg-rose-500/10 rounded transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-400 leading-relaxed bg-[#131313]/50 p-2.5 rounded border border-white/[0.02] italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
                {categoryReviews.length === 0 && (
                  <p className="text-xs text-gray-500 italic text-center py-10">Отзывов об этой категории номеров пока нет.</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-rose-500 text-xs font-semibold">{error}</p>
          )}

          {/* Form Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/5">
            <Button 
              type="submit" 
              className="flex-grow bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 font-sans tracking-wide py-2.5 font-bold h-11" 
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Сохранить все изменения
            </Button>
            
            <Link href="/admin/rooms">
              <Button type="button" variant="outline" className="border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C] h-11 px-6">
                Отмена
              </Button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
