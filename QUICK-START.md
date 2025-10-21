# Guia RÃ¡pido de ConfiguraÃ§Ã£o - CRM System 1.0

Siga estes passos para configurar e executar o sistema CRM com PostgreSQL.

> Lembre-se de substituir os placeholders <SEU_SERVIDOR_IP>, <SEU_BANCO_POSTGRES> e <SUA_SENHA_POSTGRES> pelos seus dados reais ao seguir os comandos.

## 1. PrÃ©-requisitos

- Node.js (versÃ£o 18 ou superior)
- pnpm
- PostgreSQL

## 2. ConfiguraÃ§Ã£o do ambiente

### Clone o repositÃ³rio:
```bash
git clone <url-do-repositorio>
cd crm-system1.0
```

### Instale as dependÃªncias:
```bash
pnpm install
```

## 3. ConfiguraÃ§Ã£o do banco de dados PostgreSQL

### 3.1. ConfiguraÃ§Ã£o local vs remota

Este projeto pode utilizar um banco de dados PostgreSQL local ou remoto (em uma VPS). Neste guia, estamos assumindo que vocÃª estÃ¡ usando o PostgreSQL em uma VPS com o IP <SEU_SERVIDOR_IP>.

### 3.2. Crie o banco de dados na VPS

Primeiro, conecte-se Ã  sua VPS via SSH:

```bash
ssh seu_usuario@<SEU_SERVIDOR_IP>
```

Depois, conecte-se ao PostgreSQL como superusuÃ¡rio:

```bash
psql -U postgres -h localhost -p 5432
```

Dentro do console do PostgreSQL, execute os seguintes comandos para criar o banco de dados:

```sql
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD '<SUA_SENHA_POSTGRES>';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
\q
```

### 3.3. Permita conexÃµes externas (caso necessÃ¡rio)

Se seu PostgreSQL nÃ£o aceitar conexÃµes externas, vocÃª precisarÃ¡:

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

### 3.4. Verifique as configuraÃ§Ãµes de firewall

Certifique-se de que a porta 5432 (ou a porta configurada para PostgreSQL) esteja aberta no firewall do seu servidor:

```bash
# Para ufw (Ubuntu)
sudo ufw allow 5432/tcp

# Para firewall-cmd (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload

# Para iptables
sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT
```

### 3.5. Teste a conexÃ£o remota

Antes de executar o aplicativo, teste manualmente a conexÃ£o com o banco de dados:

```bash
# Teste de conexÃ£o via psql
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db

# Para conexÃ£o sem SSL (padrÃ£o para este setup)
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db

# Se estiver usando SSL
# PGSSLMODE=require psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db
```

### 3.6. SoluÃ§Ã£o de problemas comuns

Se a conexÃ£o falhar, verifique:

1. O PostgreSQL estÃ¡ em execuÃ§Ã£o na VPS
2. O IP do servidor estÃ¡ correto
3. A porta PostgreSQL estÃ¡ aberta no firewall
4. As credenciais de usuÃ¡rio e senha estÃ£o corretas
5. O banco de dados 'crm_db' foi criado
6. As configuraÃ§Ãµes do pg_hba.conf permitem conexÃµes do seu IP

### 3.4. Execute o script de estrutura do banco de dados remotamente

A partir da sua mÃ¡quina local (onde estÃ¡ o projeto CRM), execute:

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db -f db-schema.sql
```

### 3.5. (Opcional) Popule com dados iniciais

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d crm_db -f db-seed.sql
```

## 4. ConfiguraÃ§Ã£o das variÃ¡veis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variÃ¡veis:

```env
# ConfiguraÃ§Ãµes do banco de dados PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=crm_db
DB_PASSWORD=senha_segura  # Substitua pela sua senha real
DB_PORT=5432

# ConfiguraÃ§Ãµes do Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O sistema estarÃ¡ disponÃ­vel em [http://localhost:3000](http://localhost:3000)

## 6. Teste a conexÃ£o com o banco de dados

Para verificar se a conexÃ£o com o banco de dados estÃ¡ funcionando:

```bash
pnpm run db:test
```

## SoluÃ§Ã£o de problemas

### Erro de conexÃ£o com o banco de dados
- Verifique se o PostgreSQL estÃ¡ em execuÃ§Ã£o
- Confirme que o banco de dados `crm_db` foi criado
- Verifique as credenciais no arquivo `.env.local`

### Erro de permissÃ£o
- Certifique-se de que o usuÃ¡rio especificado tem permissÃµes para acessar o banco de dados
- Verifique se vocÃª estÃ¡ usando o usuÃ¡rio correto para se conectar

### Porta 5432 bloqueada
- Verifique se outra instÃ¢ncia do PostgreSQL nÃ£o estÃ¡ em execuÃ§Ã£o
- Verifique se nÃ£o hÃ¡ conflitos com outros serviÃ§os na mesma porta

