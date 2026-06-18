"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        isActive: true
    })

    useEffect(() => {
        async function fetchService() {
            try {
                const res = await fetch(`/api/admin/services/${id}`)
                if (!res.ok) throw new Error("Failed to fetch service")
                const data = await res.json()
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: data.price.toString(),
                    isActive: data.isActive
                })
            } catch {
                setError("Ошибка загрузки данных услуги")
            } finally {
                setIsLoading(false)
            }
        }
        fetchService()
    }, [id])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSaving(true)
        setError("")

        try {
            const res = await fetch(`/api/admin/services/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    isActive: formData.isActive
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Ошибка сохранения")
            }

            router.push("/admin/services")
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Произошла ошибка")
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
            <div className="max-w-2xl mx-auto p-8 space-y-8">
                
                {/* Header Back & Titles */}
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
                            <h1 className="text-2xl font-serif text-[#FAF9F6] font-medium tracking-wide mt-0.5">Редактировать услугу</h1>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="bg-[#151515] border border-white/5 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] space-y-6">
                    
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Название услуги</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Например: Premium трансфер"
                            className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Описание</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Подробное описание услуги..."
                            className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 text-sm min-h-[100px]"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Цена (₸)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="15000"
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
                            disabled={isSaving}
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Сохранить изменения
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
