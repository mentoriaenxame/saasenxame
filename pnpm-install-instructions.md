# Instruções de Instalação do pnpm

Este projeto foi configurado para usar pnpm como gerenciador de pacotes. Este arquivo contém instruções sobre como instalar e usar pnpm.

## Instalando pnpm

Se você ainda não tem o pnpm instalado, execute um dos comandos abaixo:

### Usando npm:
```bash
npm install -g pnpm
```

### Usando yarn:
```bash
yarn global add pnpm
```

### Usando Chocolatey (Windows):
```bash
choco install pnpm
```

### Usando Scoop (Windows):
```bash
scoop install pnpm
```

### Usando Homebrew (macOS):
```bash
brew install pnpm
```

## Instalando dependências do projeto

Dentro do diretório do projeto, execute:

```bash
pnpm install
```

## Rodando o projeto

### Modo de desenvolvimento:
```bash
pnpm dev
```

### Criando uma build de produção:
```bash
pnpm build
```

### Rodando em modo produção:
```bash
pnpm start
```

## Gerenciando pacotes

### Adicionando um novo pacote:
```bash
pnpm add <nome-do-pacote>
```

### Removendo um pacote:
```bash
pnpm remove <nome-do-pacote>
```

### Adicionando um pacote de desenvolvimento:
```bash
pnpm add -D <nome-do-pacote>
```

## Alternativas para quem não pode usar pnpm

Se por algum motivo você não puder usar pnpm, você pode converter este projeto para usar npm ou yarn:

### Usando npm:
```bash
# Remova o diretório node_modules e pnpm-lock.yaml
rm -rf node_modules pnpm-lock.yaml

# Instale as dependências usando npm
npm install

# Execute os scripts normalmente
npm run dev
```

### Usando yarn:
```bash
# Remova o diretório node_modules e pnpm-lock.yaml
rm -rf node_modules pnpm-lock.yaml

# Instale yarn se ainda não tiver
npm install -g yarn

# Instale as dependências usando yarn
yarn install

# Execute os scripts normalmente
yarn dev
```

## Informações sobre pnpm

Este projeto usa pnpm por ser mais rápido e eficiente em uso de disco do que npm e yarn. O pnpm cria um armazenamento global de pacotes e usa links simbólicos para compartilhar dependências entre projetos, resultando em:

- Instalações mais rápidas
- Menor uso de disco
- Dependências consistentes