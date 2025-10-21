"use client";

import AuthenticatedLayout from "./dashboard/layout";
import { useCRM } from "@/lib/crm-context-db";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopClients } from "@/components/dashboard/top-clients";

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <DashboardContent />
    </AuthenticatedLayout>
  );
}

function DashboardContent() {
  const { clientes, atividades } = useCRM();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <StatsCards clientes={clientes} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart clientes={clientes} />
          <PipelineChart clientes={clientes} />
        </div>

        {/* Activity and Top Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity atividades={atividades} />
          <TopClients clientes={clientes} />
        </div>
      </div>
    </div>
  );
}
