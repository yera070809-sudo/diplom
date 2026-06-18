import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        room: { include: { type: { select: { name: true } } } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { roomId, guestEmail, guestName, guestPhone, checkIn, checkOut, totalPrice, status, paymentStatus } = json

    if (!roomId || !checkIn || !checkOut || !guestName || !guestPhone) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Дата выезда должна быть позже даты заезда" }, { status: 400 })
    }

    // Verify room availability
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: "CANCELLED" },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json({ error: "Эта комната уже забронирована на выбранные даты" }, { status: 400 })
    }

    // Find or create user
    const email = guestEmail?.trim() || `${guestPhone.replace(/\D/g, "")}@no-email.temp`
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: guestName,
          phone: guestPhone,
          password: Math.random().toString(36).slice(-8),
          role: "GUEST"
        }
      })
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: parseFloat(totalPrice) || 0,
        status: status || "CONFIRMED",
        paymentStatus: paymentStatus || "UNPAID"
      },
      include: {
        user: { select: { name: true, email: true } },
        room: { include: { type: { select: { name: true } } } }
      }
    })

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Ошибка создания бронирования" }, { status: 500 })
  }
}
