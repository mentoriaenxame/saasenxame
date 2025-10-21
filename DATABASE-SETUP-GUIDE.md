# PostgreSQL Database Setup for CRM System

> Substitua os placeholders `<SEU_SERVIDOR_IP>`, `<SEU_BANCO_POSTGRES>` e `<SUA_SENHA_POSTGRES>` pelos dados do seu ambiente.

## Required Information
- Server IP: <SEU_SERVIDOR_IP> (substitua pelo IP da sua VPS)
- Database Name: <SEU_BANCO_POSTGRES> (escolha o nome do seu banco)
- Database User: postgres (ou o usuario que voce criou)
- Database Port: 5432
- Password: <SUA_SENHA_POSTGRES> (defina uma senha segura)

## Step 1: SSH into your server
```bash
ssh seu_usuario@<SEU_SERVIDOR_IP>
```

## Step 2: Connect to PostgreSQL and create the database
```bash
psql -U postgres -h localhost -p 5432
```

## Step 3: Execute these commands in PostgreSQL
```sql
-- Create the database
CREATE DATABASE <SEU_BANCO_POSTGRES>;

-- Enable UUID extension in the new database
\c <SEU_BANCO_POSTGRES>;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE <SEU_BANCO_POSTGRES> TO postgres;

-- Verify the database exists
\l

-- Exit PostgreSQL
\q
```

## Step 4: Update the pg_hba.conf file
Edit the pg_hba.conf file to allow external connections:
```bash
sudo nano /etc/postgresql/[version]/main/pg_hba.conf
```

Add this line to allow connections to the <SEU_BANCO_POSTGRES> database:
```
host    <SEU_BANCO_POSTGRES>      postgres      0.0.0.0/0       md5
```

## Step 5: Update postgresql.conf to allow external connections
```bash
sudo nano /etc/postgresql/[version]/main/postgresql.conf
```

Find and update:
```
listen_addresses = '*'
```

## Step 6: Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

## Step 7: Open the firewall for PostgreSQL
```bash
sudo ufw allow 5432/tcp
```

## Step 8: Test the connection from your local machine
```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES>
```

## Step 9: Run the schema creation script
Once you've confirmed the database connection works, run this from your local machine:
```bash
# Using the provided script
./run-db-remote.sh schema
# or on Windows
run-db-remote.bat schema
```

## Troubleshooting
If you have connection issues:
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check if firewall is blocking: `sudo ufw status`
3. Verify PostgreSQL configuration allows connections
4. Confirm the password is correct

## Security Note for Non-SSL Setup
Since your server doesn't support SSL, consider these security measures:
1. Create a dedicated database user instead of using the postgres superuser
2. Restrict pg_hba.conf to only allow specific IP addresses rather than 0.0.0.0/0
3. Consider using a VPN or SSH tunnel for database connections
4. Enable SSL on your PostgreSQL server in the future for secure data transmission
