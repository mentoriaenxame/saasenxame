@echo off
REM Antes de usar, configure os dados da sua instancia PostgreSQL abaixo
REM ou exponha as variaveis de ambiente correspondentes.
REM set HOST=seu_host_postgres
REM set USER=seu_usuario_postgres
REM set PORT=5432
REM set DB=seu_banco_postgres
REM set PASSWORD=sua_senha_postgres

if not defined HOST if defined DB_HOST set "HOST=%DB_HOST%"
if not defined USER if defined DB_USER set "USER=%DB_USER%"
if not defined PORT if defined DB_PORT set "PORT=%DB_PORT%"
if not defined DB if defined DB_NAME set "DB=%DB_NAME%"
if not defined PASSWORD if defined DB_PASSWORD set "PASSWORD=%DB_PASSWORD%"

if not defined USER set "USER=postgres"
if not defined PORT set "PORT=5432"

if not defined HOST (
  echo Configure HOST (arquivo ou variavel de ambiente) antes de executar.
  goto :end
)

if not defined DB (
  echo Configure DB (arquivo ou variavel de ambiente) antes de executar.
  goto :end
)

if not defined PASSWORD (
  echo Configure PASSWORD (arquivo ou variavel de ambiente) antes de executar.
  goto :end
)

echo Executando comando no banco de dados remoto...
echo Host: %HOST%
echo Banco de dados: %DB%
echo.

if /I "%~1"=="schema" (
  echo Executando script de estrutura do banco de dados...
  set "PGPASSWORD=%PASSWORD%"
  psql -h "%HOST%" -U "%USER%" -p "%PORT%" -d "%DB%" -f db-schema.sql
) else if /I "%~1"=="seed" (
  echo Executando script de dados iniciais...
  set "PGPASSWORD=%PASSWORD%"
  psql -h "%HOST%" -U "%USER%" -p "%PORT%" -d "%DB%" -f db-seed.sql
) else if /I "%~1"=="test" (
  echo Testando conexao com o banco de dados...
  set "PGPASSWORD=%PASSWORD%"
  psql -h "%HOST%" -U "%USER%" -p "%PORT%" -d "%DB%" -c "SELECT version();"
) else (
  echo Uso: %~nx0 [schema^|seed^|test]
  echo.
  echo Opcoes:
  echo   schema - Executa o script de estrutura do banco de dados (db-schema.sql)
  echo   seed   - Executa o script de dados iniciais (db-seed.sql)
  echo   test   - Testa a conexao com o banco de dados
)

:end
pause
