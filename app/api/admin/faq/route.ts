import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ error: "Ошибка загрузки FAQ" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { question, answer, category, order } = await request.json()

    if (!question || !answer || !category) {
      return NextResponse.json({ error: "Не все поля заполнены" }, { status: 400 })
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        order: parseInt(order) || 0
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return NextResponse.json({ error: "Ошибка создания FAQ" }, { status: 500 })
  }
}
