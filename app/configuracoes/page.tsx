"use client";

import AuthenticatedLayout from "../dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Database, Mail, Shield, User } from "lucide-react"

export default function ConfiguracoesPage() {
  return (
    <AuthenticatedLayout>
      <ConfiguracoesContent />
    </AuthenticatedLayout>
  );
}

function ConfiguracoesContent() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil do Usuário
              </CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@crm.com" />
                </div>
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Tarefas</p>
                  <p className="text-sm text-muted-foreground">Alertas para tarefas pendentes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos Leads</p>
                  <p className="text-sm text-muted-foreground">Notificação quando novos leads chegarem</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Email Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Integração de Email
              </CardTitle>
              <CardDescription>Configure sua integração com Resend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resend-key">Chave API Resend</Label>
                <Input id="resend-key" type="password" placeholder="re_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">Email de Envio</Label>
                <Input id="from-email" type="email" placeholder="noreply@seudominio.com" />
              </div>
              <Button>Conectar Resend</Button>
            </CardContent>
          </Card>

          {/* Database Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Banco de Dados
              </CardTitle>
              <CardDescription>Configure sua integração com Supabase ou Neon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-provider">Provedor</Label>
                <Select defaultValue="supabase">
                  <SelectTrigger id="db-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-url">URL de Conexão</Label>
                <Input id="db-url" type="password" placeholder="postgresql://..." />
              </div>
              <Button>Conectar Banco de Dados</Button>
            </CardContent>
          </Card>

          {/* Storage Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Armazenamento de Arquivos
              </CardTitle>
              <CardDescription>Configure MinIO para upload de documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minio-endpoint">Endpoint MinIO</Label>
                <Input id="minio-endpoint" placeholder="https://minio.seudominio.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minio-access">Access Key</Label>
                  <Input id="minio-access" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minio-secret">Secret Key</Label>
                  <Input id="minio-secret" type="password" />
                </div>
              </div>
              <Button>Conectar MinIO</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
