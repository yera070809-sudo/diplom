import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const since = searchParams.get("since")

  try {
    const where: Prisma.BookingWhereInput = {
      status: "PENDING"
    }

    if (since) {
      where.createdAt = {
        gt: new Date(since)
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        },
        room: {
          include: {
            type: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    const pendingCount = await prisma.booking.count({
      where: { status: "PENDING" }
    })

    return NextResponse.json({
      bookings,
      pendingCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
