@echo off
REM Script para iniciar o servidor local do CRM System 1.0

echo Iniciando o servidor local do CRM System 1.0...
echo.

REM Verifica se o pnpm está instalado
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: pnpm não está instalado ou não está no PATH.
    echo Por favor, instale o pnpm executando: npm install -g pnpm
    echo Mais informações em: https://pnpm.io/installation
    exit /b 1
)

REM Verifica se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependências...
    pnpm install
    if %errorlevel% neq 0 (
        echo Erro ao instalar dependências.
        exit /b 1
    )
)

REM Inicia o servidor de desenvolvimento
echo Iniciando o servidor de desenvolvimento...
pnpm dev