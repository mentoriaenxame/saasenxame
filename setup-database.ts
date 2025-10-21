// Script para criar as tabelas e dados de demonstração diretamente usando as funções do aplicativo

import { config } from 'dotenv';
import { createPool } from './lib/db-config';

// Load environment variables from .env.local
config({ path: './.env.local' });

async function createTables() {
  const pool = createPool();
  
  try {
    console.log('Criando tabelas no banco de dados...');
    
    // Enable UUID extension if not already enabled
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✓ Extensão UUID criada');

    // Create usuarios table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        perfil VARCHAR(50) DEFAULT 'vendedor',
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela usuarios criada');

    // Create clientes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(255) NOT NULL,
        empresa VARCHAR(255),
        email VARCHAR(255),
        telefone VARCHAR(50),
        origem VARCHAR(50) DEFAULT 'website',
        status VARCHAR(50) DEFAULT 'novo-lead',
        valor_estimado DECIMAL(10, 2) DEFAULT 0,
        responsavel_id UUID REFERENCES usuarios(id),
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tags TEXT[],
        prioridade VARCHAR(20) DEFAULT 'media',
        avatar_url TEXT,
        cargo VARCHAR(100),
        historico_compras TEXT,
        preferencias_comunicacao TEXT[],
        fonte VARCHAR(100),
        data_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela clientes criada');

    // Create atividades table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS atividades (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL,
        descricao TEXT,
        criado_por UUID NOT NULL REFERENCES usuarios(id),
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        anexos TEXT[],
        data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        usuario_id UUID REFERENCES usuarios(id),
        concluida BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela atividades criada');

    // Create tarefas table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        status VARCHAR(50) DEFAULT 'pendente',
        prioridade VARCHAR(20) DEFAULT 'media',
        data_vencimento TIMESTAMP WITH TIME ZONE,
        concluida BOOLEAN DEFAULT FALSE,
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela tarefas criada');

    // Create eventos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
        data_fim TIMESTAMP WITH TIME ZONE,
        tipo VARCHAR(50) DEFAULT 'reuniao',
        localizacao TEXT,
        cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Tabela eventos criada');

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clientes_responsavel ON clientes(responsavel_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clientes_origem ON clientes(origem);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_atividades_cliente ON atividades(cliente_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_atividades_tipo ON atividades(tipo);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tarefas_cliente ON tarefas(cliente_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_eventos_cliente ON eventos(cliente_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_eventos_data_inicio ON eventos(data_inicio);');
    console.log('✓ Índices criados');

    console.log('✓ Todas as tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function seedDemoData() {
  console.log('Iniciando inserção de dados de demonstração...');
  
  try {
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
      criado_por: repUser.id,  // Correct field for who created the activity
      concluida: true
    });
    console.log('✓ Atividade para Maria Silva criada');

    await createAtividade({
      cliente_id: cliente2.id,
      tipo: 'email',
      descricao: 'Envio de proposta comercial',
      data: new Date(),
      usuario_id: repUser.id,
      criado_por: repUser.id,  // Correct field for who created the activity
      concluida: false
    });
    console.log('✓ Atividade para João Oliveira criada');

    await createAtividade({
      cliente_id: cliente3.id,
      tipo: 'reuniao',
      descricao: 'Reunião de alinhamento',
      data: new Date(),
      usuario_id: managerUser.id,
      criado_por: managerUser.id,  // Correct field for who created the activity
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
      data_fim: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutos depois
      tipo: 'follow-up',
      usuario_id: repUser.id,
      cliente_id: cliente3.id
    });
    console.log('✓ Evento para Ana Costa criado');

    console.log('✓ Dados de demonstração inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de demonstração:', error);
    throw error;
  }
}

async function setupDatabase() {
  console.log('Iniciando configuração do banco de dados...');
  
  try {
    // Primeiro criar as tabelas
    await createTables();
    
    // Depois adicionar os dados de demonstração
    await seedDemoData();
    
    console.log('\n🎉 Configuração do banco de dados concluída com sucesso!');
    console.log('O banco de dados está pronto para uso com o CRM.');
  } catch (error) {
    console.error('\n❌ Erro durante a configuração do banco de dados:', error);
    process.exit(1);
  }
}

// Executar a configuração
setupDatabase();