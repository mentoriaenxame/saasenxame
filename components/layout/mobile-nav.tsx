"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Kanban, Calendar, Settings, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "./user-menu"
import { useCRM } from "@/lib/crm-context-db"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Pipeline", href: "/kanban", icon: Kanban },
  { name: "Calendário", href: "/calendario", icon: Calendar },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { currentUser } = useCRM()

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CRM Pro
        </h1>
        <div className="flex items-center gap-2">
          <UserMenu user={currentUser} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CRM Pro
                </h1>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
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
              <div className="border-t p-4">
                <UserMenu user={currentUser} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
