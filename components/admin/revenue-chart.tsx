"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface RevenueChartProps {
    data: {
        name: string
        total: number
    }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-4 bg-[#151515] border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
            <CardHeader className="p-6 border-b border-white/5 bg-[#181818]">
                <CardTitle className="text-base font-serif font-medium tracking-wide text-[#FAF9F6]">
                    Выручка за 30 дней
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C5A059" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#C5A059" stopOpacity={0.15} />
                                </linearGradient>
                            </defs>
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
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-white/10 bg-[#1A1A1A] p-3 shadow-2xl">
                                                <span className="text-[10px] uppercase tracking-wider text-[#8C8C8C] block mb-1">
                                                    Выручка
                                                </span>
                                                <span className="font-serif font-semibold text-[#C5A059] text-base">
                                                    {payload[0].value?.toLocaleString('ru-KZ')} ₸
                                                </span>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="url(#revenueGradient)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

