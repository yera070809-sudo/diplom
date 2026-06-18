"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

export default function NewServicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: parseFloat(formData.get("price") as string),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Ошибка создания")
      }

      router.push("/admin/services")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        
        {/* Header Block back & titles */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/services">
              <Button variant="outline" size="icon" className="bg-[#151515] border-white/5 text-[#FAF9F6] hover:bg-[#1A1A1A] h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Управление каталогом
              </span>
              <h1 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide mt-0.5">Добавить новую услугу</h1>
            </div>
          </div>
        </div>

        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Название услуги</Label>
            <Input
              id="name"
              name="name"
              placeholder="Например: Завтрак в постель"
              className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Подробное описание предоставляемой услуги..."
              className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 text-sm min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Цена (₸)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="9000"
              className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
              required
            />
          </div>

          {error && (
            <p className="text-rose-500 text-xs font-semibold">{error}</p>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <Button 
              type="submit" 
              className="flex-grow bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 font-sans tracking-wide py-2" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Создать услугу
            </Button>
            <Link href="/admin/services" className="flex-shrink-0">
              <Button type="button" variant="outline" className="border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]">
                Отмена
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
