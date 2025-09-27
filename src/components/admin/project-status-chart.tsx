"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ProjectStatusChartProps {
    data: {
        status: string;
        count: number;
    }[];
}

const chartConfig = {
    count: {
      label: "Proyectos",
      color: "hsl(var(--primary))",
    },
  }

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  return (
    <div className="h-64">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} accessibilityLayer>
                    <XAxis
                    dataKey="status"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    />
                     <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
