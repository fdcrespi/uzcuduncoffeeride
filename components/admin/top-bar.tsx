"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSession } from "next-auth/react"

interface AdminTopBarProps {
  onMenuClick: () => void
  title?: string
}

export function AdminTopBar({ onMenuClick, title = "Panel de Administración" }: AdminTopBarProps) {

  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">{session?.user?.email?.charAt(0)}</span>
            </div>
            <span className="text-sm font-medium">{session?.user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}