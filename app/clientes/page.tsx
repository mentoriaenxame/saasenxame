"use client";

import AuthenticatedLayout from "../dashboard/layout"; // Reuse the same layout
import { useState, useMemo } from "react"
import { useCRM } from "@/lib/crm-context-db"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"
import { AddClientModal } from "@/components/modals/add-client-modal"
import { EditClientModal } from "@/components/modals/edit-client-modal"
import { useModal } from "@/hooks/use-modal"
import {
  formatCurrency,
  formatDate,
  statusLabels,
  statusColors,
  origemLabels,
  getInitials,
  getAvatarColor,
} from "@/lib/utils-crm"

type SortField = "nome" | "empresa" | "valor_estimado" | "criado_em"
type SortDirection = "asc" | "desc"

export default function ClientesPage() {
  return (
    <AuthenticatedLayout>
      <ClientesContent />
    </AuthenticatedLayout>
  );
}

function ClientesContent() {
  const { clientes, deleteCliente, loading } = useCRM()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterOrigem, setFilterOrigem] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("criado_em")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const itemsPerPage = 20
  
  const { 
    isModalOpen: isNewClientModalOpen, 
    openModal: openNewClientModal, 
    closeModal: closeNewClientModal 
  } = useModal()
  
  const { 
    isModalOpen: isEditClientModalOpen, 
    openModal: openEditClientModal, 
    closeModal: closeEditClientModal 
  } = useModal()
  
  const [selectedCliente, setSelectedCliente] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter and sort clients
  const filteredAndSortedClientes = useMemo(() => {
    const filtered = clientes.filter((cliente) => {
      const matchesSearch =
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefone.includes(searchTerm)

      const matchesStatus = filterStatus === "all" || cliente.status === filterStatus
      const matchesOrigem = filterOrigem === "all" || cliente.origem === filterOrigem

      return matchesSearch && matchesStatus && matchesOrigem
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "criado_em") {
        aValue = a.criado_em.getTime()
        bValue = b.criado_em.getTime()
      } else if (sortField === "valor_estimado") {
        aValue = a.valor_estimado
        bValue = b.valor_estimado
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [clientes, searchTerm, filterStatus, filterOrigem, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClientes.length / itemsPerPage)
  const paginatedClientes = filteredAndSortedClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedClientes.map((c) => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      deleteCliente(id)
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleEditClick = (cliente) => {
    setSelectedCliente(cliente)
    openEditClientModal()
  }

  const handleBulkExport = () => {
    console.log("[v0] Exporting selected clients:", Array.from(selectedIds))
    alert(`Exportando ${selectedIds.size} clientes selecionados`)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-2">Gerencie todos os seus leads e clientes</p>
          </div>
          <Button size="lg" className="gap-2" onClick={openNewClientModal} disabled={loading}>
            <Plus className="h-5 w-5" />
            Novo Cliente
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, empresa, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="novo-lead">Novo Lead</SelectItem>
              <SelectItem value="contato-realizado">Contato Realizado</SelectItem>
              <SelectItem value="proposta-enviada">Proposta Enviada</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="fechado-ganho">Fechado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterOrigem} onValueChange={setFilterOrigem}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Origens</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="midia-social">Mídia Social</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="cold-call">Cold Call</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <span className="text-sm font-medium">{selectedIds.size} selecionado(s)</span>
            <Button variant="outline" size="sm" onClick={handleBulkExport} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar Selecionados
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={paginatedClientes.length > 0 && selectedIds.size === paginatedClientes.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("empresa")}>
                  <div className="flex items-center gap-2">
                    Empresa
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("valor_estimado")}>
                  <div className="flex items-center gap-2">
                    Valor
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("criado_em")}>
                  <div className="flex items-center gap-2">
                    Criado em
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(cliente.id)}
                        onCheckedChange={(checked) => handleSelectOne(cliente.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full ${getAvatarColor(cliente.nome)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                        >
                          {getInitials(cliente.nome)}
                        </div>
                        <div>
                          <p className="font-medium">{cliente.nome}</p>
                          <p className="text-sm text-muted-foreground">{cliente.cargo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.empresa}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{cliente.email}</p>
                        <p className="text-muted-foreground">{cliente.telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[cliente.status]}>{statusLabels[cliente.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{origemLabels[cliente.origem]}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(cliente.valor_estimado)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(cliente.criado_em)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(cliente)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedClientes.length)} de{" "}
              {filteredAndSortedClientes.length} clientes
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal 
        open={isNewClientModalOpen} 
        onOpenChange={closeNewClientModal} 
      />

      {/* Edit Client Modal */}
      <EditClientModal 
        open={isEditClientModalOpen} 
        onOpenChange={closeEditClientModal}
        cliente={selectedCliente}
      />
    </div>
  )
}
