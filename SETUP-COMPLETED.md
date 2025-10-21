# CRM System 1.0 - Database Setup Complete

Congratulations! You have successfully prepared your CRM system for connection to your PostgreSQL database.

> Substitua `<SEU_SERVIDOR_IP>`, `<SEU_BANCO_POSTGRES>` e `<SUA_SENHA_POSTGRES>` pelos dados reais do seu ambiente.

## Files Created/Updated

1. **`.env.local`** - Updated with your database credentials:
   - DB_NAME=<SEU_BANCO_POSTGRES>
   - DB_HOST=<SEU_SERVIDOR_IP>
   - DB_PASSWORD=<SUA_SENHA_POSTGRES>
   - DB_PORT=5432

2. **`db-schema.sql`** - Database schema file with all required tables for:
   - usuarios (users)
   - clientes (clients)
   - atividades (activities)
   - tarefas (tasks)
   - eventos (events)

3. **`run-db-remote.sh` and `run-db-remote.bat`** - Updated with your credentials for running remote database commands

4. **`POSTGRES-SETUP-COMPLETE.md`** - Complete setup guide with step-by-step instructions

## Next Steps

To complete the setup, you need to:

1. **Set up the database on your server** by following the instructions in `POSTGRES-SETUP-COMPLETE.md`
   - This requires SSH access to your server at <SEU_SERVIDOR_IP>
   - You'll create the database, configure PostgreSQL to accept external connections, and open the firewall

2. **After the database is set up on your server**, you can run:
   ```bash
   # To create the database tables
   ./run-db-remote.sh schema  # On Linux/Mac
   run-db-remote.bat schema   # On Windows
   
   # To verify the connection works
   npx tsx test-db-connection.ts
   ```

3. **To run the CRM application** (after database is ready):
   ```bash
   pnpm dev
   ```

## Available Scripts

- `npx tsx test-db-connection.ts` - Test the database connection
- `./run-db-remote.sh schema` - Run the schema creation on remote database
- `./run-db-remote.sh test` - Test remote database connection

## Troubleshooting

If you encounter issues:
1. Check `POSTGRES-SETUP-COMPLETE.md` for comprehensive troubleshooting steps
2. Verify your server firewall allows connections on port 5432
3. Confirm PostgreSQL is configured to accept external connections
4. Ensure the database "<SEU_BANCO_POSTGRES>" exists on your server

## Security Considerations for Non-SSL Connections

Since your server doesn't support SSL, consider these security measures:
- Use a VPN or SSH tunnel for database connections in production
- Restrict database access to specific IP addresses in pg_hba.conf
- Consider enabling SSL on your PostgreSQL server in the future
