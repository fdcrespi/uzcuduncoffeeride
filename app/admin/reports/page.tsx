"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Package, Users, Coffee, Bike, Zap } from "lucide-react"

// Will use simple HTML/CSS charts instead

const salesData = [
  { month: "Ene", ventas: 12000, pedidos: 45 },
  { month: "Feb", ventas: 15000, pedidos: 52 },
  { month: "Mar", ventas: 18000, pedidos: 61 },
  { month: "Abr", ventas: 22000, pedidos: 73 },
  { month: "May", ventas: 25000, pedidos: 84 },
  { month: "Jun", ventas: 28000, pedidos: 92 },
]

const categoryData = [
  { name: "Motocicletas", value: 45, color: "#A88F73" },
  { name: "Eléctricos", value: 25, color: "#22c55e" },
  { name: "Accesorios", value: 20, color: "#3b82f6" },
  { name: "Cafetería", value: 10, color: "#f59e0b" },
]

const topProducts = [
  { name: "Yamaha R6 2024", category: "Motocicletas", revenue: 55500, units: 3 },
  { name: "NIU NGT", category: "Eléctricos", revenue: 38400, units: 12 },
  { name: "Casco AGV K6", category: "Accesorios", revenue: 20250, units: 45 },
  { name: "Café Ruta 66", category: "Cafetería", revenue: 2136, units: 89 },
]

export default function ReportsPage() {
  const maxSales = Math.max(...salesData.map((d) => d.ventas))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reportes y Analytics</h2>
        <p className="text-muted-foreground">Analiza el rendimiento de tu negocio con métricas detalladas</p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+9%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$304</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales trend - Replaced Recharts with simple CSS chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendencia de Ventas</CardTitle>
            <CardDescription>Ingresos por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium">{data.month}</div>
                  <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(data.ventas / maxSales) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      ${data.ventas.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category distribution - Replaced PieChart with progress bars */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Distribución de ingresos por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span>{category.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${category.value}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly performance - Replaced BarChart with CSS bars */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Mensual</CardTitle>
          <CardDescription>Comparación de ventas y pedidos por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {salesData.map((data) => (
              <div key={data.month} className="text-center space-y-2">
                <div className="text-sm font-medium">{data.month}</div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 bg-primary rounded-t" style={{ height: `${(data.ventas / maxSales) * 100}px` }} />
                  <div className="text-xs">${(data.ventas / 1000).toFixed(0)}k</div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div
                    className="w-6 bg-muted-foreground rounded-t"
                    style={{ height: `${(data.pedidos / 100) * 60}px` }}
                  />
                  <div className="text-xs">{data.pedidos}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Ventas ($)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted-foreground rounded" />
              <span>Pedidos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Rentables</CardTitle>
          <CardDescription>Los productos que más ingresos generan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => {
              const categoryIcons = {
                Motocicletas: Bike,
                Eléctricos: Zap,
                Accesorios: Package,
                Cafetería: Coffee,
              }
              const Icon = categoryIcons[product.category as keyof typeof categoryIcons]

              return (
                <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.units} unidades</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
