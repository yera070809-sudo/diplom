'use server'

import { PrismaClient } from '@prisma/client'
import { sendBookingConfirmation } from '@/lib/email'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

interface CreateBookingParams {
  roomTypeId: string
  checkIn: Date
  checkOut: Date
  totalPrice: number
  guestName: string
  guestPhone: string
  extras?: string[]
}

export async function createBooking({
  roomTypeId,
  checkIn,
  checkOut,
  totalPrice,
  guestName,
  guestPhone,
  extras = [],
}: CreateBookingParams) {
  try {
    // Серверная валидация

    // 1. Проверка обязательных полей
    if (!roomTypeId || !checkIn || !checkOut || !guestName || !guestPhone) {
      return { success: false, error: 'Все поля обязательны для заполнения' }
    }

    // 2. Валидация имени
    if (guestName.trim().length < 2) {
      return { success: false, error: 'Имя должно содержать минимум 2 символа' }
    }

    // 3. Валидация телефона
    // Простой регэксп для телефона: допускает +, цифры, пробелы, дефисы, скобки
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    // Удаляем все не-цифровые символы для проверки длины
    const cleanPhone = guestPhone.replace(/\D/g, '')

    if (cleanPhone.length < 10) {
      return { success: false, error: 'Введите корректный номер телефона' }
    }

    // 4. Валидация дат
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return { success: false, error: 'Дата заезда не может быть в прошлом' }
    }

    if (checkOutDate <= checkInDate) {
      return { success: false, error: 'Дата выезда должна быть позже даты заезда' }
    }

    const daysDifference = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDifference < 1) {
      return { success: false, error: 'Минимальное количество ночей - 1' }
    }

    // 5. Проверка существования типа номера
    const roomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId }
    })

    if (!roomType) {
      return { success: false, error: 'Выбранная категория номера не найдена' }
    }

    // 6. Find or create user
    const session = await auth()
    let user = null

    if (session?.user?.email) {
      // Ищем авторизованного пользователя по email
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      // Если пользователь найден, при необходимости обновляем его имя и телефон
      if (user) {
        const updateData: { phone?: string; name?: string } = {}
        if (!user.phone) updateData.phone = guestPhone
        if (!user.name) updateData.name = guestName

        if (Object.keys(updateData).length > 0) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: updateData
          })
        }
      }
    }

    if (!user) {
      // Ищем пользователя по телефону, если не авторизован
      user = await prisma.user.findFirst({
        where: { phone: guestPhone },
      })
    }

    if (!user) {
      // Создаем пользователя с placeholder email
      const placeholderEmail = `${cleanPhone}@no-email.temp`

      // Проверяем, не занят ли этот email (маловероятно, но для надежности)
      const existingEmail = await prisma.user.findUnique({ where: { email: placeholderEmail } })

      user = await prisma.user.create({
        data: {
          email: existingEmail ? `${placeholderEmail}.${Date.now()}` : placeholderEmail,
          phone: guestPhone,
          name: guestName,
          password: Math.random().toString(36).slice(-8), // Temporary password
          role: 'GUEST',
        },
      })
    }

    // 7. Find available room of this type
    // A room is available if it has NO bookings that overlap with the requested dates
    // Два диапазона дат пересекаются если:
    // (StartA <= EndB) AND (EndA >= StartB)

    // Сначала найдем все номера этого типа
    const allRooms = await prisma.room.findMany({
      where: {
        typeId: roomTypeId,
      },
      include: {
        type: true,
        bookings: {
          where: {
            status: { not: 'CANCELLED' },
            // Проверяем пересечение дат
            AND: [
              { checkIn: { lt: checkOutDate } },  // Существующее бронирование начинается до нашего окончания
              { checkOut: { gt: checkInDate } }   // Существующее бронирование заканчивается после нашего начала
            ]
          }
        }
      }
    })

    console.log(`[Booking] Checking availability for ${checkInDate.toISOString()} to ${checkOutDate.toISOString()}`)
    console.log(`[Booking] Found ${allRooms.length} rooms of type ${roomTypeId}`)

    // Находим номер без конфликтующих бронирований
    const availableRoom = allRooms.find(room => room.bookings.length === 0)

    if (!availableRoom) {
      const conflictingBookings = allRooms.flatMap(room => room.bookings)
      return { success: false, error: 'К сожалению, на выбранные даты нет свободных номеров этой категории.' }
    }

    console.log(`[Booking] Found available room: ${availableRoom.number} (ID: ${availableRoom.id})`)

    // 8. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: availableRoom.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        extras: JSON.stringify(extras),
        status: 'CONFIRMED', // Auto-confirm for demo
      },
    })

    // 9. Skip email confirmation for phone-only users
    // try { ... } catch ...

    revalidatePath('/my-bookings')
    revalidatePath('/admin/bookings')

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error('Booking error:', error)
    return { success: false, error: 'Произошла ошибка при создании бронирования. Пожалуйста, попробуйте позже.' }
  }
}
