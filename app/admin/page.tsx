import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { CalendarDays, DollarSign, Home, Users, ArrowUpRight } from "lucide-react";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OccupancyChart } from "@/components/admin/occupancy-chart";
import { startOfMonth, subMonths, eachDayOfInterval, startOfDay, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const prisma = new PrismaClient();


async function getStats() {
  const [bookings, roomTypes, users] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: true,
        room: { include: { type: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.roomType.findMany({ include: { rooms: true } }),
    prisma.user.count({ where: { role: 'GUEST' } })
  ]);


  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const todayBookings = bookings.filter(b => {
    const today = new Date();
    const checkIn = new Date(b.checkIn);
    return checkIn.toDateString() === today.toDateString();
  });

  // Prepare chart data (last 30 days)
  const today = new Date();
  const last30Days = eachDayOfInterval({
    start: subMonths(today, 1),
    end: today
  });

  const revenueData = last30Days.map(day => {
    const dailyRevenue = bookings
      .filter(b => (b.status === 'CONFIRMED' || b.status === 'COMPLETED') && isSameDay(new Date(b.createdAt), day))
      .reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      name: format(day, "dd MMM", { locale: ru }),
      total: dailyRevenue
    };
  });

  const occupancyData = last30Days.map(day => {
    const dailyBookings = bookings.filter(b =>
      (b.status === 'CONFIRMED' || b.status === 'COMPLETED') &&
      isSameDay(new Date(b.checkIn), day)
    ).length;
    return {
      name: format(day, "dd MMM", { locale: ru }),
      count: dailyBookings
    };
  });

  return { bookings, roomTypes, users, totalRevenue, todayBookings, revenueData, occupancyData };
}

async function updateBookingStatus(bookingId: string, status: string) {
  "use server"
  const prisma = new PrismaClient();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
  revalidatePath('/admin');
}

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
};

export default async function AdminPage() {
  const { bookings, roomTypes, users, totalRevenue, todayBookings, revenueData, occupancyData } = await getStats();

  const totalRooms = roomTypes.reduce((sum, rt) => sum + rt.rooms.length, 0);

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-10">
        
        {/* Welcome Premium Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#C5A059]/15 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Консоль Управления</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Almaty Grand Hotel</h2>
            <p className="text-[#8C8C8C] text-sm mt-1">Добро пожаловать в панель администрирования гранд-отеля.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#151515] border border-white/5 rounded-lg px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs tracking-wider uppercase font-medium text-[#8C8C8C]">Система Активна •</span>
            <span className="text-xs font-semibold text-[#FAF9F6]">
              {format(new Date(), "dd MMMM yyyy, EEEE", { locale: ru })}
            </span>
          </div>
        </div>

        {/* Stats Cards with Golden Glows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-[#151515] border border-[#C5A059]/15 hover:border-[#C5A059]/40 p-6 rounded-xl shadow-[0_4px_20px_-5px_rgba(197,160,89,0.06)] hover:shadow-[0_4px_25px_-2px_rgba(197,160,89,0.12)] transition-all duration-300 group flex flex-col justify-between min-h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-medium">Общая выручка</span>
              <div className="p-2 bg-[#C5A059]/10 rounded-lg group-hover:bg-[#C5A059]/20 transition-colors">
                <DollarSign className="h-4 w-4 text-[#C5A059]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {totalRevenue.toLocaleString('ru-KZ')} ₸
              </div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +12.4% за месяц
              </span>
            </div>
          </div>

          <div className="bg-[#151515] border border-[#C5A059]/15 hover:border-[#C5A059]/40 p-6 rounded-xl shadow-[0_4px_20px_-5px_rgba(197,160,89,0.06)] hover:shadow-[0_4px_25px_-2px_rgba(197,160,89,0.12)] transition-all duration-300 group flex flex-col justify-between min-h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-medium">Бронирования</span>
              <div className="p-2 bg-[#C5A059]/10 rounded-lg group-hover:bg-[#C5A059]/20 transition-colors">
                <CalendarDays className="h-4 w-4 text-[#C5A059]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {bookings.length}
              </div>
              <span className="text-xs text-[#8C8C8C] block mt-1">
                Заездов сегодня: <strong className="text-[#C5A059] font-medium">{todayBookings.length}</strong>
              </span>
            </div>
          </div>

          <div className="bg-[#151515] border border-[#C5A059]/15 hover:border-[#C5A059]/40 p-6 rounded-xl shadow-[0_4px_20px_-5px_rgba(197,160,89,0.06)] hover:shadow-[0_4px_25px_-2px_rgba(197,160,89,0.12)] transition-all duration-300 group flex flex-col justify-between min-h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-medium">Номера в системе</span>
              <div className="p-2 bg-[#C5A059]/10 rounded-lg group-hover:bg-[#C5A059]/20 transition-colors">
                <Home className="h-4 w-4 text-[#C5A059]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {totalRooms}
              </div>
              <span className="text-xs text-[#8C8C8C] block mt-1">
                Разделены на <strong className="text-[#FAF9F6] font-medium">{roomTypes.length} категорий</strong>
              </span>
            </div>
          </div>

          <div className="bg-[#151515] border border-[#C5A059]/15 hover:border-[#C5A059]/40 p-6 rounded-xl shadow-[0_4px_20px_-5px_rgba(197,160,89,0.06)] hover:shadow-[0_4px_25px_-2px_rgba(197,160,89,0.12)] transition-all duration-300 group flex flex-col justify-between min-h-[130px]">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-medium">Зарегистрировано Гостей</span>
              <div className="p-2 bg-[#C5A059]/10 rounded-lg group-hover:bg-[#C5A059]/20 transition-colors">
                <Users className="h-4 w-4 text-[#C5A059]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-serif text-[#FAF9F6] font-semibold tracking-wide">
                {users}
              </div>
              <span className="text-xs text-[#8C8C8C] block mt-1">
                Активных учетных записей
              </span>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <RevenueChart data={revenueData} />
          <OccupancyChart data={occupancyData} />
        </div>

        {/* Bookings Premium Table */}
        <div className="bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181818]">
            <div>
              <h3 className="text-lg font-serif text-[#FAF9F6] font-medium tracking-wide">Последние Бронирования</h3>
              <p className="text-xs text-[#8C8C8C] mt-1">Список 10 последних операций в системе.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">ID брони</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Гость</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Номер</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Период</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Сумма</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Статус</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 10).map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8C8C8C] pl-6 py-4">
                      #{booking.id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium text-[#FAF9F6] text-sm">{booking.user.name}</div>
                      <div className="text-xs text-[#8C8C8C] mt-0.5">{booking.user.email}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-[#FAF9F6]">{booking.room.type.name}</div>
                      <div className="text-xs text-[#C5A059] mt-0.5 font-medium">Комната №{booking.room.number}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-[#FAF9F6]">
                        {format(booking.checkIn, 'dd MMM', { locale: ru })} — {format(booking.checkOut, 'dd MMM yyyy', { locale: ru })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-[#FAF9F6] text-sm">
                      {booking.totalPrice.toLocaleString('ru-KZ')} ₸
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={cn(
                          "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full transition-all duration-300 shadow-sm",
                          booking.status === 'CONFIRMED' && "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
                          booking.status === 'CANCELLED' && "bg-rose-950/40 text-rose-400 border-rose-500/30",
                          booking.status === 'COMPLETED' && "bg-blue-950/40 text-blue-400 border-blue-500/30",
                          booking.status === 'PENDING' && "bg-amber-950/40 text-amber-400 border-amber-500/30"
                        )}
                      >
                        {statusLabels[booking.status] || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex gap-2 justify-end">
                        {booking.status === 'CONFIRMED' && (
                          <form action={updateBookingStatus.bind(null, booking.id, 'COMPLETED')}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#0E0E0E] text-[#C5A059] transition-all duration-300 font-sans tracking-wide py-1.5"
                            >
                              Выезд
                            </Button>
                          </form>
                        )}
                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <form action={updateBookingStatus.bind(null, booking.id, 'CANCELLED')}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-300 font-sans tracking-wide py-1.5"
                            >
                              Отмена
                            </Button>
                          </form>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-[#8C8C8C]">
                      Бронирований пока нет
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}

