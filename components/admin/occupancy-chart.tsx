"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OccupancyChartProps {
    data: {
        name: string
        count: number
    }[]
}

export function OccupancyChart({ data }: OccupancyChartProps) {
    return (
        <Card className="col-span-4 lg:col-span-3 bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
            <CardHeader className="p-6 border-b border-white/5 bg-[#181818]">
                <CardTitle className="text-base font-serif font-medium tracking-wide text-[#FAF9F6]">
                    Загруженность номеров
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                stroke="#8C8C8C"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#8C8C8C"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-white/10 bg-[#1A1A1A] p-3 shadow-2xl">
                                                <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C] block mb-1">
                                                    Бронирований
                                                </span>
                                                <span className="font-serif font-semibold text-[#C5A059] text-base">
                                                    {payload[0].value}
                                                </span>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#C5A059"
                                strokeWidth={2.5}
                                activeDot={{ r: 6, fill: '#FAF9F6', stroke: '#C5A059', strokeWidth: 2 }}
                                dot={{ r: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

