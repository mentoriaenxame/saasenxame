"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Cliente, Atividade, Tarefa, Evento, Usuario, DashboardMetrics } from "./types";
import type {
  ClienteDB,
  AtividadeDB,
  TarefaDB,
  EventoDB,
  UsuarioDB
} from "./types-db";

// Converter tipos do banco para os tipos usados no frontend
const mapClienteDBToFrontend = (cliente: ClienteDB): Cliente => {
  return {
    id: cliente.id,
    nome: cliente.nome ?? 'Cliente sem nome',
    empresa: cliente.empresa ?? '',
    email: cliente.email ?? '',
    telefone: cliente.telefone ?? '',
    origem: cliente.origem ?? 'website',
    status: cliente.status ?? 'novo-lead',
    valor_estimado: typeof cliente.valor_estimado === 'number' ? cliente.valor_estimado : (typeof cliente.valor_estimado === 'string' ? parseFloat(cliente.valor_estimado) || 0 : 0),
    responsavel_id: cliente.responsavel_id ?? '',
    criado_em: cliente.created_at instanceof Date ? cliente.created_at : new Date(cliente.created_at ?? new Date()),
    atualizado_em: cliente.updated_at instanceof Date ? cliente.updated_at : new Date(cliente.updated_at ?? new Date()),
    tags: cliente.tags ?? [],
    prioridade: cliente.prioridade ?? 'media',
    avatar_url: cliente.avatar_url, // opcional
    cargo: cliente.cargo, // opcional
    historico_compras: cliente.historico_compras,
    preferencias_comunicacao: cliente.preferencias_comunicacao,
    fonte: cliente.fonte,
    data_registro: cliente.data_registro,
  };
};

const mapAtividadeDBToFrontend = (atividade: AtividadeDB): Atividade => {
  return {
    id: atividade.id,
    cliente_id: atividade.cliente_id ?? '',
    tipo: atividade.tipo ?? 'nota',
    descricao: atividade.descricao ?? '',
    data: atividade.data instanceof Date ? atividade.data : new Date(atividade.data ?? new Date()),
    usuario_id: atividade.usuario_id ?? '',
    criado_por: atividade.criado_por ?? atividade.usuario_id ?? '',
    concluida: atividade.concluida ?? false
  };
};

const mapTarefaDBToFrontend = (tarefa: TarefaDB): Tarefa => {
  return {
    id: tarefa.id,
    titulo: tarefa.titulo ?? 'Tarefa sem título',
    descricao: tarefa.descricao ?? '',
    status: tarefa.status ?? 'pendente',
    prioridade: tarefa.prioridade ?? 'media',
    data_vencimento: tarefa.data_vencimento instanceof Date ? tarefa.data_vencimento : new Date(tarefa.data_vencimento ?? new Date()),
    cliente_id: tarefa.cliente_id,
    usuario_id: tarefa.usuario_id ?? '',
    criado_em: tarefa.created_at instanceof Date ? tarefa.created_at : new Date(tarefa.created_at ?? new Date()),
    atualizado_em: tarefa.updated_at instanceof Date ? tarefa.updated_at : new Date(tarefa.updated_at ?? new Date())
  };
};

const mapEventoDBToFrontend = (evento: EventoDB): Evento => {
  return {
    id: evento.id,
    titulo: evento.titulo ?? 'Evento sem título',
    descricao: evento.descricao ?? '',
    data_inicio: evento.data_inicio instanceof Date ? evento.data_inicio : new Date(evento.data_inicio ?? new Date()),
    data_fim: evento.data_fim instanceof Date ? evento.data_fim : new Date(evento.data_fim ?? new Date()),
    tipo: evento.tipo ?? 'reuniao',
    localizacao: evento.localizacao,
    cliente_id: evento.cliente_id,
    usuario_id: evento.usuario_id ?? '',
    criado_em: evento.created_at instanceof Date ? evento.created_at : new Date(evento.created_at ?? new Date()),
    atualizado_em: evento.updated_at instanceof Date ? evento.updated_at : new Date(evento.updated_at ?? new Date())
  };
};

const mapUsuarioDBToFrontend = (usuario: UsuarioDB): Usuario => {
  return {
    id: usuario.id,
    nome: usuario.nome ?? 'Usuário sem nome',
    email: usuario.email ?? '',
    avatar_url: usuario.avatar_url,
    perfil: usuario.perfil ?? 'vendedor',
    criado_em: usuario.created_at instanceof Date ? usuario.created_at : new Date(usuario.created_at ?? new Date()),
    atualizado_em: usuario.updated_at instanceof Date ? usuario.updated_at : new Date(usuario.updated_at ?? new Date())
  };
};

interface CRMContextType {
  clientes: Cliente[];
  atividades: Atividade[];
  tarefas: Tarefa[];
  eventos: Evento[];
  usuarios: Usuario[];
  metrics: DashboardMetrics;
  currentUser: Usuario | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  addCliente: (cliente: Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  updateCliente: (id: string, updates: Partial<Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>>) => void;
  deleteCliente: (id: string) => void;
  addAtividade: (atividade: Omit<Atividade, 'id'>) => void;
  addTarefa: (tarefa: Omit<Tarefa, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  updateTarefa: (id: string, updates: Partial<Omit<Tarefa, 'id' | 'criado_em' | 'atualizado_em'>>) => void;
  addEvento: (evento: Omit<Evento, 'id' | 'criado_em' | 'atualizado_em'>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Calcular métricas do dashboard
  const metrics = {
    total_leads: clientes.length,
    conversoes_mes: clientes.filter(c => c.status === 'fechado-ganho').length,
    ticket_medio: clientes.length > 0 
      ? clientes.reduce((sum, cliente) => sum + cliente.valor_estimado, 0) / clientes.length 
      : 0,
    taxa_conversao: clientes.length > 0 
      ? (clientes.filter(c => c.status === 'fechado-ganho').length / clientes.length) * 100 
      : 0,
    vendas_ultimos_meses: [
      { mes: 'Janeiro', valor: 12000 },
      { mes: 'Fevereiro', valor: 19000 },
      { mes: 'Março', valor: 15000 },
      { mes: 'Abril', valor: 18000 },
      { mes: 'Maio', valor: 22000 },
      { mes: 'Junho', valor: 30000 },
    ],
    pipeline_por_etapa: [
      { etapa: 'Novo Lead', quantidade: clientes.filter(c => c.status === 'novo-lead').length, valor: clientes.filter(c => c.status === 'novo-lead').reduce((sum, c) => sum + c.valor_estimado, 0) },
      { etapa: 'Contato Realizado', quantidade: clientes.filter(c => c.status === 'contato-realizado').length, valor: clientes.filter(c => c.status === 'contato-realizado').reduce((sum, c) => sum + c.valor_estimado, 0) },
      { etapa: 'Proposta Enviada', quantidade: clientes.filter(c => c.status === 'proposta-enviada').length, valor: clientes.filter(c => c.status === 'proposta-enviada').reduce((sum, c) => sum + c.valor_estimado, 0) },
      { etapa: 'Negociação', quantidade: clientes.filter(c => c.status === 'negociacao').length, valor: clientes.filter(c => c.status === 'negociacao').reduce((sum, c) => sum + c.valor_estimado, 0) },
      { etapa: 'Fechado', quantidade: clientes.filter(c => c.status === 'fechado-ganho').length, valor: clientes.filter(c => c.status === 'fechado-ganho').reduce((sum, c) => sum + c.valor_estimado, 0) },
    ],
    leads_por_origem: [
      { origem: 'Website', quantidade: clientes.filter(c => c.origem === 'website').length },
      { origem: 'Mídia Social', quantidade: clientes.filter(c => c.origem === 'midia-social').length },
      { origem: 'Indicação', quantidade: clientes.filter(c => c.origem === 'indicacao').length },
      { origem: 'Evento', quantidade: clientes.filter(c => c.origem === 'evento').length },
      { origem: 'Cold Call', quantidade: clientes.filter(c => c.origem === 'cold-call').length },
    ]
  };

  // Load data and check authentication status
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check auth status using the API route
        const authResponse = await fetch('/api/check-auth');
        const authData = await authResponse.json();
        const isAuthenticatedFromCookie = authData.authenticated;
        
        // Importar operações dinamicamente para garantir execução apenas no servidor
        const { 
          getAllClientes,
          getAllAtividades,
          getAllTarefas,
          getAllEventos,
          getAllUsuarios
        } = await import('./db-operations-actions');

        // Carregar dados do banco e converter para o formato frontend
        const [
          clientesDB,
          atividadesDB,
          tarefasDB,
          eventosDB,
          usuariosDB
        ] = await Promise.all([
          getAllClientes(),
          getAllAtividades(),
          getAllTarefas(),
          getAllEventos(),
          getAllUsuarios()
        ]);

        // Converter dados do banco para o formato frontend
        const frontendClientes = clientesDB.map(mapClienteDBToFrontend);
        const frontendAtividades = atividadesDB.map(mapAtividadeDBToFrontend);
        const frontendTarefas = tarefasDB.map(mapTarefaDBToFrontend);
        const frontendEventos = eventosDB.map(mapEventoDBToFrontend);
        const frontendUsuarios = usuariosDB.map(mapUsuarioDBToFrontend);

        setClientes(frontendClientes);
        setAtividades(frontendAtividades);
        setTarefas(frontendTarefas);
        setEventos(frontendEventos);
        setUsuarios(frontendUsuarios);
        
        // Set authentication status based on cookie check
        if (isAuthenticatedFromCookie && frontendUsuarios.length > 0) {
          setCurrentUser(frontendUsuarios[0]);
          setIsAuthenticated(true);
        } else if (!isAuthenticatedFromCookie) {
          // If not authenticated, redirect to login (this would be handled by middleware)
          // We set the state to reflect the unauthenticated status
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do banco:", error);
        setError("Erro ao carregar dados do banco. Verifique sua conexão e configurações.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Função de login - apenas atualiza o estado local; a autenticação real é feita via server actions
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Em implementação real, chamaria uma API para autenticação
      // Por enquanto, simulamos o login para atualizar o estado local
      // A autenticação real ocorre via server actions (loginAction) e cookies
      setCurrentUser({
        id: 'temp-user-id',
        nome: 'Usuário Temporário',
        email: email,
        perfil: 'vendedor',
        criado_em: new Date(),
        atualizado_em: new Date()
      });
      setIsAuthenticated(true);
      return { success: true, message: 'Login realizado com sucesso' };
    } catch (error) {
      console.error('Erro durante o login:', error);
      return { success: false, message: 'Erro durante o login. Verifique sua conexão.' };
    }
  };

  // Função de logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addCliente = async (clienteData: Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { createCliente } = await import('./db-operations-actions');
      
      // Criar cliente no banco de dados
      const novoClienteDB = await createCliente({
        ...clienteData,
        data_registro: clienteData.data_registro || new Date(),
        tags: clienteData.tags || []
      });
      
      // Converter para formato frontend e adicionar ao estado local
      const novoCliente = mapClienteDBToFrontend(novoClienteDB);
      setClientes(prev => [...prev, novoCliente]);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      setError("Erro ao adicionar cliente. Verifique sua conexão e tente novamente.");
    }
  };

  const updateCliente = async (id: string, updates: Partial<Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { updateCliente } = await import('./db-operations-actions');
      
      // Atualizar cliente no banco de dados
      const clienteAtualizadoDB = await updateCliente(id, updates);
      
      if (clienteAtualizadoDB) {
        // Converter para formato frontend e atualizar no estado local
        const clienteAtualizado = mapClienteDBToFrontend(clienteAtualizadoDB);
        setClientes(prev => prev.map(c => c.id === id ? clienteAtualizado : c));
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setError("Erro ao atualizar cliente. Verifique sua conexão e tente novamente.");
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { deleteCliente } = await import('./db-operations-actions');
      
      // Deletar cliente no banco de dados
      const sucesso = await deleteCliente(id);
      
      if (sucesso) {
        // Remover do estado local
        setClientes(prev => prev.filter(c => c.id !== id));
        // Remover atividades e tarefas associadas
        setAtividades(prev => prev.filter(a => a.cliente_id !== id));
        setTarefas(prev => prev.filter(t => t.cliente_id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      setError("Erro ao deletar cliente. Verifique sua conexão e tente novamente.");
    }
  };

  const addAtividade = async (atividadeData: Omit<Atividade, 'id'>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { createAtividade } = await import('./db-operations-actions');
      
      // Criar atividade no banco de dados
      const novaAtividadeDB = await createAtividade(atividadeData);
      
      // Converter para formato frontend e adicionar ao estado local
      const novaAtividade = mapAtividadeDBToFrontend(novaAtividadeDB);
      setAtividades(prev => [...prev, novaAtividade]);
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
      setError("Erro ao adicionar atividade. Verifique sua conexão e tente novamente.");
    }
  };

  const addTarefa = async (tarefaData: Omit<Tarefa, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { createTarefa } = await import('./db-operations-actions');
      
      // Criar tarefa no banco de dados
      const novaTarefaDB = await createTarefa({
        ...tarefaData,
        data_vencimento: tarefaData.data_vencimento || undefined
      });
      
      // Converter para formato frontend e adicionar ao estado local
      const novaTarefa = mapTarefaDBToFrontend(novaTarefaDB);
      setTarefas(prev => [...prev, novaTarefa]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setError("Erro ao adicionar tarefa. Verifique sua conexão e tente novamente.");
    }
  };

  const updateTarefa = async (id: string, updates: Partial<Omit<Tarefa, 'id' | 'criado_em' | 'atualizado_em'>>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { updateTarefa } = await import('./db-operations-actions');
      
      // Atualizar tarefa no banco de dados
      const tarefaAtualizadaDB = await updateTarefa(id, updates);
      
      if (tarefaAtualizadaDB) {
        // Converter para formato frontend e atualizar no estado local
        const tarefaAtualizada = mapTarefaDBToFrontend(tarefaAtualizadaDB);
        setTarefas(prev => prev.map(t => t.id === id ? tarefaAtualizada : t));
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setError("Erro ao atualizar tarefa. Verifique sua conexão e tente novamente.");
    }
  };

  const addEvento = async (eventoData: Omit<Evento, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      // Importar operações dinamicamente para garantir execução apenas no servidor
      const { createEvento } = await import('./db-operations-actions');
      
      // Criar evento no banco de dados
      const novoEventoDB = await createEvento(eventoData);
      
      // Converter para formato frontend e adicionar ao estado local
      const novoEvento = mapEventoDBToFrontend(novoEventoDB);
      setEventos(prev => [...prev, novoEvento]);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      setError("Erro ao adicionar evento. Verifique sua conexão e tente novamente.");
    }
  };

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
        loading,
        error,
        isAuthenticated,
        login,
        logout,
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
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    // Não lançamos um erro, apenas retornamos um contexto padrão
    // Isto evita problemas com SSR e componentes que podem usar o hook antes do provedor estar disponível
    console.warn("useCRM está sendo usado sem o CRMProvider. Verifique sua árvore de componentes.");
    return {
      clientes: [],
      atividades: [],
      tarefas: [],
      eventos: [],
      usuarios: [],
      metrics: {
        totalClientes: 0,
        clientesAtivos: 0,
        receitaTotal: 0,
        oportunidades: 0
      },
      currentUser: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      login: async () => ({ success: false, message: "Login não disponível fora do CRMProvider" }),
      logout: () => console.error("logout não disponível fora do CRMProvider"),
      addCliente: () => console.error("addCliente não disponível fora do CRMProvider"),
      updateCliente: () => console.error("updateCliente não disponível fora do CRMProvider"),
      deleteCliente: () => console.error("deleteCliente não disponível fora do CRMProvider"),
      addAtividade: () => console.error("addAtividade não disponível fora do CRMProvider"),
      addTarefa: () => console.error("addTarefa não disponível fora do CRMProvider"),
      updateTarefa: () => console.error("updateTarefa não disponível fora do CRMProvider"),
      addEvento: () => console.error("addEvento não disponível fora do CRMProvider")
    };
  }
  return context;
}