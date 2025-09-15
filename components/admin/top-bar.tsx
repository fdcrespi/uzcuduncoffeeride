"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AdminTopBarProps {
  onMenuClick: () => void
  title?: string
}

export function AdminTopBar({ onMenuClick, title = "Panel de Administración" }: AdminTopBarProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">A</span>
            </div>
            <span className="text-sm font-medium">Administrador</span>
          </div>
        </div>
      </div>
    </div>
  )
}
