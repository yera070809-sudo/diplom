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
    const { question, answer, category, order } = await request.json()

    const updated = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        order: parseInt(order) || 0
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating FAQ:", error)
    return NextResponse.json({ error: "Ошибка обновления FAQ" }, { status: 500 })
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

  try {
    await prisma.fAQ.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    return NextResponse.json({ error: "Ошибка удаления FAQ" }, { status: 500 })
  }
}
