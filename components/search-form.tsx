"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Search, Users } from "lucide-react"
import { DateRange } from "react-day-picker"
import { ru } from "date-fns/locale"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = React.useState<DateRange | undefined>()
  const [guests, setGuests] = React.useState(searchParams.get("guests") || "2")

  function handleSearch() {
    const params = new URLSearchParams()
    if (date?.from) params.set("checkIn", date.from.toISOString())
    if (date?.to) params.set("checkOut", date.to.toISOString())
    if (guests) params.set("guests", guests)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 -mt-8 relative z-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Date Range Picker */}
        <div className="lg:col-span-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Даты заезда и выезда</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM", { locale: ru })} - {format(date.to, "dd MMM", { locale: ru })}
                    </>
                  ) : (
                    format(date.from, "dd MMM yyyy", { locale: ru })
                  )
                ) : (
                  <span>Выберите даты</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="lg:col-span-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Гости</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="h-12">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Гости" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 гость</SelectItem>
              <SelectItem value="2">2 гостя</SelectItem>
              <SelectItem value="3">3 гостя</SelectItem>
              <SelectItem value="4">4 гостя</SelectItem>
              <SelectItem value="5">5+ гостей</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-3">
          <Button onClick={handleSearch} className="w-full h-12 btn-premium">
            <Search className="mr-2 h-4 w-4" />
            Найти
          </Button>
        </div>
      </div>
    </div>
  )
}
