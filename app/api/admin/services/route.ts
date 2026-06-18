import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description, price } = await request.json()

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
      },
    })

    return NextResponse.json({ service })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Ошибка создания" }, { status: 500 })
  }
}
