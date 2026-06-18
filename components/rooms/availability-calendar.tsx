"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { startOfDay } from "date-fns"
import { ru } from "date-fns/locale"

interface AvailabilityCalendarProps {
    roomTypeId: string
}

export function AvailabilityCalendar({ roomTypeId }: AvailabilityCalendarProps) {
    const [bookedDates, setBookedDates] = React.useState<Date[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchBookedDates() {
            try {
                const response = await fetch(`/api/booked-dates?roomTypeId=${roomTypeId}`)
                if (response.ok) {
                    const data = await response.json()
                    // Convert string dates to Date objects
                    const dates = (data.bookedDates || []).map((dateStr: string) => {
                        // Fix parsing to avoid timezone issues
                        const [year, month, day] = dateStr.split('-').map(Number)
                        return new Date(year, month - 1, day)
                    })
                    setBookedDates(dates)
                }
            } catch (error) {
                console.error('Failed to fetch booked dates:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookedDates()
    }, [roomTypeId])

    return (
        <Card className="card-elevated">
            <CardHeader>
                <CardTitle className="text-lg">Календарь занятости</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="multiple"
                    selected={bookedDates}
                    modifiers={{
                        booked: bookedDates
                    }}
                    modifiersStyles={{
                        booked: {
                            textDecoration: "line-through",
                            color: "#9ca3af",
                            opacity: 0.5
                        }
                    }}
                    numberOfMonths={1}
                    disabled={(date) => date < startOfDay(new Date())}
                    locale={ru}
                    className="rounded-md border pointer-events-none"
                />
            </CardContent>
        </Card>
    )
}
