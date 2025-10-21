"use client"

import { useMemo } from "react"
import type { Evento } from "@/lib/types"

interface CalendarGridProps {
  currentDate: Date
  eventos: Evento[]
  onDayClick: (date: Date) => void
}

const eventTypeColors = {
  reuniao: "bg-blue-500",
  "follow-up": "bg-purple-500",
  deadline: "bg-orange-500",
  aniversario: "bg-pink-500",
}

export function CalendarGrid({ currentDate, eventos, onDayClick }: CalendarGridProps) {
  const { days, firstDayOfMonth, daysInMonth } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const firstDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return { days, firstDayOfMonth: firstDay, daysInMonth }
  }, [currentDate])

  const getEventsForDay = (date: Date | null) => {
    if (!date) return []
    return eventos.filter((evento) => {
      const eventoDate = new Date(evento.data)
      return (
        eventoDate.getDate() === date.getDate() &&
        eventoDate.getMonth() === date.getMonth() &&
        eventoDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
      {/* Weekday headers */}
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
        <div key={day} className="bg-muted p-3 text-center text-sm font-semibold">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((date, index) => {
        const dayEvents = getEventsForDay(date)
        const isCurrentDay = isToday(date)

        return (
          <div
            key={index}
            onClick={() => date && onDayClick(date)}
            className={`bg-card min-h-[120px] p-2 ${date ? "cursor-pointer hover:bg-muted/50" : ""} transition-colors`}
          >
            {date && (
              <>
                <div className="flex items-center justify-center mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentDay ? "bg-blue-600 text-white h-7 w-7 rounded-full flex items-center justify-center" : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((evento) => (
                    <div
                      key={evento.id}
                      className={`text-xs px-2 py-1 rounded ${eventTypeColors[evento.tipo]} text-white truncate`}
                    >
                      {evento.titulo}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 3} mais</div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
