"use client"

import type { Evento, Cliente } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

interface EventListProps {
  eventos: Evento[]
  clientes: Cliente[]
  selectedDate: Date | null
}

const eventTypeLabels = {
  reuniao: "Reunião",
  "follow-up": "Follow-up",
  deadline: "Prazo",
  aniversario: "Aniversário",
}

const eventTypeColors = {
  reuniao: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "follow-up": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  deadline: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  aniversario: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
}

export function EventList({ eventos, clientes, selectedDate }: EventListProps) {
  const filteredEventos = selectedDate
    ? eventos.filter((evento) => {
        const eventoDate = new Date(evento.data)
        return (
          eventoDate.getDate() === selectedDate.getDate() &&
          eventoDate.getMonth() === selectedDate.getMonth() &&
          eventoDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : eventos.filter((evento) => new Date(evento.data) >= new Date()).slice(0, 10)

  const sortedEventos = filteredEventos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  const getClienteName = (clienteId?: string) => {
    if (!clienteId) return null
    return clientes.find((c) => c.id === clienteId)?.nome
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDate
            ? `Eventos - ${selectedDate.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`
            : "Próximos Eventos"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEventos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum evento nesta data</p>
          ) : (
            sortedEventos.map((evento) => {
              const clienteName = getClienteName(evento.cliente_id)
              return (
                <div key={evento.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-[60px]">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {new Date(evento.data).getDate()}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {new Date(evento.data).toLocaleDateString("pt-BR", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold">{evento.titulo}</h4>
                      <Badge className={eventTypeColors[evento.tipo]}>{eventTypeLabels[evento.tipo]}</Badge>
                    </div>
                    {evento.descricao && <p className="text-sm text-muted-foreground mb-2">{evento.descricao}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(evento.data).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {clienteName && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {clienteName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
