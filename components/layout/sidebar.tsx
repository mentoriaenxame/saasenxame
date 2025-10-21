"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Kanban, Calendar, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"
import { useCRM } from "@/lib/crm-context-db"
import { logoutAction } from "@/lib/auth-actions"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Pipeline", href: "/kanban", icon: Kanban },
  { name: "Calendario", href: "/calendario", icon: Calendar },
  { name: "Configuracoes", href: "/configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentUser } = useCRM()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CRM Pro
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4 space-y-3">
        <UserMenu user={currentUser || null} />
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive focus-visible:ring-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </form>
      </div>
    </div>
  )
}
