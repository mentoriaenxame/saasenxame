import type {
  Cliente,
  Atividade,
  Tarefa,
  Evento,
  Usuario,
  LeadOrigin,
  LeadStatus,
  Priority,
  ActivityType,
} from "./types"

// Mock users
export const mockUsuarios: Usuario[] = [
  { id: "u1", nome: "Ana Silva", email: "ana@empresa.com", avatar_url: undefined },
  { id: "u2", nome: "Carlos Santos", email: "carlos@empresa.com", avatar_url: undefined },
  { id: "u3", nome: "Marina Costa", email: "marina@empresa.com", avatar_url: undefined },
]

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate 35 mock clients
const nomes = [
  "João Silva",
  "Maria Santos",
  "Pedro Oliveira",
  "Ana Costa",
  "Lucas Ferreira",
  "Juliana Alves",
  "Rafael Souza",
  "Camila Lima",
  "Bruno Martins",
  "Fernanda Rocha",
  "Gabriel Mendes",
  "Patricia Cardoso",
  "Rodrigo Barbosa",
  "Beatriz Ribeiro",
  "Thiago Carvalho",
  "Larissa Dias",
  "Felipe Gomes",
  "Amanda Pereira",
  "Diego Araujo",
  "Isabela Monteiro",
  "Vinicius Castro",
  "Carolina Freitas",
  "Marcelo Pinto",
  "Renata Moreira",
  "Leonardo Teixeira",
  "Aline Cavalcanti",
  "Gustavo Ramos",
  "Natalia Correia",
  "Eduardo Nunes",
  "Priscila Azevedo",
  "Ricardo Lopes",
  "Vanessa Campos",
  "Henrique Duarte",
  "Tatiana Vieira",
  "Fabio Rodrigues",
]

const empresas = [
  "Tech Solutions Ltda",
  "Inovação Digital",
  "Consultoria Empresarial",
  "Marketing Pro",
  "Vendas Online",
  "Logística Express",
  "Desenvolvimento Web",
  "Cloud Services",
  "Data Analytics",
  "E-commerce Plus",
  "Automação Industrial",
  "Gestão Inteligente",
  "Soluções Financeiras",
  "RH Estratégico",
  "Comunicação Visual",
  "Educação Online",
  "Saúde Digital",
  "Varejo Moderno",
  "Construção Civil",
  "Agronegócio Tech",
  "Turismo Virtual",
  "Eventos Corporativos",
  "Segurança Digital",
  "Energia Renovável",
  "Transporte Inteligente",
  "Alimentação Saudável",
  "Moda Sustentável",
  "Imobiliária Premium",
  "Advocacia Digital",
  "Contabilidade Online",
  "Design Criativo",
  "Publicidade 360",
  "Tecnologia Médica",
  "Fitness Online",
  "Pet Care",
]

const origens: LeadOrigin[] = ["indicacao", "website", "midia-social", "evento", "cold-call"]
const statuses: LeadStatus[] = [
  "novo-lead",
  "contato-realizado",
  "proposta-enviada",
  "negociacao",
  "fechado-ganho",
  "perdido",
]
const prioridades: Priority[] = ["alta", "media", "baixa"]
const cargos = ["CEO", "Diretor", "Gerente", "Coordenador", "Analista", "Supervisor"]

export const mockClientes: Cliente[] = nomes.map((nome, index) => {
  const statusDistribution =
    index < 5
      ? "novo-lead"
      : index < 10
        ? "contato-realizado"
        : index < 16
          ? "proposta-enviada"
          : index < 22
            ? "negociacao"
            : index < 28
              ? "fechado-ganho"
              : "perdido"

  return {
    id: `c${index + 1}`,
    nome,
    empresa: empresas[index],
    email: `${nome.toLowerCase().replace(" ", ".")}@${empresas[index].toLowerCase().replace(/\s+/g, "")}.com`,
    telefone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    origem: origens[Math.floor(Math.random() * origens.length)],
    status: statusDistribution as LeadStatus,
    valor_estimado: Math.floor(5000 + Math.random() * 95000),
    responsavel_id: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)].id,
    criado_em: randomDate(new Date(2024, 6, 1), new Date()),
    atualizado_em: randomDate(new Date(2024, 9, 1), new Date()),
    tags: ["cliente-potencial", index % 3 === 0 ? "urgente" : "follow-up"].slice(0, Math.floor(1 + Math.random() * 2)),
    prioridade: prioridades[Math.floor(Math.random() * prioridades.length)],
    cargo: cargos[Math.floor(Math.random() * cargos.length)],
  }
})

// Generate activities for each client
export const mockAtividades: Atividade[] = mockClientes.flatMap((cliente) => {
  const numAtividades = Math.floor(3 + Math.random() * 8)
  return Array.from({ length: numAtividades }, (_, i) => {
    const tipos: ActivityType[] = ["email", "ligacao", "reuniao", "nota"]
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]

    const descricoes = {
      email: ["Enviado proposta comercial", "Follow-up sobre reunião", "Apresentação de produto", "Resposta a dúvidas"],
      ligacao: ["Ligação de prospecção", "Agendamento de reunião", "Negociação de valores", "Confirmação de interesse"],
      reuniao: ["Reunião de apresentação", "Demo do produto", "Alinhamento de expectativas", "Fechamento de contrato"],
      nota: [
        "Cliente demonstrou interesse",
        "Necessita aprovação interna",
        "Solicitou desconto",
        "Prazo para decisão: 15 dias",
      ],
    }

    return {
      id: `a${cliente.id}-${i}`,
      cliente_id: cliente.id,
      tipo,
      descricao: descricoes[tipo][Math.floor(Math.random() * descricoes[tipo].length)],
      criado_por: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)].nome,
      criado_em: randomDate(cliente.criado_em, new Date()),
    }
  })
})

// Generate tasks
export const mockTarefas: Tarefa[] = mockClientes.slice(0, 20).flatMap((cliente) => {
  const numTarefas = Math.floor(1 + Math.random() * 3)
  return Array.from({ length: numTarefas }, (_, i) => ({
    id: `t${cliente.id}-${i}`,
    cliente_id: cliente.id,
    titulo: ["Enviar proposta", "Agendar follow-up", "Preparar apresentação", "Revisar contrato"][
      Math.floor(Math.random() * 4)
    ],
    descricao: "Tarefa relacionada ao cliente",
    data_vencimento: randomDate(new Date(), new Date(2025, 11, 31)),
    concluida: Math.random() > 0.6,
    responsavel_id: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)].id,
    criado_em: randomDate(cliente.criado_em, new Date()),
  }))
})

// Generate calendar events
export const mockEventos: Evento[] = Array.from({ length: 25 }, (_, i) => {
  const tipos: Evento["tipo"][] = ["reuniao", "follow-up", "deadline", "aniversario"]
  const tipo = tipos[Math.floor(Math.random() * tipos.length)]
  const cliente = mockClientes[Math.floor(Math.random() * mockClientes.length)]

  return {
    id: `e${i + 1}`,
    titulo:
      tipo === "reuniao"
        ? `Reunião com ${cliente.nome}`
        : tipo === "follow-up"
          ? `Follow-up ${cliente.empresa}`
          : tipo === "deadline"
            ? `Prazo proposta ${cliente.empresa}`
            : `Aniversário ${cliente.nome}`,
    descricao: "Evento agendado",
    data: randomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
    tipo,
    cliente_id: tipo !== "aniversario" ? cliente.id : undefined,
    responsavel_id: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)].id,
  }
})

// Calculate dashboard metrics
export const calculateDashboardMetrics = (clientes: Cliente[]) => {
  const total_leads = clientes.length
  const conversoes_mes = clientes.filter(
    (c) => c.status === "fechado-ganho" && c.atualizado_em.getMonth() === new Date().getMonth(),
  ).length

  const clientesFechados = clientes.filter((c) => c.status === "fechado-ganho")
  const ticket_medio =
    clientesFechados.length > 0
      ? clientesFechados.reduce((sum, c) => sum + c.valor_estimado, 0) / clientesFechados.length
      : 0

  const taxa_conversao = total_leads > 0 ? (clientesFechados.length / total_leads) * 100 : 0

  // Sales over last 6 months
  const vendas_ultimos_meses = Array.from({ length: 6 }, (_, i) => {
    const mes = new Date()
    mes.setMonth(mes.getMonth() - (5 - i))
    const mesNome = mes.toLocaleDateString("pt-BR", { month: "short" })

    const valor = clientesFechados
      .filter((c) => c.atualizado_em.getMonth() === mes.getMonth())
      .reduce((sum, c) => sum + c.valor_estimado, 0)

    return { mes: mesNome, valor }
  })

  // Pipeline by stage
  const pipeline_por_etapa = statuses.map((status) => ({
    etapa: status.replace(/-/g, " "),
    quantidade: clientes.filter((c) => c.status === status).length,
    valor: clientes.filter((c) => c.status === status).reduce((sum, c) => sum + c.valor_estimado, 0),
  }))

  // Leads by origin
  const leads_por_origem = origens.map((origem) => ({
    origem: origem.replace(/-/g, " "),
    quantidade: clientes.filter((c) => c.origem === origem).length,
  }))

  return {
    total_leads,
    conversoes_mes,
    ticket_medio,
    taxa_conversao,
    vendas_ultimos_meses,
    pipeline_por_etapa,
    leads_por_origem,
  }
}
