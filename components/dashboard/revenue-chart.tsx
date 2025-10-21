"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Cliente } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  clientes: Cliente[]
}

export function RevenueChart({ clientes }: RevenueChartProps) {
  // Group revenue by month
  const revenueByMonth = clientes
    .filter((c) => c.status === "fechado-ganho")
    .reduce(
      (acc, cliente) => {
        const month = (cliente.criado_em instanceof Date ? cliente.criado_em : new Date()).toLocaleDateString("pt-BR", { month: "short" })
        acc[month] = (acc[month] || 0) + (cliente.valor_estimado || 0)
        return acc
      },
      {} as Record<string, number>,
    )

  const data = Object.entries(revenueByMonth).map(([month, value]) => ({
    month,
    receita: value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
