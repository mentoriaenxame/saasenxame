// Script para testar a conexão com o banco de dados PostgreSQL
// Este script deve carregar as variáveis de ambiente do .env.local

import { config } from 'dotenv';
import { testConnection, checkEnvironmentVariables, isRemoteConnection, createPool } from './lib/db-config';

// Carregar variáveis de ambiente do .env.local
config({ path: './.env.local' });

async function runDbTest() {
  console.log('Iniciando teste de conexão com o banco de dados...');
  
  // Verificar se as variáveis de ambiente estão configuradas
  if (!checkEnvironmentVariables()) {
    console.log('✗ Variáveis de ambiente do banco de dados não estão configuradas corretamente.');
    process.exit(1);
  }
  
  console.log('✓ Variáveis de ambiente verificadas.');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`SSL: ${process.env.DB_SSL || 'false'}`);
  console.log(`É conexão remota: ${isRemoteConnection()}`);
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✓ Conexão com o banco de dados bem-sucedida!');
      process.exit(0);
    } else {
      console.log('✗ Falha na conexão com o banco de dados.');
      console.log('Verifique:');
      console.log('  - Se o PostgreSQL está em execução na VPS');
      console.log('  - Se as configurações de firewall permitem conexões na porta 5432');
      console.log('  - Se o pg_hba.conf permite conexões do seu IP');
      console.log('  - Se o banco de dados \'crm_db\' foi criado');
      console.log('  - Se as credenciais (usuário, senha) estão corretas');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Erro durante o teste de conexão:', error);
    process.exit(1);
  }
}

// Executar o teste
runDbTest();