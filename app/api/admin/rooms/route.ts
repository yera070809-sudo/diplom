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
    const { typeId, number } = await request.json()

    // Check if room number already exists
    const existing = await prisma.room.findUnique({
      where: { number }
    })

    if (existing) {
      return NextResponse.json({ error: "Комната с таким номером уже существует" }, { status: 400 })
    }

    const room = await prisma.room.create({
      data: {
        typeId,
        number,
      },
    })

    return NextResponse.json({ room })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
