// Script para testar a conexão com o banco de dados PostgreSQL
// Este script deve ser executado com o ambiente configurado

import { testConnection, checkEnvironmentVariables } from './lib/db-config';

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
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✓ Conexão com o banco de dados bem-sucedida!');
      process.exit(0);
    } else {
      console.log('✗ Falha na conexão com o banco de dados.');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Erro durante o teste de conexão:', error);
    process.exit(1);
  }
}

// Executar o teste
runDbTest();