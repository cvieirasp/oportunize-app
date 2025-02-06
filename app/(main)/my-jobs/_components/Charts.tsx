"use client"

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartProps {
  data: { name: string, value: number }[]
}

const ChartBar = ({ data }: ChartProps) => {
  const chartConfig = {
    value: {
      label: "Vagas Postadas esse ano",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={
          <ChartTooltipContent formatter={(value) => `${value} vagas`} />
        } />
        <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

const ChartPie = ({ data }: ChartProps) => {
  const chartConfig = {
    name: {
      label: "Status",
    }
  } satisfies ChartConfig

  const COLORS = ["hsl(var(--chart-1)", "hsl(var(--chart-2)", "hsl(var(--chart-3)"]

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <Pie data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
        </Pie>
        <ChartTooltip content={
          <ChartTooltipContent formatter={(value) => `${value} vagas`} />
        } />
      </PieChart>
    </ChartContainer>
  )
}

export { ChartBar, ChartPie }
