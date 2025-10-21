// Script para criar as tabelas no banco de dados diretamente usando as funções do aplicativo

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
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        password_hash TEXT,
        salt TEXT,
        last_login TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true
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

    console.log('\n✓ Todas as tabelas criadas com sucesso!');
    console.log('O banco de dados está pronto para uso com o CRM.');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar a criação das tabelas
createTables().catch(error => {
  console.error('\n❌ Erro durante a criação das tabelas:', error);
  process.exit(1);
});