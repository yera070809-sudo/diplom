import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { role } = await request.json()

    if (!role || !["ADMIN", "STAFF", "GUEST"].includes(role)) {
      return NextResponse.json({ error: "Некорректная роль" }, { status: 400 })
    }

    // Prevent admin from removing their own admin role
    if (id === session.user.id && role !== "ADMIN") {
      return NextResponse.json({ error: "Нельзя понизить собственную роль" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Ошибка обновления роли" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json({ error: "Нельзя удалить собственный аккаунт" }, { status: 400 })
  }

  try {
    // Check if user has active bookings
    const bookingsCount = await prisma.booking.count({
      where: {
        userId: id,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    })

    if (bookingsCount > 0) {
      return NextResponse.json({ error: "Нельзя удалить пользователя с активными бронированиями" }, { status: 400 })
    }

    // Cascade delete bookings and reviews if any (completed or cancelled ones)
    await prisma.review.deleteMany({ where: { userId: id } })
    await prisma.booking.deleteMany({ where: { userId: id } })

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Ошибка удаления пользователя" }, { status: 500 })
  }
}
