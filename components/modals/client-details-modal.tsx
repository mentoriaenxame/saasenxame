"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Cliente } from "@/lib/types"
import { useCRM } from "@/lib/crm-context-db"
import {
  formatCurrency,
  formatDateTime,
  getInitials,
  getAvatarColor,
  statusLabels,
  statusColors,
  origemLabels,
} from "@/lib/utils-crm"
import { Mail, Phone, Building2, Calendar, FileText, CheckSquare, Upload } from "lucide-react"

interface ClientDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: Cliente | null
}

export function ClientDetailsModal({ open, onOpenChange, cliente }: ClientDetailsModalProps) {
  const { atividades, tarefas, updateTarefa } = useCRM()
  const [activeTab, setActiveTab] = useState("info")

  if (!cliente) return null

  const clienteAtividades = atividades.filter((a) => a.cliente_id === cliente.id)
  const clienteTarefas = tarefas.filter((t) => t.cliente_id === cliente.id)

  const sortedAtividades = clienteAtividades.sort((a, b) => 
    (b.criado_em instanceof Date ? b.criado_em.getTime() : new Date().getTime()) - 
    (a.criado_em instanceof Date ? a.criado_em.getTime() : new Date().getTime())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`h-20 w-20 rounded-full ${getAvatarColor(cliente.nome)} flex items-center justify-center text-white font-bold text-2xl mb-3`}
                    >
                      {getInitials(cliente.nome)}
                    </div>
                    <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                    <p className="text-sm text-muted-foreground">{cliente.cargo}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.empresa}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.telefone}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={statusColors[cliente.status]}>{statusLabels[cliente.status]}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Origem:</span>
                      <Badge variant="outline">{origemLabels[cliente.origem]}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(cliente.valor_estimado || 0)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full gap-2" size="sm">
                      <Mail className="h-4 w-4" />
                      Enviar Email
                    </Button>
                    <Button variant="outline" className="w-full gap-2 bg-transparent" size="sm">
                      <Calendar className="h-4 w-4" />
                      Agendar Reunião
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-semibold">Informações Gerais</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Criado em:</span>
                          <p className="font-medium">{formatDateTime(cliente.criado_em instanceof Date ? cliente.criado_em : new Date())}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Última atualização:</span>
                          <p className="font-medium">{formatDateTime(cliente.atualizado_em instanceof Date ? cliente.atualizado_em : new Date())}</p>
                        </div>
                      </div>
                      {cliente.tags.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Tags:</span>
                          <div className="flex gap-2 mt-2">
                            {cliente.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-3 mt-4">
                  {sortedAtividades.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma atividade registrada</p>
                      </CardContent>
                    </Card>
                  ) : (
                    sortedAtividades.map((atividade) => (
                      <Card key={atividade.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium capitalize">{atividade.tipo}</p>
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(atividade.criado_em instanceof Date ? atividade.criado_em : new Date())}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                              <p className="text-xs text-muted-foreground mt-2">Por {atividade.criado_por}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="tarefas" className="space-y-3 mt-4">
                  {clienteTarefas.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nenhuma tarefa criada</p>
                      </CardContent>
                    </Card>
                  ) : (
                    clienteTarefas.map((tarefa) => (
                      <Card key={tarefa.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={tarefa.concluida}
                              onCheckedChange={(checked) => updateTarefa(tarefa.id, { concluida: checked as boolean })}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${tarefa.concluida ? "line-through text-muted-foreground" : ""}`}
                              >
                                {tarefa.titulo}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">{tarefa.descricao}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Vencimento: {formatDateTime(tarefa.data_vencimento instanceof Date ? tarefa.data_vencimento : new Date())}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="documentos" className="mt-4">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">Nenhum documento anexado</p>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload de Arquivo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Preparado para integração com MinIO</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
