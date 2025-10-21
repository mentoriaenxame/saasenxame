"use client";

import AuthenticatedLayout from "../dashboard/layout";
import type React from "react"
import { useState } from "react"
import { useCRM } from "@/lib/crm-context-db"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import type { Cliente, LeadStatus } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

const columns: { status: LeadStatus; title: string }[] = [
  { status: "novo-lead", title: "Novo Lead" },
  { status: "contato-realizado", title: "Contato Realizado" },
  { status: "proposta-enviada", title: "Proposta Enviada" },
  { status: "negociacao", title: "Negociação" },
  { status: "fechado-ganho", title: "Fechado" },
  { status: "perdido", title: "Perdido" },
]

export default function KanbanPage() {
  return (
    <AuthenticatedLayout>
      <KanbanContent />
    </AuthenticatedLayout>
  );
}

function KanbanContent() {
  const { clientes, updateCliente, usuarios } = useCRM()
  const [draggedCliente, setDraggedCliente] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResponsavel, setFilterResponsavel] = useState<string>("all")
  const [filterOrigem, setFilterOrigem] = useState<string>("all")

  const handleDragStart = (e: React.DragEvent, cliente: Cliente) => {
    setDraggedCliente(cliente)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault()
    if (draggedCliente) {
      updateCliente(draggedCliente.id, { status: newStatus })
      setDraggedCliente(null)
    }
  }

  const handleCardClick = (cliente: Cliente) => {
    console.log("[v0] Card clicked:", cliente.nome)
    // TODO: Open client details modal
  }

  const handleAddClick = (status: LeadStatus) => {
    console.log("[v0] Add lead clicked for status:", status)
    // TODO: Open add lead modal with pre-selected status
  }

  // Filter clients
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResponsavel = filterResponsavel === "all" || cliente.responsavel_id === filterResponsavel
    const matchesOrigem = filterOrigem === "all" || cliente.origem === filterOrigem

    return matchesSearch && matchesResponsavel && matchesOrigem
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Pipeline de Vendas</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus leads através do funil de vendas</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterResponsavel} onValueChange={setFilterResponsavel}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {usuarios.map((usuario) => (
                <SelectItem key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterOrigem} onValueChange={setFilterOrigem}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="midia-social">Mídia Social</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="cold-call">Cold Call</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => {
              const columnClientes = filteredClientes.filter((c) => c.status === column.status)
              return (
                <KanbanColumn
                  key={column.status}
                  title={column.title}
                  status={column.status}
                  clientes={columnClientes}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                  onCardClick={handleCardClick}
                  onAddClick={handleAddClick}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
