import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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

    const roomType = await prisma.roomType.create({
      data: {
        name,
        description,
        price,
        capacity,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images),
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
    console.error("Error creating room type:", error)
    return NextResponse.json({ error: "Failed to create room type" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      include: {
        rooms: {
          include: {
            bookings: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ roomTypes })
  } catch (error) {
    console.error("Error fetching room types:", error)
    return NextResponse.json({ error: "Failed to fetch room types" }, { status: 500 })
  }
}
