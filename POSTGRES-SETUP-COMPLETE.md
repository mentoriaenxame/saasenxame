# PostgreSQL Database Setup for CRM System

## Overview
This guide will help you set up the PostgreSQL database for your CRM system on your server at <SEU_SERVIDOR_IP>. The database will be named `<SEU_BANCO_POSTGRES>`.

> Substitua `<SEU_SERVIDOR_IP>`, `<SEU_BANCO_POSTGRES>` e `<SUA_SENHA_POSTGRES>` pelos seus dados antes de seguir os passos.

## Prerequisites
- SSH access to your server (<SEU_SERVIDOR_IP>)
- PostgreSQL installed and running on your server
- sudo privileges on the server

## Configuration Details
- Server IP: <SEU_SERVIDOR_IP>
- Database Name: <SEU_BANCO_POSTGRES>
- Database User: postgres
- Database Port: 5432
- Password: <SUA_SENHA_POSTGRES>

## Step-by-Step Setup

### Step 1: SSH into your server
```bash
ssh seu_usuario@<SEU_SERVIDOR_IP>
```

### Step 2: Connect to PostgreSQL and create the database
```bash
sudo -u postgres psql
```

### Step 3: Execute these commands in PostgreSQL
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

### Step 4: Configure PostgreSQL to accept external connections
Edit the postgresql.conf file:
```bash
sudo nano /etc/postgresql/[version]/main/postgresql.conf
```

Find the line with `listen_addresses` and change it to:
```
listen_addresses = '*'
```

### Step 5: Configure authentication in pg_hba.conf
Edit the pg_hba.conf file:
```bash
sudo nano /etc/postgresql/[version]/main/pg_hba.conf
```

Add or modify this line to allow connections from your IP:
```
host    <SEU_BANCO_POSTGRES>      postgres      0.0.0.0/0       md5
```

For more security, you can restrict to your specific IP address:
```
host    <SEU_BANCO_POSTGRES>      postgres      YOUR_IP/32      md5
```

### Step 6: Restart PostgreSQL service
```bash
sudo systemctl restart postgresql
```

### Step 7: Configure firewall to allow PostgreSQL connections
```bash
# If using ufw
sudo ufw allow 5432/tcp

# If using iptables
sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT

# If using firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

### Step 8: Test the connection from your local machine
From your local machine (where the CRM project is), test the connection:
```bash
psql -h <SEU_SERVIDOR_IP> -U postgres -p 5432 -d <SEU_BANCO_POSTGRES> -W
```
It will prompt for the password (<SUA_SENHA_POSTGRES>).

### Step 9: Run the schema creation script
Once you've confirmed the database connection works, run this from your local machine in the CRM directory:
```bash
# For Linux/Mac
./run-db-remote.sh schema

# For Windows
run-db-remote.bat schema
```

### Step 10: Verify the tables were created
```bash
# For Linux/Mac
./run-db-remote.sh test

# For Windows
run-db-remote.bat test
```

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

## Security Recommendations for Non-SSL Setup

Since your server doesn't support SSL, consider these additional security measures for production use:
1. Create a dedicated database user instead of using the postgres superuser:
   ```sql
   CREATE USER crm_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE <SEU_BANCO_POSTGRES> TO crm_user;
   ```

2. Restrict pg_hba.conf to only allow specific IP addresses rather than 0.0.0.0/0 (more secure):
   ```
   host    <SEU_BANCO_POSTGRES>      postgres      YOUR_LOCAL_IP/32      md5
   ```

3. Use a VPN or SSH tunnel for database connections instead of direct connections over the internet

4. Consider enabling SSL on your PostgreSQL server in the future for secure data transmission

## Verification
After completing all steps, run the test connection script to verify everything is working:
```bash
# In your project directory
npx tsx test-db-connection.ts
```

This should output a success message indicating the connection was established successfully.
