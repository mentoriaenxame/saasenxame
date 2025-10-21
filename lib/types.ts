// Core data models for the CRM system

export type LeadOrigin = "indicacao" | "website" | "midia-social" | "evento" | "cold-call"
export type LeadStatus =
  | "novo-lead"
  | "contato-realizado"
  | "proposta-enviada"
  | "negociacao"
  | "fechado-ganho"
  | "perdido"
export type Priority = "alta" | "media" | "baixa"
export type ActivityType = "email" | "ligacao" | "reuniao" | "nota"

export interface Cliente {
  id: string
  nome: string
  empresa: string
  email: string
  telefone: string
  origem: LeadOrigin
  status: LeadStatus
  valor_estimado: number
  responsavel_id: string
  criado_em: Date
  atualizado_em: Date
  tags: string[]
  prioridade: Priority
  avatar_url?: string
  cargo?: string
}

export interface Atividade {
  id: string
  cliente_id: string
  tipo: ActivityType
  descricao: string
  criado_por: string
  criado_em: Date
  anexos?: string[]
}

export interface Tarefa {
  id: string
  cliente_id: string
  titulo: string
  descricao: string
  data_vencimento: Date
  concluida: boolean
  responsavel_id: string
  criado_em: Date
}

export interface Evento {
  id: string
  titulo: string
  descricao: string
  data: Date
  tipo: "reuniao" | "follow-up" | "deadline" | "aniversario"
  cliente_id?: string
  responsavel_id: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  avatar_url?: string
}

export interface DashboardMetrics {
  total_leads: number
  conversoes_mes: number
  ticket_medio: number
  taxa_conversao: number
  vendas_ultimos_meses: { mes: string; valor: number }[]
  pipeline_por_etapa: { etapa: string; quantidade: number; valor: number }[]
  leads_por_origem: { origem: string; quantidade: number }[]
}
