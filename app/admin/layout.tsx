"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopBar } from "@/components/admin/top-bar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
          <AdminSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
