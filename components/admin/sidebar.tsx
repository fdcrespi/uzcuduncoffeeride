"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Shapes, ShoppingCart, BarChart3, Settings, LogOut, Bike, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categorías",
    href: "/admin/categories",
    icon: Shapes,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reportes",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
