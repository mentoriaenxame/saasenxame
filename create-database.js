// Configure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD e DB_NAME no seu .env antes de executar.
require('dotenv').config({ path: process.env.ENV_FILE ?? '.env.local' });
const { Client } = require('pg');

async function createDatabase() {
  const databaseName = process.env.DB_NAME;
  const baseConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  if (!databaseName || !baseConfig.host || !baseConfig.user || !baseConfig.password) {
    console.error(
      '\nPreencha DB_HOST, DB_PORT, DB_USER, DB_PASSWORD e DB_NAME antes de executar este script.\n'
    );
    process.exit(1);
  }

  const adminClient = new Client({ ...baseConfig, database: 'postgres' });

  try {
    await adminClient.connect();
    console.log('Conexao estabelecida com o servidor PostgreSQL.');

    const dbExists = await adminClient.query(
      'SELECT 1 FROM pg_catalog.pg_database WHERE datname = $1',
      [databaseName]
    );

    if (dbExists.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${databaseName}";`);
      console.log(`Banco ${databaseName} criado com sucesso.`);
    } else {
      console.log(`Banco ${databaseName} ja existe.`);
    }

    const appClient = new Client({ ...baseConfig, database: databaseName });

    await appClient.connect();
    console.log(`Conexao estabelecida com o banco ${databaseName}.`);

    await appClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('Extensao uuid-ossp garantida.');

    await appClient.end();
    console.log('Configuracao do banco concluida.');
  } catch (err) {
    console.error('Erro ao configurar o banco:', err);
  } finally {
    await adminClient.end();
  }
}

createDatabase();
