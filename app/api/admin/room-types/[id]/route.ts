import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// GET - получить категорию
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            bookings: true
          }
        }
      }
    })

    if (!roomType) {
      return NextResponse.json({ error: "Категория не найдена" }, { status: 404 })
    }

    return NextResponse.json(roomType)
  } catch (error) {
    console.error("Error fetching room type:", error)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}

// PUT - обновить категорию
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
    const {
      name,
      description,
      price,
      capacity,
      amenities,
      images,
      area,
      bed,
      view,
      breakfast,
      features,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      childrenPolicy,
      petsPolicy
    } = await request.json()

    const roomType = await prisma.roomType.update({
      where: { id },
      data: {
        name,
        description,
        price,
        capacity,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images || []),
        area,
        bed,
        view,
        breakfast,
        features: features ? JSON.stringify(features) : JSON.stringify([]),
        checkInTime,
        checkOutTime,
        cancellationPolicy,
        childrenPolicy,
        petsPolicy
      },
    })

    return NextResponse.json({ roomType })
  } catch (error) {
    console.error("Error updating room type:", error)
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 })
  }
}

// DELETE - удалить категорию
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
    // Check if there are bookings for rooms in this category
    const bookingsCount = await prisma.booking.count({
      where: {
        room: { typeId: id },
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: "Невозможно удалить: есть активные бронирования" },
        { status: 400 }
      )
    }

    // Delete rooms first, then room type
    await prisma.room.deleteMany({ where: { typeId: id } })
    await prisma.roomType.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room type:", error)
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 })
  }
}
