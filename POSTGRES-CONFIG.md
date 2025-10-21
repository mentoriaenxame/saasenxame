# ConfiguraÃ§Ã£o do PostgreSQL para o CRM System 1.0

Este documento explica como configurar e conectar o banco de dados PostgreSQL ao seu projeto CRM System.

> Utilize os placeholders <SEU_SERVIDOR_IP>, <SEU_BANCO_POSTGRES> e <SUA_SENHA_POSTGRES> como marcadores e substitua pelos seus dados antes de executar os comandos.

## ConfiguraÃ§Ã£o Local vs Remota

Este projeto suporta tanto configuraÃ§Ã£o local quanto remota do PostgreSQL. Este documento aborda ambas as configuraÃ§Ãµes.

## PrÃ©-requisitos

- PostgreSQL instalado e em execuÃ§Ã£o em sua mÃ¡quina (para configuraÃ§Ã£o local)
OU
- Acesso a uma VPS com PostgreSQL instalado e em execuÃ§Ã£o (para configuraÃ§Ã£o remota)
- Um cliente PostgreSQL (como pgAdmin, psql ou DBeaver) para gerenciar o banco de dados

## ConfiguraÃ§Ã£o Local

Se vocÃª estiver configurando localmente:

### Passo 1: Criar o banco de dados

1. Conecte-se ao PostgreSQL como superusuÃ¡rio:
   ```bash
   psql -U postgres
   ```

2. Crie o banco de dados:
   ```sql
   CREATE DATABASE crm_db;
   ```

3. Crie um usuÃ¡rio para o projeto (opcional, mas recomendado):
   ```sql
   CREATE USER crm_user WITH PASSWORD 'senha_segura';
   GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
   ```

4. Saia do PostgreSQL:
   ```sql
   \q
   ```

## ConfiguraÃ§Ã£o Remota (VPS)

Se vocÃª estiver usando uma VPS com PostgreSQL (como no seu caso com IP <SEU_SERVIDOR_IP>):

### Passo 1: Conectar-se Ã  VPS

1. Conecte-se Ã  sua VPS via SSH:
   ```bash
   ssh seu_usuario@<SEU_SERVIDOR_IP>
   ```

2. Conecte-se ao PostgreSQL como superusuÃ¡rio:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Passo 2: Criar o banco de dados na VPS

Dentro do console do PostgreSQL, execute:

```sql
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD '<SUA_SENHA_POSTGRES>';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
\q
```

### Passo 3: Permitir conexÃµes remotas (caso necessÃ¡rio)

Se seu PostgreSQL na VPS nÃ£o aceitar conexÃµes externas, vocÃª precisarÃ¡:

1. Editar o arquivo `postgresql.conf` para ajustar `listen_addresses`:
   ```
   listen_addresses = '*'
   ```

2. Editar o arquivo `pg_hba.conf` para adicionar uma regra de autenticaÃ§Ã£o:
   ```
   host    crm_db      postgres      0.0.0.0/0       md5
   ```

3. Reiniciar o serviÃ§o PostgreSQL:
   ```bash
   sudo systemctl restart postgresql
   ```

### Passo 4: Configurar SSL para conexÃµes remotas seguras

Para conexÃµes remotas seguras, Ã© recomendado habilitar SSL:

1. No arquivo `postgresql.conf`, configure:
   ```
   ssl = on
   ssl_cert_file = '/etc/ssl/certs/ssl-cert.pem'
   ssl_key_file = '/etc/ssl/private/ssl-cert.key'
   ```

2. No seu cÃ³digo Node.js, configure SSL como fizemos no arquivo `db-config.ts`.

## Passo 2: Configurar variÃ¡veis de ambiente

Atualize o arquivo `.env.local` na raiz do projeto com as configuraÃ§Ãµes corretas do seu banco de dados:

Para configuraÃ§Ã£o remota sem SSL (padrÃ£o para este setup):
```env
DB_USER=postgres
DB_HOST=<SEU_SERVIDOR_IP>
DB_NAME=<SEU_BANCO_POSTGRES>
DB_PASSWORD=<SUA_SENHA_POSTGRES>
DB_PORT=5432
DB_SSL=false
```

Para configuraÃ§Ã£o remota com SSL (opcional):
```env
DB_USER=postgres
DB_HOST=<SEU_SERVIDOR_IP>
DB_NAME=<SEU_BANCO_POSTGRES>
DB_PASSWORD=<SUA_SENHA_POSTGRES>
DB_PORT=5432
DB_SSL=true
```

## Passo 3: Executar o script de criaÃ§Ã£o do banco de dados

Para execuÃ§Ã£o remota (a partir da sua mÃ¡quina local):
```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db -f db-schema.sql
```

Ou conecte-se ao banco de dados via psql e execute:

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db
```

Dentro do psql, execute:

```sql
\i caminho/para/db-schema.sql
```

## Passo 4: Popular o banco com dados iniciais (opcional)

Para inserir dados de exemplo no banco de dados remotamente, execute:

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db -f db-seed.sql
```

## Passo 5: Atualizar o cÃ³digo do projeto

Para usar o banco de dados PostgreSQL no lugar dos dados mockados:

1. No arquivo `app/layout.tsx`, o import do contexto jÃ¡ estÃ¡ correto:
   ```tsx
   import { CRMProvider } from "@/lib/crm-context-db"
   ```

2. Certifique-se de que as dependÃªncias necessÃ¡rias estejam instaladas:
   ```bash
   pnpm add pg
   ```

## ConsideraÃ§Ãµes importantes

1. **SeguranÃ§a**: Nunca coloque senhas reais ou informaÃ§Ãµes sensÃ­veis em arquivos de cÃ³digo ou versionamento (git). O arquivo `.env.local` deve ser adicionado ao `.gitignore` (jÃ¡ estÃ¡ configurado por padrÃ£o no Next.js).

2. **ConexÃ£o ao banco**: O cÃ³digo usa um pool de conexÃµes para gerenciar as conexÃµes ao banco de dados. As configuraÃ§Ãµes padrÃ£o sÃ£o adequadas para desenvolvimento, mas considere ajustar para produÃ§Ã£o.

3. **Firewall e SeguranÃ§a**: Ao usar uma VPS, certifique-se de configurar corretamente as regras de firewall para permitir conexÃµes na porta 5432 apenas de IPs confiÃ¡veis.

4. **MigraÃ§Ãµes**: Para gerenciar mudanÃ§as na estrutura do banco de dados em produÃ§Ã£o, considere usar uma ferramenta como Prisma ou Knex para gerenciar migraÃ§Ãµes de banco de dados.

5. **Performance**: Ãndices foram adicionados nas colunas mais comumente usadas em consultas. Adicione mais Ã­ndices conforme necessÃ¡rio com base nos padrÃµes de consulta da sua aplicaÃ§Ã£o.

## SoluÃ§Ã£o de problemas

### Erro de conexÃ£o
- Verifique se o PostgreSQL na VPS estÃ¡ em execuÃ§Ã£o
- Confirme as configuraÃ§Ãµes no arquivo `.env.local`
- Verifique se a porta 5432 (ou a porta configurada) nÃ£o estÃ¡ bloqueada por firewall
- Confirme que as regras do firewall permitem conexÃµes de sua localizaÃ§Ã£o atual

### Erro de autenticaÃ§Ã£o
- Verifique o nome de usuÃ¡rio e senha no arquivo `.env.local`
- Confirme se o usuÃ¡rio tem permissÃµes para acessar o banco de dados
- Verifique se a configuraÃ§Ã£o de autenticaÃ§Ã£o no pg_hba.conf permite conexÃµes externas

### PermissÃµes de banco de dados
Se usar um usuÃ¡rio especÃ­fico para o CRM:
```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO crm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO crm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO crm_user;
```

