"use client"

import type React from "react"

import type { Cliente, LeadStatus } from "@/lib/types"
import { KanbanCard } from "./kanban-card"
import { formatCurrency } from "@/lib/utils-crm"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  title: string
  status: LeadStatus
  clientes: Cliente[]
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: LeadStatus) => void
  onDragStart: (e: React.DragEvent, cliente: Cliente) => void
  onCardClick: (cliente: Cliente) => void
  onAddClick: (status: LeadStatus) => void
}

export function KanbanColumn({
  title,
  status,
  clientes,
  onDragOver,
  onDrop,
  onDragStart,
  onCardClick,
  onAddClick,
}: KanbanColumnProps) {
  const totalValue = clientes.reduce((sum, c) => sum + (c.valor_estimado || 0), 0)

  return (
    <div className="flex flex-col h-full min-w-[320px] bg-muted/30 rounded-lg p-4">
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
          <span className="text-xs font-medium bg-background px-2 py-1 rounded-full">{clientes.length}</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">{formatCurrency(totalValue)}</p>
      </div>

      {/* Cards Container */}
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
        className="flex-1 space-y-3 overflow-y-auto min-h-[200px]"
      >
        {clientes.map((cliente) => (
          <KanbanCard key={cliente.id} cliente={cliente} onDragStart={onDragStart} onClick={onCardClick} />
        ))}
      </div>

      {/* Add Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => onAddClick(status)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Lead
      </Button>
    </div>
  )
}
