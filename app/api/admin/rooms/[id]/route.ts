import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// DELETE - удалить комнату
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check if there are active bookings
    const bookingsCount = await prisma.booking.count({
      where: {
        roomId: id,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: "Невозможно удалить: есть активные бронирования" },
        { status: 400 }
      )
    }

    // Delete completed bookings first
    await prisma.booking.deleteMany({ where: { roomId: id } })
    await prisma.room.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 })
  }
}

// PUT - обновить статус комнаты
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { isClean, number } = await request.json()

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(isClean !== undefined && { isClean }),
        ...(number && { number }),
      },
    })

    return NextResponse.json({ room })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 })
  }
}
