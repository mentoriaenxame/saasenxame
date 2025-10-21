// Configuração do banco de dados PostgreSQL
import { Pool } from 'pg';

// Função auxiliar para determinar configuração SSL
function getSSLConfig(): boolean | object {
  if (process.env.DB_SSL) {
    if (process.env.DB_SSL === 'true') {
      return { 
        rejectUnauthorized: false, // Aceitar certificados autoassinados para conexão remota
        sslmode: 'require' // Forçar modo SSL
      };
    } else {
      return false; // Desabilitar SSL se DB_SSL for 'false'
    }
  }
  return false; // Padrão: sem SSL
}

// Função para criar o pool de conexão (chamada dinamicamente para garantir variáveis de ambiente carregadas)
export function createPool(): Pool {
  return new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'crm_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    // Adicionando opções para conexão remota
    ssl: getSSLConfig(),
    connectionTimeoutMillis: 15000, // 15 segundos de timeout para conexão
    idleTimeoutMillis: 30000, // 30 segundos de timeout para conexão ociosa
  });
}

// Função para obter o pool (carrega as variáveis de ambiente dinamicamente)
export function getPool(): Pool {
  return createPool();
}

// Função para testar a conexão com o banco de dados
export async function testConnection(): Promise<boolean> {
  const pool = createPool();
  try {
    const client = await pool.connect();
    console.log('Conectado ao banco de dados PostgreSQL com sucesso!');
    client.release();
    await pool.end();
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', err);
    await pool.end();
    return false;
  }
}

// Função para verificar se as variáveis de ambiente estão configuradas
export function checkEnvironmentVariables() {
  const requiredEnvVars = [
    'DB_USER',
    'DB_HOST',
    'DB_NAME',
    'DB_PASSWORD',
    'DB_PORT'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.warn('Variáveis de ambiente do banco de dados ausentes:', missingEnvVars);
    return false;
  }

  return true;
}

// Função para verificar se é uma conexão remota
export function isRemoteConnection(): boolean {
  const host = process.env.DB_HOST;
  return host !== 'localhost' && host !== '127.0.0.1' && !!host;
}