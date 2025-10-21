// Script para inserir dados de demonstração, verificando se já existem

import { config } from 'dotenv';
import { createPool } from './lib/db-config';

// Load environment variables from .env.local
config({ path: './.env.local' });

async function addDemoData() {
  console.log('Verificando se os dados de demonstração já existem...');
  
  const pool = createPool();
  
  try {
    // Check if there are already users in the database
    const { rows: userCount } = await pool.query('SELECT COUNT(*) FROM usuarios');
    const userCountNum = parseInt(userCount[0].count);
    
    if (userCountNum > 0) {
      console.log('✓ Dados de demonstração já existem. Pulando inserção de dados.');
      return;
    }
    
    console.log('Iniciando inserção de dados de demonstração...');
    
    // Importar as funções de operações do banco de dados
    const { 
      createUsuario,
      createCliente,
      createAtividade,
      createTarefa,
      createEvento 
    } = await import('./lib/db-operations-actions');

    // Criar usuários de demonstração
    const adminUser = await createUsuario({
      nome: 'Admin User',
      email: 'admin@crm.com',
      perfil: 'admin'
    });
    console.log('✓ Usuário admin criado');

    const managerUser = await createUsuario({
      nome: 'Sales Manager',
      email: 'manager@crm.com',
      perfil: 'gerente'
    });
    console.log('✓ Usuário manager criado');

    const repUser = await createUsuario({
      nome: 'Sales Rep',
      email: 'rep@crm.com',
      perfil: 'vendedor'
    });
    console.log('✓ Usuário rep criado');

    // Criar clientes de demonstração
    const cliente1 = await createCliente({
      nome: 'Maria Silva',
      empresa: 'Tech Solutions Ltda',
      email: 'maria.silva@techsolutions.com',
      telefone: '(11) 99999-8888',
      cargo: 'Diretora',
      status: 'cliente',
      historico_compras: 'R$ 15.000,00',
      preferencias_comunicacao: ['email', 'whatsapp'],
      fonte: 'website',
      tags: ['importante', 'contrato'],
      data_registro: new Date(),
      valor_estimado: 15000.00,
      origem: 'website',
      responsavel_id: repUser.id,
      prioridade: 'alta'
    });
    console.log('✓ Cliente Maria Silva criado');

    const cliente2 = await createCliente({
      nome: 'João Oliveira',
      empresa: 'Marketing Pro',
      email: 'joao.oliveira@marketingpro.com',
      telefone: '(21) 98888-7777',
      cargo: 'CEO',
      status: 'negociacao',
      historico_compras: 'R$ 8.500,00',
      preferencias_comunicacao: ['ligacao', 'email'],
      fonte: 'indicacao',
      tags: ['lead-quento'],
      data_registro: new Date(),
      valor_estimado: 8500.00,
      origem: 'indicacao',
      responsavel_id: managerUser.id,
      prioridade: 'media'
    });
    console.log('✓ Cliente João Oliveira criado');

    const cliente3 = await createCliente({
      nome: 'Ana Costa',
      empresa: 'Design Studio',
      email: 'ana.costa@designstudio.com',
      telefone: '(31) 97777-6666',
      cargo: 'Diretora Criativa',
      status: 'lead',
      historico_compras: 'R$ 3.200,00',
      preferencias_comunicacao: ['email'],
      fonte: 'midia-social',
      tags: ['potencial'],
      data_registro: new Date(),
      valor_estimado: 3200.00,
      origem: 'midia-social',
      responsavel_id: repUser.id,
      prioridade: 'baixa'
    });
    console.log('✓ Cliente Ana Costa criado');

    // Criar atividades de demonstração
    await createAtividade({
      cliente_id: cliente1.id,
      tipo: 'ligacao',
      descricao: 'Ligação inicial para apresentação do produto',
      data: new Date(),
      usuario_id: repUser.id,
      criado_por: repUser.id,
      concluida: true
    });
    console.log('✓ Atividade para Maria Silva criada');

    await createAtividade({
      cliente_id: cliente2.id,
      tipo: 'email',
      descricao: 'Envio de proposta comercial',
      data: new Date(),
      usuario_id: repUser.id,
      criado_por: repUser.id,
      concluida: false
    });
    console.log('✓ Atividade para João Oliveira criada');

    await createAtividade({
      cliente_id: cliente3.id,
      tipo: 'reuniao',
      descricao: 'Reunião de alinhamento',
      data: new Date(),
      usuario_id: managerUser.id,
      criado_por: managerUser.id,
      concluida: false
    });
    console.log('✓ Atividade para Ana Costa criada');

    // Criar tarefas de demonstração
    await createTarefa({
      titulo: 'Follow-up Maria',
      descricao: 'Ligar para Maria para fechamento',
      status: 'pendente',
      prioridade: 'alta',
      usuario_id: repUser.id,
      cliente_id: cliente1.id
    });
    console.log('✓ Tarefa para Maria Silva criada');

    await createTarefa({
      titulo: 'Proposta João',
      descricao: 'Enviar proposta para João',
      status: 'em_andamento',
      prioridade: 'media',
      usuario_id: repUser.id,
      cliente_id: cliente2.id
    });
    console.log('✓ Tarefa para João Oliveira criada');

    await createTarefa({
      titulo: 'Contato Ana',
      descricao: 'Agendar reunião com Ana',
      status: 'pendente',
      prioridade: 'baixa',
      usuario_id: managerUser.id,
      cliente_id: cliente3.id
    });
    console.log('✓ Tarefa para Ana Costa criada');

    // Criar eventos de demonstração
    await createEvento({
      titulo: 'Reunião com Maria',
      descricao: 'Reunião de apresentação do produto',
      data_inicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias a partir de agora
      data_fim: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hora depois
      tipo: 'reuniao',
      usuario_id: repUser.id,
      cliente_id: cliente1.id
    });
    console.log('✓ Evento para Maria Silva criado');

    await createEvento({
      titulo: 'Proposta para João',
      descricao: 'Apresentação da proposta comercial',
      data_inicio: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias a partir de agora
      data_fim: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 horas depois
      tipo: 'reuniao',
      usuario_id: managerUser.id,
      cliente_id: cliente2.id
    });
    console.log('✓ Evento para João Oliveira criado');

    await createEvento({
      titulo: 'Follow-up Ana',
      descricao: 'Ligação de acompanhamento',
      data_inicio: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia a partir de agora
      data_fim: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 60 * 1000), // 30 minutos depois
      tipo: 'follow-up',
      usuario_id: repUser.id,
      cliente_id: cliente3.id
    });
    console.log('✓ Evento para Ana Costa criado');

    console.log('✓ Dados de demonstração inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de demonstração:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar a inserção de dados de demonstração
addDemoData().catch(error => {
  console.error('\n❌ Erro durante a inserção dos dados de demonstração:', error);
  process.exit(1);
});