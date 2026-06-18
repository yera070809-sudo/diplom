import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  if (!start || !end) {
    return NextResponse.json({ error: "Start and end dates required" }, { status: 400 })
  }

  try {
    const rooms = await prisma.room.findMany({
      include: {
        type: { select: { id: true, name: true, price: true } },
        bookings: {
          where: {
            OR: [
              {
                checkIn: { lte: new Date(end) },
                checkOut: { gte: new Date(start) }
              }
            ]
          },
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: [
        { type: { name: "asc" } },
        { number: "asc" }
      ]
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching calendar:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
