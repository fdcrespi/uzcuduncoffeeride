"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { RecentOrdersCard } from "@/components/admin/recent-orders-card"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { QuickActionsCard } from "@/components/admin/quick-actions-card"
import { DollarSign, ShoppingCart, Package, Users, Coffee, Bike, Zap } from "lucide-react"

const stats = [
  {
    title: "Ventas Totales",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Pedidos",
    value: "156",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    value: "89",
    change: "+3.2%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Clientes",
    value: "234",
    change: "+8.1%",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    product: "Casco AGV K6",
    amount: "$450",
    status: "completed" as const,
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "María García",
    product: "NIU NGT",
    amount: "$3,200",
    status: "pending" as const,
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    product: "Café Ruta 66",
    amount: "$24",
    status: "completed" as const,
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Ana Martín",
    product: "Yamaha R6 2024",
    amount: "$18,500",
    status: "processing" as const,
    date: "2024-01-14",
  },
]

const topProducts = [
  {
    name: "Casco AGV K6",
    category: "Accesorios",
    sales: 45,
    revenue: "$20,250",
    icon: Package,
  },
  {
    name: "Café Ruta 66",
    category: "Cafetería",
    sales: 89,
    revenue: "$2,136",
    icon: Coffee,
  },
  {
    name: "NIU NGT",
    category: "Eléctricos",
    sales: 12,
    revenue: "$38,400",
    icon: Zap,
  },
  {
    name: "Yamaha R6 2024",
    category: "Motocicletas",
    sales: 3,
    revenue: "$55,500",
    icon: Bike,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de tu negocio de motocicletas y cafetería</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={{
              value: Number.parseFloat(stat.change.replace("%", "").replace("+", "")),
              isPositive: stat.trend === "up",
            }}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrdersCard orders={recentOrders} />

        <TopProductsCard products={topProducts} />
      </div>

      <QuickActionsCard />
    </div>
  )
}
