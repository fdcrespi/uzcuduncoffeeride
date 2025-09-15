"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, Truck, CheckCircle, Clock } from "lucide-react"

const sampleOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    email: "juan@email.com",
    products: ["Casco AGV K6"],
    total: 450,
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Tarjeta de Crédito",
  },
  {
    id: "ORD-002",
    customer: "María García",
    email: "maria@email.com",
    products: ["NIU NGT"],
    total: 3200,
    status: "pending",
    date: "2024-01-15",
    paymentMethod: "Transferencia",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    email: "carlos@email.com",
    products: ["Café Ruta 66", "Casco AGV K6"],
    total: 474,
    status: "processing",
    date: "2024-01-14",
    paymentMethod: "Efectivo",
  },
  {
    id: "ORD-004",
    customer: "Ana Martín",
    email: "ana@email.com",
    products: ["Yamaha R6 2024"],
    total: 18500,
    status: "shipped",
    date: "2024-01-14",
    paymentMethod: "Tarjeta de Crédito",
  },
  {
    id: "ORD-005",
    customer: "Luis Rodríguez",
    email: "luis@email.com",
    products: ["Café Ruta 66"],
    total: 24,
    status: "completed",
    date: "2024-01-13",
    paymentMethod: "Efectivo",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", variant: "outline" as const, icon: Clock },
  processing: { label: "Procesando", variant: "secondary" as const, icon: Package },
  shipped: { label: "Enviado", variant: "default" as const, icon: Truck },
  completed: { label: "Completado", variant: "default" as const, icon: CheckCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(sampleOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">Gestiona todos los pedidos de tu tienda de motocicletas y cafetería</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "completed").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos ({filteredOrders.length})</CardTitle>
          <CardDescription>Gestiona el estado y detalles de todos los pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.paymentMethod}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.products.join(", ")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${order.total.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <div className="flex items-center space-x-2">
                              <statusInfo.icon className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>Pendiente</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="processing">
                            <div className="flex items-center space-x-2">
                              <Package className="w-3 h-3" />
                              <span>Procesando</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="shipped">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-3 h-3" />
                              <span>Enviado</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completado</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
