import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { format } from "date-fns"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "bookings"

  try {
    if (type === "bookings") {
      const bookings = await prisma.booking.findMany({
        include: {
          user: { select: { name: true, email: true } },
          room: { include: { type: true } }
        },
        orderBy: { createdAt: "desc" }
      })

      const statusLabels: Record<string, string> = {
        PENDING: "Ожидает",
        CONFIRMED: "Подтверждено",
        COMPLETED: "Завершено",
        CANCELLED: "Отменено"
      }

      // Generate CSV
      const headers = ["ID", "Дата создания", "Гость", "Email", "Номер", "Категория", "Заезд", "Выезд", "Сумма", "Статус"]
      const rows = bookings.map(b => [
        b.id,
        format(new Date(b.createdAt), "dd.MM.yyyy HH:mm"),
        b.user.name || "-",
        b.user.email,
        b.room.number,
        b.room.type.name,
        format(new Date(b.checkIn), "dd.MM.yyyy"),
        format(new Date(b.checkOut), "dd.MM.yyyy"),
        b.totalPrice.toString(),
        statusLabels[b.status] || b.status
      ])

      const csv = [
        headers.join(";"),
        ...rows.map(row => row.join(";"))
      ].join("\n")

      // Add BOM for Excel to recognize UTF-8
      const bom = "\uFEFF"
      
      return new NextResponse(bom + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bookings_${format(new Date(), "yyyy-MM-dd")}.csv"`
        }
      })
    }

    if (type === "guests") {
      const users = await prisma.user.findMany({
        where: { role: "GUEST" },
        include: {
          bookings: true
        },
        orderBy: { createdAt: "desc" }
      })

      const headers = ["ID", "Имя", "Email", "Телефон", "Бронирований", "Дата регистрации"]
      const rows = users.map(u => [
        u.id,
        u.name || "-",
        u.email,
        u.phone || "-",
        u.bookings.length.toString(),
        format(new Date(u.createdAt), "dd.MM.yyyy")
      ])

      const csv = [
        headers.join(";"),
        ...rows.map(row => row.join(";"))
      ].join("\n")

      const bom = "\uFEFF"
      
      return new NextResponse(bom + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="guests_${format(new Date(), "yyyy-MM-dd")}.csv"`
        }
      })
    }

    return NextResponse.json({ error: "Unknown export type" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
