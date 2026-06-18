"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

interface CreateReviewResult {
    success: boolean
    error?: string
}

export async function createReview(
    bookingId: string,
    rating: number,
    comment: string
): Promise<CreateReviewResult> {
    const session = await auth()

    if (!session?.user?.email) {
        return { success: false, error: "Вы должны быть авторизованы" }
    }

    try {
        // 1. Verify booking exists, belongs to user, and is eligible
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                review: true
            }
        })

        if (!booking) {
            return { success: false, error: "Бронирование не найдено" }
        }

        if (booking.user.email !== session.user.email) {
            return { success: false, error: "Это не ваше бронирование" }
        }

        if (booking.status !== "COMPLETED") {
            return { success: false, error: "Можно оставить отзыв только после завершения проживания" }
        }

        if (booking.review) {
            return { success: false, error: "Вы уже оставили отзыв к этому бронированию" }
        }

        // 2. Create review
        await prisma.review.create({
            data: {
                bookingId: booking.id,
                userId: booking.userId,
                rating,
                comment: comment.trim() || null
            }
        })

        revalidatePath(`/my-bookings`)
        revalidatePath(`/rooms/${booking.roomId}`)

        return { success: true }
    } catch (error) {
        console.error("Failed to create review:", error)
        return { success: false, error: "Не удалось сохранить отзыв. Попробуйте позже." }
    }
}
