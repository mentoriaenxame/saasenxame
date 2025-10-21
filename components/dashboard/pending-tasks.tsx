"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Tarefa, Cliente } from "@/lib/types"
import { formatDate } from "@/lib/utils-crm"
import { useCRM } from "@/lib/crm-context-db"

interface PendingTasksProps {
  tarefas: Tarefa[]
  clientes: Cliente[]
}

export function PendingTasks({ tarefas, clientes }: PendingTasksProps) {
  const { updateTarefa } = useCRM()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pendingTasks = tarefas
    .filter((t) => !t.concluida && t.data_vencimento >= today)
    .sort((a, b) => a.data_vencimento.getTime() - b.data_vencimento.getTime())
    .slice(0, 8)

  const getClienteName = (clienteId: string) => {
    return clientes.find((c) => c.id === clienteId)?.nome || "Cliente desconhecido"
  }

  const handleToggle = (tarefaId: string, concluida: boolean) => {
    updateTarefa(tarefaId, { concluida })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas Pendentes</CardTitle>
        <p className="text-sm text-muted-foreground">Próximas atividades</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa pendente</p>
          ) : (
            pendingTasks.map((tarefa) => (
              <div key={tarefa.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                <Checkbox
                  checked={tarefa.concluida}
                  onCheckedChange={(checked) => handleToggle(tarefa.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{tarefa.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {getClienteName(tarefa.cliente_id)} • {formatDate(tarefa.data_vencimento)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
