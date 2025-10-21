"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Atividade } from "@/lib/types"
import { formatDateTime } from "@/lib/utils-crm"
import { FileText, Phone, Mail, Calendar } from "lucide-react"

interface RecentActivityProps {
  atividades: Atividade[]
}

const activityIcons = {
  email: Mail,
  ligacao: Phone,
  reuniao: Calendar,
  nota: FileText,
}

export function RecentActivity({ atividades }: RecentActivityProps) {
  const recentActivities = atividades.sort((a, b) => 
    (b.criado_em instanceof Date ? b.criado_em.getTime() : new Date().getTime()) - 
    (a.criado_em instanceof Date ? a.criado_em.getTime() : new Date().getTime())
  ).slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((atividade) => {
            const Icon = activityIcons[atividade.tipo]
            return (
              <div key={atividade.id} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{atividade.tipo}</p>
                  <p className="text-sm text-muted-foreground truncate">{atividade.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDateTime(atividade.criado_em instanceof Date ? atividade.criado_em : new Date())}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
