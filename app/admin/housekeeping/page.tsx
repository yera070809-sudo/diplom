import { PrismaClient } from "@prisma/client";
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
import { revalidatePath } from "next/cache";
import { CheckCircle, AlertCircle, Clock, Users, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const prisma = new PrismaClient();

interface Room {
  id: string;
  number: string;
  isClean: boolean;
  type: {
    name: string;
  };
  bookings: {
    id: string;
    checkIn: Date;
    checkOut: Date;
    status: string;
    user: {
      name: string | null;
    };
  }[];
}

async function getRooms(): Promise<Room[]> {
  return await prisma.room.findMany({
    include: {
      type: true,
      bookings: {
        where: {
          OR: [
            { status: "CONFIRMED" },
            {
              status: "COMPLETED",
              checkOut: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
            }
          ]
        },
        include: {
          user: true
        },
        orderBy: { checkIn: 'desc' },
        take: 1
      }
    },
    orderBy: { number: 'asc' }
  });
}

async function toggleCleanStatus(roomId: string, currentStatus: boolean) {
  "use server"
  const prisma = new PrismaClient();
  await prisma.room.update({
    where: { id: roomId },
    data: { isClean: !currentStatus }
  });
  revalidatePath('/admin/housekeeping');
}

export default async function HousekeepingPage() {
  const rooms = await getRooms();

  const cleanRooms = rooms.filter(r => r.isClean);
  const dirtyRooms = rooms.filter(r => !r.isClean);
  const occupiedRooms = rooms.filter(r =>
    r.bookings.some(b => {
      const now = new Date();
      return b.status === "CONFIRMED" &&
        new Date(b.checkIn) <= now &&
        new Date(b.checkOut) >= now;
    })
  );

  return (
    <div className="bg-[#0E0E0E] min-h-screen text-[#FAF9F6] pb-16">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Title Section */}
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">Управление хозяйством</span>
          <h2 className="text-3xl font-serif text-[#FAF9F6] mt-2 font-medium tracking-wide">Уборка и сервис номеров</h2>
          <p className="text-[#8C8C8C] text-sm mt-1">Отслеживайте санитарное состояние комнат и координируйте хозяйственную службу.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#151515] border border-white/5 p-5 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Всего номеров</span>
              <h3 className="text-3xl font-serif text-[#FAF9F6] font-semibold mt-1">{rooms.length}</h3>
            </div>
            <div className="p-3 bg-[#FAF9F6]/5 rounded-lg">
              <Users className="h-5 w-5 text-[#FAF9F6]/60" />
            </div>
          </div>
          
          <div className="bg-[#151515] border border-white/5 p-5 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Готовы к заселению</span>
              <h3 className="text-3xl font-serif text-emerald-400 font-semibold mt-1">{cleanRooms.length}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-5 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Требуют уборки</span>
              <h3 className="text-3xl font-serif text-amber-400 font-semibold mt-1">{dirtyRooms.length}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 p-5 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8C8C8C] font-semibold">Занятые номера</span>
              <h3 className="text-3xl font-serif text-blue-400 font-semibold mt-1">{occupiedRooms.length}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Rooms needing cleaning alerts */}
        {dirtyRooms.length > 0 && (
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-6 shadow-[0_4px_25px_rgba(245,158,11,0.05)]">
            <div className="flex items-center gap-2 mb-4 border-b border-amber-500/10 pb-3">
              <ShieldAlert className="h-5 w-5 text-amber-400 animate-pulse" />
              <h3 className="text-lg font-serif text-amber-400 font-semibold tracking-wide">Необходима срочная уборка ({dirtyRooms.length})</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {dirtyRooms.map((room) => (
                <form key={room.id} action={toggleCleanStatus.bind(null, room.id, room.isClean)}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full h-24 flex flex-col gap-1.5 bg-[#151515] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-950/10 group rounded-xl p-3 text-center transition-all duration-300"
                  >
                    <span className="text-xl font-bold text-[#FAF9F6] group-hover:text-emerald-400 transition-colors">№{room.number}</span>
                    <span className="text-[10px] text-[#8C8C8C] truncate w-full font-medium">{room.type.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Готов ✓</span>
                  </Button>
                </form>
              ))}
            </div>
          </div>
        )}

        {/* All rooms list */}
        <div className="bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#181818] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-serif text-[#FAF9F6] font-medium tracking-wide">Санитарная сводка по комнатам</h3>
              <p className="text-xs text-[#8C8C8C] mt-1">Подробное расписание и текущее обслуживание комнат отеля.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#0E0E0E]/40 border-b border-white/5">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pl-6 font-semibold">Номер</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Категория</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Статус уборки</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 font-semibold">Текущий гость</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#8C8C8C] py-4 pr-6 text-right font-semibold">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const currentBooking = room.bookings.find(b => {
                    const now = new Date();
                    return b.status === "CONFIRMED" &&
                      new Date(b.checkIn) <= now &&
                      new Date(b.checkOut) >= now;
                  });

                  return (
                    <TableRow key={room.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                      <TableCell className="font-bold text-[#FAF9F6] pl-6 py-4 text-base">
                        Комната №{room.number}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-[#FAF9F6]">
                        {room.type.name}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          className={cn(
                            "px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border rounded-full transition-all duration-300 shadow-sm",
                            room.isClean 
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                              : "bg-amber-950/40 text-amber-400 border-amber-500/30 animate-pulse"
                          )}
                        >
                          {room.isClean ? "Готов" : "Уборка"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {currentBooking ? (
                          <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                            <Clock className="h-4 w-4" />
                            <span>{currentBooking.user.name || "Гость"}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#8C8C8C] tracking-wide">Свободен</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <form action={toggleCleanStatus.bind(null, room.id, room.isClean)}>
                          <Button 
                            type="submit"
                            variant="outline" 
                            size="sm"
                            className={cn(
                              "text-xs font-sans tracking-wide py-1.5 transition-all duration-300 border-white/5",
                              room.isClean 
                                ? "text-amber-400 hover:text-amber-300 hover:bg-amber-950/30" 
                                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                            )}
                          >
                            {room.isClean ? "Отметить грязным" : "Отметить готовым"}
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}
