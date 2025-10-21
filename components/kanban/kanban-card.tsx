"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import type { Cliente } from "@/lib/types"
import { formatCurrency, getInitials, getAvatarColor, prioridadeColors } from "@/lib/utils-crm"
import { AlertCircle, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KanbanCardProps {
  cliente: Cliente
  onDragStart: (e: React.DragEvent, cliente: Cliente) => void
  onClick: (cliente: Cliente) => void
}

export function KanbanCard({ cliente, onDragStart, onClick }: KanbanCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, cliente)}
      onClick={() => onClick(cliente)}
      className="p-4 cursor-move hover:shadow-lg transition-shadow bg-card"
    >
      <div className="space-y-3">
        {/* Header with avatar and priority */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-10 w-10 rounded-full ${getAvatarColor(cliente.nome)} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {getInitials(cliente.nome)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{cliente.nome}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Building2 className="h-3 w-3" />
                {cliente.empresa}
              </p>
            </div>
          </div>
          <AlertCircle className={`h-4 w-4 flex-shrink-0 ${prioridadeColors[cliente.prioridade || 'media']}`} />
        </div>

        {/* Value */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(cliente.valor_estimado || 0)}
          </span>
        </div>

        {/* Tags and origin */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {cliente.origem.replace(/-/g, " ")}
          </Badge>
          {cliente.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground">Criado em {(cliente.criado_em instanceof Date ? cliente.criado_em : new Date()).toLocaleDateString("pt-BR")}</p>
      </div>
    </Card>
  )
}
