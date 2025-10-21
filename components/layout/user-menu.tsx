"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/lib/auth-actions"

interface UserMenuProps {
  user: {
    nome: string
    email: string
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const displayName = user?.nome || "Usuario"
  const displayEmail = user?.email || "usuario@crm.com"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {displayName.charAt(0)}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="p-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
        </div>
        <DropdownMenuItem className="p-0">
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="flex items-center w-full p-2 text-left hover:bg-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
