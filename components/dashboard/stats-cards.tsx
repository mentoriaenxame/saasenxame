"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Cliente } from "@/lib/types"
import { formatCurrency } from "@/lib/utils-crm"
import { Users, TrendingUp, DollarSign, Target } from "lucide-react"

interface StatsCardsProps {
  clientes: Cliente[]
}

export function StatsCards({ clientes }: StatsCardsProps) {
  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter((c) => c.status !== "perdido").length
  const totalReceita = clientes
    .filter((c) => c.status === "fechado-ganho")
    .reduce((sum, c) => sum + (c.valor_estimado || 0), 0)
  const taxaConversao = totalClientes > 0 ? ((clientesAtivos / totalClientes) * 100).toFixed(1) : "0"

  const stats = [
    {
      title: "Total de Clientes",
      value: totalClientes.toString(),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Clientes Ativos",
      value: clientesAtivos.toString(),
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Receita Total",
      value: formatCurrency(totalReceita),
      icon: DollarSign,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Taxa de Conversão",
      value: `${taxaConversao}%`,
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
