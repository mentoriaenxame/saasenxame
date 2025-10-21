#!/bin/bash

# Antes de usar, informe os dados da sua instancia PostgreSQL abaixo
# ou exponha as variaveis de ambiente correspondentes.
# HOST="seu_host_postgres"
# USER="seu_usuario_postgres"
# PORT="5432"
# DB="seu_banco_postgres"
# PASSWORD="sua_senha_postgres"

HOST="${HOST:-${DB_HOST:-}}"
USER="${USER:-${DB_USER:-postgres}}"
PORT="${PORT:-${DB_PORT:-5432}}"
DB="${DB:-${DB_NAME:-}}"
PASSWORD="${PASSWORD:-${DB_PASSWORD:-}}"

if [ -z "$HOST" ] || [ -z "$DB" ] || [ -z "$PASSWORD" ]; then
  echo "Configure HOST, DB e PASSWORD (arquivo ou variaveis de ambiente) antes de executar."
  exit 1
fi

echo "Executando comando no banco de dados remoto..."
echo "Host: $HOST"
echo "Banco de dados: $DB"
echo

case "$1" in
  "schema")
    echo "Executando script de estrutura do banco de dados..."
    PGPASSWORD=$PASSWORD psql -h "$HOST" -U "$USER" -p "$PORT" -d "$DB" -f db-schema.sql
    ;;
  "seed")
    echo "Executando script de dados iniciais..."
    PGPASSWORD=$PASSWORD psql -h "$HOST" -U "$USER" -p "$PORT" -d "$DB" -f db-seed.sql
    ;;
  "test")
    echo "Testando conexao com o banco de dados..."
    PGPASSWORD=$PASSWORD psql -h "$HOST" -U "$USER" -p "$PORT" -d "$DB" -c "SELECT version();"
    ;;
  *)
    echo "Uso: $0 {schema|seed|test}"
    echo
    echo "Opcoes:"
    echo "  schema - Executa o script de estrutura do banco de dados (db-schema.sql)"
    echo "  seed   - Executa o script de dados iniciais (db-seed.sql)"
    echo "  test   - Testa a conexao com o banco de dados"
    ;;
esac
