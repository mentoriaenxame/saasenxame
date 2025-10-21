# Troubleshooting Database Connection Issues

## Error: async getAllClientes@rsc://React/Server/webpack-internal:///(action-browser)

This error appears when the CRM system tries to connect to the PostgreSQL database but fails. Follow these steps to resolve the issue:

> Ajuste os placeholders <SEU_SERVIDOR_IP>, <SEU_BANCO_POSTGRES> e <SUA_SENHA_POSTGRES> para refletir os seus dados ao testar os comandos abaixo.

## 1. Verify Database Exists
First, confirm that your database was created on the server:

```bash
# Test basic connection to PostgreSQL server
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -c "SELECT 1;"

# Test connection to your specific database
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -c "SELECT 1;"
```

If these commands fail, the database has not been created yet.

## 2. Verify Database Setup Steps Completed
Make sure all these steps have been completed on your server:

### Step A: Database Creation
```sql
sudo -u postgres psql
CREATE DATABASE <SEU_BANCO_POSTGRES>;
\c <SEU_BANCO_POSTGRES>;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

### Step B: PostgreSQL Configuration
- `postgresql.conf`: `listen_addresses = '*'`
- `pg_hba.conf`: `host    <SEU_BANCO_POSTGRES>      postgres      0.0.0.0/0       md5`

### Step C: Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

### Step D: Firewall Configuration
```bash
sudo ufw allow 5432/tcp
```

## 3. Test Database Connection
Before starting the CRM, test the database connection:

```bash
# Test connection using the same credentials as your application
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -W
```
When prompted, enter the password: `<SUA_SENHA_POSTGRES>`

## 4. Verify Schema Creation
Confirm that the schema was applied to the database:

```bash
# Connect to database and check if tables exist
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -c "\dt"
```

You should see tables like `clientes`, `usuarios`, `atividades`, etc.

## 5. Run Database Schema (if not done yet)

You have multiple options to create the database schema:

### Using the application's own functions (Recommended):
```bash
# Create only the tables using the application's functions
pnpm run db:tables
```

### Using the SQL file:
```bash
# From your CRM project directory
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -f db-schema.sql
```

Or use the provided script:
```bash
./run-db-remote.sh schema  # Linux/Mac
run-db-remote.bat schema   # Windows
```

## 6. Apply Demo Data (optional but recommended)

### Using the application's own functions (Recommended):
```bash
# Create tables and insert demo data using application functions
pnpm run db:setup
```

### Using the SQL file:
```bash
# From your CRM project directory
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -f db-seed.sql
```

Or use the provided script:
```bash
./run-db-remote.sh seed  # Linux/Mac
run-db-remote.bat seed   # Windows
```

## 7. Test the Connection via Application
After confirming your database is properly set up, test your application's connection:

```bash
# From your CRM project directory
npx tsx test-db-connection.ts
```

## 8. Environment Variables Check
Verify your `.env.local` file has the correct settings:

```
DB_USER=postgres
DB_HOST=<SEU_SERVIDOR_IP>
DB_NAME=<SEU_BANCO_POSTGRES>
DB_PASSWORD=<SUA_SENHA_POSTGRES>
DB_PORT=5432
DB_SSL=false
```

## 9. Common Issues and Solutions

### Issue: "Connection refused"
- Check if PostgreSQL is running on the server: `sudo systemctl status postgresql`
- Verify the server is listening on the correct IP: `sudo netstat -tuln | grep 5432`
- Confirm firewall allows connections: `sudo ufw status`

### Issue: "Authentication failed"
- Verify the password in your .env.local file matches the PostgreSQL user password
- Check that the pg_hba.conf file is configured correctly

### Issue: "Database does not exist"
- The database `<SEU_BANCO_POSTGRES>` has not been created yet
- Follow the database creation steps in the main setup guide

### Issue: "Extension uuid-ossp does not exist"
- The UUID extension was not created
- Connect to the database and run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

## 10. Starting the CRM Application
Only start the CRM application after confirming all previous steps are completed:

```bash
pnpm dev
```

If you still encounter errors after following all these steps, the database setup may need to be completed on your server before the CRM application can function properly.

