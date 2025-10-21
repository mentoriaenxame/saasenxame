"use client";

import AuthenticatedLayout from "../dashboard/layout";
import { useState } from "react"
import { useCRM } from "@/lib/crm-context-db"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { EventList } from "@/components/calendar/event-list"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react"

export default function CalendarioPage() {
  return (
    <AuthenticatedLayout>
      <CalendarioContent />
    </AuthenticatedLayout>
  );
}

function CalendarioContent() {
  const { eventos, clientes } = useCRM()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  const filteredEventos = filterType === "all" ? eventos : eventos.filter((evento) => evento.tipo === filterType)

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
  }

  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Calendário</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus eventos e compromissos</p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Evento
          </Button>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-semibold capitalize min-w-[200px] text-center">{monthName}</h2>
            <Button variant="outline" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday}>
              Hoje
            </Button>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="reuniao">Reunião</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="deadline">Prazo</SelectItem>
              <SelectItem value="aniversario">Aniversário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid currentDate={currentDate} eventos={filteredEventos} onDayClick={handleDayClick} />

        {/* Event List */}
        <EventList eventos={filteredEventos} clientes={clientes} selectedDate={selectedDate} />
      </div>
    </div>
  )
}
