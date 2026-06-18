"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Loader2, Sparkles, X, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

const faqCategories = ["Бронирование", "Заселение и выезд", "Номера и услуги", "Оплата"]

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Form State
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [category, setCategory] = useState("Бронирование")
  const [order, setOrder] = useState("0")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchFaqs()
  }, [])

  useEffect(() => {
    if (selectedFaq) {
      setQuestion(selectedFaq.question)
      setAnswer(selectedFaq.answer)
      setCategory(selectedFaq.category)
      setOrder(selectedFaq.order.toString())
    } else {
      resetForm()
    }
  }, [selectedFaq])

  function resetForm() {
    setQuestion("")
    setAnswer("")
    setCategory("Бронирование")
    setOrder("0")
  }

  async function fetchFaqs() {
    try {
      const res = await fetch("/api/admin/faq")
      if (res.ok) {
        const data = await res.json()
        setFaqs(data || [])
      }
    } catch {
      toast.error("Ошибка загрузки FAQ")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = selectedFaq ? `/api/admin/faq/${selectedFaq.id}` : "/api/admin/faq"
      const method = selectedFaq ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          category,
          order: parseInt(order) || 0
        })
      })

      if (res.ok) {
        toast.success(selectedFaq ? "Вопрос успешно обновлен" : "Вопрос успешно добавлен")
        setSelectedFaq(null)
        resetForm()
        fetchFaqs()
      } else {
        toast.error("Ошибка сохранения")
      }
    } catch {
      toast.error("Ошибка сети")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteFaq(faq: FAQ) {
    if (!confirm(`Вы действительно хотите удалить вопрос "${faq.question.slice(0, 40)}..."?`)) return

    try {
      const res = await fetch(`/api/admin/faq/${faq.id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success("Вопрос удален")
        if (selectedFaq?.id === faq.id) setSelectedFaq(null)
        fetchFaqs()
      } else {
        toast.error("Ошибка удаления")
      }
    } catch {
      toast.error("Ошибка сети")
    }
  }

  // Filter FAQ
  const filteredFaqs = faqs.filter(faq => {
    return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A059]/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление контентом</span>
            <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Часто Задаваемые Вопросы (FAQ)</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Редактируйте информационные разделы помощи, создавайте новые подсказки для гостей.</p>
          </div>
        </div>

        {/* Filter & Actions Bar */}
        <div className="flex flex-wrap gap-4 items-center bg-[#151515] border border-white/5 p-4 rounded-xl shadow-md">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8C8C]" />
            <Input
              placeholder="Поиск по вопросам и ответам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C] text-sm h-10"
            />
          </div>
          {selectedFaq && (
            <Button 
              variant="outline"
              onClick={() => setSelectedFaq(null)}
              className="text-xs border-white/5 text-[#FAF9F6] hover:bg-[#1C1C1C]"
            >
              Создать новый вопрос
            </Button>
          )}
        </div>

        {/* Dynamic Split-Screen Layout */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            
            {/* Left Screen: 60% Width Questions List */}
            <div className="space-y-6 lg:col-span-6">
              {faqCategories.map((cat) => {
                const catFaqs = filteredFaqs.filter(f => f.category === cat)
                if (catFaqs.length === 0) return null

                return (
                  <div key={cat} className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-white/5 bg-[#181818] flex items-center justify-between">
                      <h3 className="font-serif text-[#C5A059] font-medium text-sm uppercase tracking-wider">{cat}</h3>
                      <Badge className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/15 text-xs font-semibold px-2 py-0.5">
                        {catFaqs.length} вопросов
                      </Badge>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                      {catFaqs.map((faq) => (
                        <div 
                          key={faq.id}
                          onClick={() => setSelectedFaq(faq)}
                          className={cn(
                            "p-5 hover:bg-white/[0.01] transition-all cursor-pointer flex justify-between items-start gap-4",
                            selectedFaq?.id === faq.id ? "bg-white/[0.02] border-l-2 border-l-[#C5A059]" : ""
                          )}
                        >
                          <div className="space-y-1.5 flex-1">
                            <h4 className="font-medium text-[#FAF9F6] text-sm flex items-center gap-2">
                              <span className="font-mono text-xs text-[#C5A059]">№{faq.order}</span>
                              {faq.question}
                            </h4>
                            <p className="text-xs text-[#8C8C8C] leading-relaxed line-clamp-2">{faq.answer}</p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedFaq(faq)}
                              className="text-[#8C8C8C] hover:text-[#FAF9F6] p-1.5 rounded"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteFaq(faq)}
                              className="text-[#8C8C8C] hover:text-rose-400 hover:bg-rose-950/20 p-1.5 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredFaqs.length === 0 && (
                <Card className="bg-[#151515] border-white/5 py-12 text-center">
                  <CardContent>
                    <p className="text-[#8C8C8C] text-sm">Ничего не найдено по вашему запросу.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Screen: 40% Width Detail/Form Panel */}
            <div className="lg:col-span-4 sticky top-6 bg-[#151515] border border-[#C5A059]/20 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="p-5 bg-[#181818] border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C5A059] animate-pulse" />
                  <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                    {selectedFaq ? "Редактировать FAQ" : "Новый вопрос FAQ"}
                  </span>
                </div>
                {selectedFaq && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFaq(null)}
                    className="hover:bg-white/5 text-[#8C8C8C] p-1.5 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Категория</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151515] border-white/5 text-[#FAF9F6]">
                      {faqCategories.map(cat => (
                        <SelectItem key={cat} value={cat} className="hover:bg-[#1A1A1A]">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Порядок сортировки</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="Например: 1"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Вопрос</Label>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Какое время заселения?"
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 h-10 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer" className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Ответ</Label>
                  <Textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Стандартное время заселения — с 14:00..."
                    className="bg-[#0E0E0E] border-white/5 text-[#FAF9F6] focus:border-[#C5A059]/40 placeholder:text-[#8C8C8C]/50 text-sm min-h-[140px]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#C5A059] text-[#0E0E0E] hover:bg-[#C5A059]/90 font-sans tracking-wide py-2.5" 
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {selectedFaq ? "Сохранить изменения" : "Добавить вопрос в FAQ"}
                  </Button>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
