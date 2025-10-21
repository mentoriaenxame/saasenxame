"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Cliente, Atividade, Tarefa, Evento, Usuario, DashboardMetrics } from "./types"
import {
  mockClientes,
  mockAtividades,
  mockTarefas,
  mockEventos,
  mockUsuarios,
  calculateDashboardMetrics,
} from "./mock-data"

interface CRMContextType {
  clientes: Cliente[]
  atividades: Atividade[]
  tarefas: Tarefa[]
  eventos: Evento[]
  usuarios: Usuario[]
  metrics: DashboardMetrics
  currentUser: Usuario
  addCliente: (cliente: Cliente) => void
  updateCliente: (id: string, updates: Partial<Cliente>) => void
  deleteCliente: (id: string) => void
  addAtividade: (atividade: Atividade) => void
  addTarefa: (tarefa: Tarefa) => void
  updateTarefa: (id: string, updates: Partial<Tarefa>) => void
  addEvento: (evento: Evento) => void
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)

export function CRMProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes)
  const [atividades, setAtividades] = useState<Atividade[]>(mockAtividades)
  const [tarefas, setTarefas] = useState<Tarefa[]>(mockTarefas)
  const [eventos, setEventos] = useState<Evento[]>(mockEventos)
  const usuarios = mockUsuarios
  const currentUser = usuarios[0]

  const metrics = calculateDashboardMetrics(clientes)

  const addCliente = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente])
  }

  const updateCliente = (id: string, updates: Partial<Cliente>) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, atualizado_em: new Date() } : c)))
  }

  const deleteCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id))
    setAtividades((prev) => prev.filter((a) => a.cliente_id !== id))
    setTarefas((prev) => prev.filter((t) => t.cliente_id !== id))
  }

  const addAtividade = (atividade: Atividade) => {
    setAtividades((prev) => [...prev, atividade])
  }

  const addTarefa = (tarefa: Tarefa) => {
    setTarefas((prev) => [...prev, tarefa])
  }

  const updateTarefa = (id: string, updates: Partial<Tarefa>) => {
    setTarefas((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const addEvento = (evento: Evento) => {
    setEventos((prev) => [...prev, evento])
  }

  return (
    <CRMContext.Provider
      value={{
        clientes,
        atividades,
        tarefas,
        eventos,
        usuarios,
        metrics,
        currentUser,
        addCliente,
        updateCliente,
        deleteCliente,
        addAtividade,
        addTarefa,
        updateTarefa,
        addEvento,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error("useCRM must be used within CRMProvider")
  }
  return context
}
