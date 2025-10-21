// Tipos para operações de banco de dados
import type { Cliente, Atividade, Tarefa, Evento, Usuario } from './types';

// Interfaces para operações de banco de dados
export interface ClienteDB extends Cliente {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface AtividadeDB extends Atividade {
  id: string;
  created_at: Date;
}

export interface TarefaDB extends Tarefa {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface EventoDB extends Evento {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioDB extends Usuario {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Interfaces para operações CRUD
export interface CreateClienteData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  status: 'lead' | 'cliente' | 'inativo';
  historico_compras?: string;
  preferencias_comunicacao?: string[];
  fonte?: string;
  data_registro?: Date;
  tags?: string[];
}

export interface UpdateClienteData extends Partial<CreateClienteData> {
  atualizado_em?: Date;
}

export interface CreateAtividadeData {
  cliente_id: string;
  tipo: string;
  descricao: string;
  data: Date;
  usuario_id: string;
  concluida: boolean;
}

export interface UpdateAtividadeData extends Partial<CreateAtividadeData> {
  concluida?: boolean;
}

export interface CreateTarefaData {
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  data_vencimento?: Date;
  cliente_id?: string;
  usuario_id: string;
}

export interface UpdateTarefaData extends Partial<CreateTarefaData> {
  atualizado_em?: Date;
}

export interface CreateEventoData {
  titulo: string;
  descricao: string;
  data_inicio: Date;
  data_fim: Date;
  localizacao?: string;
  cliente_id?: string;
  usuario_id: string;
}

export interface UpdateEventoData extends Partial<CreateEventoData> {
  atualizado_em?: Date;
}

export interface CreateUsuarioData {
  nome: string;
  email: string;
  perfil: 'admin' | 'gerente' | 'vendedor' | 'atendente';
}

export interface UpdateUsuarioData extends Partial<CreateUsuarioData> {
  atualizado_em?: Date;
}