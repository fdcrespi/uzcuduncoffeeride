"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { RecentOrdersCard } from "@/components/admin/recent-orders-card"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { DollarSign, ShoppingCart, Package, Coffee, Bike, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Order, Product } from "@/lib/types"

const stats = [
  {
    title: "Ventas Totales",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Pedidos",
/*  change: "+12.5%", */
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Pedidos pendientes",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    /* change: "+3.2%", */
    trend: "up",
    icon: Package,
  },
  
]

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);	
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
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
        // calcular las ventas totales
        const total = data.reduce((acc: number, order: Order) => acc + order.total, 0);
        setTotalSales(total);
        // filtrar los ultimos 5 pedidos
        const pending = data.filter((order: Order) => order.status === "pending").length;
        setPendingOrders(pending);
        setRecentOrders(data.slice(0, 5));
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders/products')
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
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
            value={
              stat.title === "Ventas Totales" ? `$${totalSales.toFixed(2)}` :
              stat.title === "Pedidos" ? recentOrders.length.toString() :
              stat.title === "Pedidos pendientes" ? pendingOrders.toString() :
              stat.title === "Productos" ? products.length.toString() : ""
            }
            icon={stat.icon}
            className={`${stat.title === "Pedidos pendientes" && pendingOrders > 0 ? "text-red-600 border border-red-600" : ""}`}
          /*   trend={{
              value: Number.parseFloat(stat.change.replace("%", "").replace("+", "")),
              isPositive: stat.trend === "up",
            }} */
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrdersCard orders={recentOrders} />

        <TopProductsCard products={products} />
      </div>

      {/* <QuickActionsCard /> */}
    </div>
  )
}
