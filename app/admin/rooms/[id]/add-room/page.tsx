"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

export default function AddRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const res = await fetch(`/api/admin/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typeId: id,
        number: formData.get("number"),
      }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push("/admin/rooms")
      router.refresh()
    } else {
      setError(data.error || "Ошибка при создании комнаты")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-md mx-auto p-8 space-y-8">
        
        {/* Title Block */}
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
            <h1 className="text-xl font-serif text-[#FAF9F6] font-medium tracking-wide mt-0.5">Добавить комнату</h1>
          </div>
        </div>

        <Card className="bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-950/40 text-rose-400 border border-rose-500/30 p-3 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="number" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Номер комнаты</Label>
                <Input 
                  id="number" 
                  name="number" 
                  placeholder="Например: 301" 
                  className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                  required 
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-grow bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 font-sans tracking-wide py-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Добавить номер
                </Button>
                
                <Link href="/admin/rooms" className="flex-shrink-0">
                  <Button variant="outline" type="button" className="border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]">
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

