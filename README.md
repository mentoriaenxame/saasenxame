# SaaS CRM System

A comprehensive Customer Relationship Management (CRM) system built as a SaaS application using Next.js 15, React, TypeScript, and PostgreSQL. This system provides businesses with tools to manage customers, activities, tasks, events, and business metrics.

## 🚀 Features

- **Dashboard** - Business metrics and analytics dashboard
- **Customer Management** - Complete CRUD operations for customers
- **Activity Tracking** - Track and manage all customer interactions
- **Task Management** - Organize and manage business tasks
- **Calendar & Events** - Integrated calendar for scheduling events
- **Kanban Board** - Visual project management interface
- **Authentication System** - Secure user authentication and authorization
- **Responsive Design** - Works seamlessly across all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Tailwind CSS Animate
- **UI Components**: Radix UI, Shadcn UI
- **Database**: PostgreSQL
- **Database Driver**: pg (node-postgres)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod (validation)
- **Date Handling**: date-fns
- **Other**: Sonner (notifications), Vaul (mobile sheets)

## 📋 Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm/yarn
- Git
- PostgreSQL (for data persistence)

## 📦 Installation

1. Clone this repository:
```bash
git clone <your-repository-url>
cd saasenxame
```

2. Install dependencies:
```bash
pnpm install
```
Or if you don't have pnpm:
```bash
npm install
```

## 🔧 Database Configuration

This project uses PostgreSQL for data persistence. You can set up locally or on a remote VPS.

### Local Setup
Follow instructions in `POSTGRES-CONFIG.md` to set up the database locally.

### Remote VPS Setup
If using a remote VPS with PostgreSQL, update environment variables in `.env.local`:

```env
DB_USER=your_user
DB_HOST=your_vps_ip
DB_NAME=database_name
DB_PASSWORD=your_secure_password
DB_PORT=5432
```

## 🚦 Running the Application

For development:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                 # Next.js 15 app router pages
│   ├── api/             # API routes
│   ├── clientes/        # Customer management pages
│   ├── dashboard/       # Dashboard pages
│   ├── calendario/      # Calendar pages
│   ├── kanban/          # Kanban board pages
│   ├── login/           # Authentication pages
│   ├── configuracoes/   # Settings pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable UI components
├── lib/                 # Business logic, context, and types
├── public/              # Static assets
├── styles/              # Style sheets
├── hooks/               # Custom React hooks
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm run db:test` - Test PostgreSQL database connection
- `pnpm run db:setup` - Set up the database
- `pnpm run db:tables` - Create database tables
- `pnpm run db:demo` - Add demo data

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:

- Customers
- Activities
- Tasks
- Events
- Users
- Settings

## 🔐 Environment Variables

Create a `.env.local` file with:

For local development:
```env
# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# PostgreSQL Database Configuration (Local)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=crm_db
DB_PASSWORD=your_local_password
DB_PORT=5432
```

For remote VPS:
```env
# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# PostgreSQL Database Configuration (Remote VPS)
DB_USER=postgres
DB_HOST=your_server_ip
DB_NAME=your_postgres_database
DB_PASSWORD=your_postgres_password
DB_PORT=5432
DB_SSL=false  # Set to true if using SSL connection
```

## 🧪 Testing Database Connection

To test if the database connection is properly configured:

```bash
pnpm run db:test
```

This command attempts to connect to the database with credentials from `.env.local`. Ensure:
1. PostgreSQL is running
2. The database specified in `DB_NAME` exists
3. The user in `DB_USER` has necessary permissions
4. The password in `DB_PASSWORD` is correct

## 🚀 Deployment

This application can be deployed to platforms like Vercel, Netlify, or any hosting service that supports Next.js applications. Make sure your production environment has access to a PostgreSQL instance.

### Netlify Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. In the Netlify build settings, set:
   - Build command: `pnpm run build`
   - Publish directory: `out`
4. Add environment variables in Netlify:
   - Go to Site settings > Environment variables
   - Add the following variables:

```
NEXT_PUBLIC_BASE_URL=https://yourdomain.netlify.app
NEXT_PUBLIC_API_URL=https://yourdomain.netlify.app/api
DB_USER=your_postgres_user
DB_HOST=your_postgres_host
DB_NAME=your_postgres_db_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
DB_SSL=true
```

### Environment Variables for Production

Create a `.env` file with your production settings or configure them in your deployment platform (Vercel, Netlify, etc.):

```
# Next.js Configuration (adjust to your domain)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# PostgreSQL Database Configuration
DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432

# SSL Configuration for remote database connections
DB_SSL=true
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.