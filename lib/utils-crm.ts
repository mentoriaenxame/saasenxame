import type { LeadOrigin, LeadStatus, Priority } from "./types"

export const statusLabels: Record<LeadStatus, string> = {
  "novo-lead": "Novo Lead",
  "contato-realizado": "Contato Realizado",
  "proposta-enviada": "Proposta Enviada",
  negociacao: "Negociação",
  "fechado-ganho": "Fechado",
  perdido: "Perdido",
}

export const origemLabels: Record<LeadOrigin, string> = {
  indicacao: "Indicação",
  website: "Website",
  "midia-social": "Mídia Social",
  evento: "Evento",
  "cold-call": "Cold Call",
}

export const prioridadeLabels: Record<Priority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
}

export const statusColors: Record<LeadStatus, string> = {
  "novo-lead": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "contato-realizado": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "proposta-enviada": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  negociacao: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "fechado-ganho": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  perdido: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

export const prioridadeColors: Record<Priority, string> = {
  alta: "text-red-500",
  media: "text-yellow-500",
  baixa: "text-green-500",
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getAvatarColor(name: string): string {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
