#!/bin/bash

# Script para iniciar o servidor local do CRM System 1.0

echo "Iniciando o servidor local do CRM System 1.0..."
echo

# Verifica se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "Erro: pnpm não está instalado ou não está no PATH."
    echo "Por favor, instale o pnpm executando: npm install -g pnpm"
    echo "Mais informações em: https://pnpm.io/installation"
    exit 1
fi

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "Erro ao instalar dependências."
        exit 1
    fi
fi

# Inicia o servidor de desenvolvimento
echo "Iniciando o servidor de desenvolvimento..."
pnpm dev