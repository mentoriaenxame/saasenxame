"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Cliente } from "@/lib/types"
import { formatCurrency, getInitials, getAvatarColor } from "@/lib/utils-crm"

interface TopClientsProps {
  clientes: Cliente[]
}

export function TopClients({ clientes }: TopClientsProps) {
  const topClients = clientes
    .filter((c) => c.status === "fechado-ganho")
    .sort((a, b) => (b.valor_estimado || 0) - (a.valor_estimado || 0))
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClients.map((cliente) => (
            <div key={cliente.id} className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-full ${getAvatarColor(cliente.nome)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
              >
                {getInitials(cliente.nome)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cliente.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{cliente.empresa}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(cliente.valor_estimado || 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
