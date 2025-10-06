"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { RecentOrdersCard } from "@/components/admin/recent-orders-card"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { DollarSign, ShoppingCart, Package, Coffee, Bike, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Order } from "@/lib/types"

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
  /* {
    title: "Clientes",
    value: "234",
    change: "+8.1%",
    trend: "up",
    icon: Users,
  }, */
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
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders')
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        return response.json();
      })
      .then(data => {
        setRecentOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

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

      {/* <QuickActionsCard /> */}
    </div>
  )
}
