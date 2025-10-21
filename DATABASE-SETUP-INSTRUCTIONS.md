# CRM System 1.0 - Database Setup Instructions

This document provides the complete instructions to set up your CRM system with the PostgreSQL database on your server.

> Atualize os placeholders `<SEU_SERVIDOR_IP>`, `<SEU_BANCO_POSTGRES>` e `<SUA_SENHA_POSTGRES>` com os dados da sua configuracao.

## Prerequisites

- SSH access to your server at <SEU_SERVIDOR_IP>
- PostgreSQL installed and running on your server
- sudo privileges on the server

## Database Configuration

- Database Name: `<SEU_BANCO_POSTGRES>`
- Database User: `postgres`
- Server IP: `<SEU_SERVIDOR_IP>`
- Port: `5432`
- Password: `<SUA_SENHA_POSTGRES>`
- SSL: Disabled (DB_SSL=false)

## Step 1: SSH into your server and create the database

Connect to your server via SSH:

```bash
ssh seu_usuario@<SEU_SERVIDOR_IP>
```

Connect to PostgreSQL as superuser and create the database:

```sql
sudo -u postgres psql

-- Create the database
CREATE DATABASE <SEU_BANCO_POSTGRES>;

-- Enable UUID extension
\c <SEU_BANCO_POSTGRES>;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exit psql
\q
```

## Step 2: Configure PostgreSQL for External Connections

Edit the postgresql.conf file:

```bash
sudo nano /etc/postgresql/[version]/main/postgresql.conf
```

Change the listen_addresses setting:

```
listen_addresses = '*'
```

Edit the pg_hba.conf file:

```bash
sudo nano /etc/postgresql/[version]/main/pg_hba.conf
```

Add the following line to allow connections from any IP (for the CRM database):

```
host    <SEU_BANCO_POSTGRES>      postgres      0.0.0.0/0       md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

## Step 3: Open Firewall

Open the PostgreSQL port in your firewall:

```bash
sudo ufw allow 5432/tcp
```

## Step 4: Apply Database Schema

You have multiple options to create the database schema in your PostgreSQL database:

### Option A: Using the application's own functions (Recommended)
From your local machine (where the CRM system is located), run the schema creation script:

```bash
# Create only the tables using the application's functions
pnpm run db:tables
```

### Option B: Using the provided SQL file
```bash
# Using the provided script
./run-db-remote.sh schema  # On Linux/Mac
run-db-remote.bat schema   # On Windows
```

Or execute the SQL manually:

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -f db-schema.sql
```

## Step 5: Insert Demo Data

After creating the tables, you can add demo data to your database using these methods:

### Option A: Using the application's own functions (Recommended)
```bash
# Create tables and insert demo data using application functions
pnpm run db:setup
```

### Option B: Using the SQL file
```bash
# Using the seed script
./run-db-remote.sh seed  # On Linux/Mac
run-db-remote.bat seed   # On Windows
```

Or execute the SQL manually:

```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -f db-seed.sql
```

## Step 6: Verify Database Connection

To test the connection to your database:

```bash
# Run the test script
npx tsx test-db-connection.ts
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm run db:test` - Test the database connection
- `pnpm run db:seed` - Run the demo data script (requires tsx)
- `pnpm run db:schema` - Run the schema creation script (requires psql)
- `pnpm run db:seed-sql` - Run the SQL seed script (requires psql)

## Running the CRM

After setting up the database, you can start the CRM system:

```bash
pnpm dev
```

The system will be available at [http://localhost:3000](http://localhost:3000)

## Security Considerations for Non-SSL Connections

Since your server is configured without SSL:

- Consider restricting database access to specific IP addresses in pg_hba.conf instead of 0.0.0.0/0
- Use a VPN or SSH tunnel for database connections in production
- Monitor database access logs for unusual activity
- Change the database password regularly

## Troubleshooting

### Connection Issues
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check if firewall is blocking: `sudo ufw status`
3. Verify PostgreSQL configuration allows connections: `sudo netstat -tuln | grep 5432`
4. Confirm the password is correct

### Authentication Issues
1. Ensure the pg_hba.conf file allows your IP with md5 authentication
2. Make sure you're using the correct password
3. Verify the database name is correct

### Schema Creation Issues
1. Verify the db-schema.sql file exists and is readable in your project directory
2. Make sure all PostgreSQL extensions (like uuid-ossp) are installed
