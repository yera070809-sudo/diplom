import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { subDays, eachDayOfInterval, format } from "date-fns"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "30")

  const startDate = subDays(new Date(), days)

  try {
    // Get all bookings in period
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: "CANCELLED" }
      },
      include: {
        room: { include: { type: true } }
      }
    })

    // Get all bookings for status counts
    const allBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: startDate } }
    })

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: { createdAt: { gte: startDate } }
    })

    // Get rooms count
    const roomsCount = await prisma.room.count()

    // Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const bookingsCount = bookings.length
    const averageBookingValue = bookingsCount > 0 ? totalRevenue / bookingsCount : 0

    // Calculate occupancy rate
    const totalNights = bookings.reduce((sum, b) => {
      const nights = Math.ceil(
        (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      )
      return sum + nights
    }, 0)
    const possibleNights = roomsCount * days
    const occupancyRate = possibleNights > 0 ? (totalNights / possibleNights) * 100 : 0

    // Calculate avg rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    // Top room types
    const roomTypeStats: Record<string, { name: string; count: number; revenue: number }> = {}
    bookings.forEach(b => {
      const name = b.room.type.name
      if (!roomTypeStats[name]) {
        roomTypeStats[name] = { name, count: 0, revenue: 0 }
      }
      roomTypeStats[name].count++
      roomTypeStats[name].revenue += b.totalPrice
    })
    const topRoomTypes = Object.values(roomTypeStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Revenue by day
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() })
    const revenueByDay = dateRange.map(date => {
      const dayBookings = bookings.filter(b => 
        format(new Date(b.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      return {
        date: format(date, 'yyyy-MM-dd'),
        revenue: dayBookings.reduce((sum, b) => sum + b.totalPrice, 0)
      }
    })

    // Bookings by status
    const statusCounts: Record<string, number> = {}
    allBookings.forEach(b => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
    })
    const bookingsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }))

    return NextResponse.json({
      totalRevenue,
      bookingsCount,
      averageBookingValue,
      occupancyRate,
      avgRating,
      reviewsCount: reviews.length,
      topRoomTypes,
      revenueByDay,
      bookingsByStatus
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
