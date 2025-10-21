"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Atividade, Cliente } from "@/lib/types"
import { formatDateTime } from "@/lib/utils-crm"
import { Mail, Phone, Calendar, FileText } from "lucide-react"

interface RecentActivitiesProps {
  atividades: Atividade[]
  clientes: Cliente[]
}

const activityIcons = {
  email: Mail,
  ligacao: Phone,
  reuniao: Calendar,
  nota: FileText,
}

export function RecentActivities({ atividades, clientes }: RecentActivitiesProps) {
  const recentActivities = atividades.sort((a, b) => 
    (b.criado_em instanceof Date ? b.criado_em.getTime() : new Date().getTime()) - 
    (a.criado_em instanceof Date ? a.criado_em.getTime() : new Date().getTime())
  ).slice(0, 10)

  const getClienteName = (clienteId: string) => {
    return clientes.find((c) => c.id === clienteId)?.nome || "Cliente desconhecido"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <p className="text-sm text-muted-foreground">Últimas 10 interações</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((atividade) => {
            const Icon = activityIcons[atividade.tipo]
            return (
              <div key={atividade.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{getClienteName(atividade.cliente_id)}</p>
                  <p className="text-sm text-muted-foreground truncate">{atividade.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {atividade.criado_por} • {formatDateTime(atividade.criado_em instanceof Date ? atividade.criado_em : new Date())}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
