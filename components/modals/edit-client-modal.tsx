"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCRM } from "@/lib/crm-context-db"
import type { LeadOrigin, LeadStatus, Priority, Cliente } from "@/lib/types"

interface EditClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: Cliente | null
}

export function EditClientModal({ open, onOpenChange, cliente }: EditClientModalProps) {
  const { usuarios, updateCliente } = useCRM()
  
  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    empresa: cliente?.empresa || "",
    email: cliente?.email || "",
    telefone: cliente?.telefone || "",
    cargo: cliente?.cargo || "",
    origem: cliente?.origem || "website",
    status: cliente?.status || "novo-lead",
    valor_estimado: cliente?.valor_estimado?.toString() || "",
    responsavel_id: cliente?.responsavel_id || "",
    prioridade: cliente?.prioridade || "media",
    observacoes: "",
  })

  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        empresa: cliente.empresa,
        email: cliente.email,
        telefone: cliente.telefone,
        cargo: cliente.cargo || "",
        origem: cliente.origem,
        status: cliente.status,
        valor_estimado: cliente.valor_estimado.toString(),
        responsavel_id: cliente.responsavel_id,
        prioridade: cliente.prioridade,
        observacoes: "",
      })
    }
  }, [cliente])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email) {
      alert("Nome e email são obrigatórios")
      return
    }

    if (cliente) {
      const updatedCliente = {
        nome: formData.nome,
        empresa: formData.empresa,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        origem: formData.origem,
        status: formData.status,
        valor_estimado: Number.parseFloat(formData.valor_estimado) || 0,
        responsavel_id: formData.responsavel_id,
        prioridade: formData.prioridade,
      }

      updateCliente(cliente.id, updatedCliente)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Tech Solutions Ltda"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Diretor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Estimado</Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor_estimado}
                onChange={(e) => setFormData({ ...formData, valor_estimado: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem do Lead</Label>
              <Select
                value={formData.origem}
                onValueChange={(value) => setFormData({ ...formData, origem: value as LeadOrigin })}
              >
                <SelectTrigger id="origem">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="midia-social">Mídia Social</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="cold-call">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estágio Atual</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as LeadStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo-lead">Novo Lead</SelectItem>
                  <SelectItem value="contato-realizado">Contato Realizado</SelectItem>
                  <SelectItem value="proposta-enviada">Proposta Enviada</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechado-ganho">Fechado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Select
                value={formData.responsavel_id}
                onValueChange={(value) => setFormData({ ...formData, responsavel_id: value })}
              >
                <SelectTrigger id="responsavel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Nenhum usuário disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) => setFormData({ ...formData, prioridade: value as Priority })}
              >
                <SelectTrigger id="prioridade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Adicione notas sobre o cliente..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Atualizar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}