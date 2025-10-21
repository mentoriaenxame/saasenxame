"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Cliente } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { statusLabels } from "@/lib/utils-crm"

interface PipelineChartProps {
  clientes: Cliente[]
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#6b7280"]

export function PipelineChart({ clientes }: PipelineChartProps) {
  const statusCounts = clientes.reduce(
    (acc, cliente) => {
      acc[cliente.status] = (acc[cliente.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: statusLabels[status as keyof typeof statusLabels],
    value: count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição do Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
