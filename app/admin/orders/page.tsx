"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, Truck, CheckCircle, Clock, X } from "lucide-react"
import { Order } from "@/lib/types"
import { toast } from "sonner"
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_URL!);

const statusConfig = {
  pending: { label: "Pendiente", variant: "outline" as const, icon: Clock },
  delivered: { label: "Entregado", variant: "secondary" as const, icon: Package },
  shipped: { label: "Enviado", variant: "default" as const, icon: Truck },
  canceled: { label: "Cancelado", variant: "default" as const, icon: CheckCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchOrders = async () => {
      const data = await fetch("/api/orders").then((res) => res.json())
      setLoading(false);
      setOrders(data);
      setFilteredOrders(data);
    }

    fetchOrders()
  }, []);

   useEffect(() => {
      socket.on('connect', () => {
        console.log('Conectado al servidor de WebSocket');
      });
      socket.on('addPedido', () => {
        console.log('Pedido nuevo, recargando lista...');
        // Volver a cargar los productos
        setLoading(true);
        fetch('/api/orders')
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al cargar los pedidos');
            }
            return response.json();
          })
          .then(data => {
            setOrders(data);
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      });
      
      return () => {
        socket.off('addPedido');
      };
    }, []);

  useEffect(() => {
    let filtered = [...orders]

    // filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // filtro por búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.payer_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }, [statusFilter, searchTerm, orders])

  if (loading) {
    return <div>Cargando pedidos...</div>
  }

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    if (res.status === 200) {
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );   
      socket.emit('updatePedido', 'Pedido actualizado');
    } else {
      toast.error("Ha ocurrido un error al actualizar el pedido");
    }
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
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <div className="flex space-x-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <Truck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped" || o.status === "delivered").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "canceled").length}</div>
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
                  placeholder="Buscar por ID, cliente"
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
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
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
                        <div className="text-sm text-muted-foreground">{order.pago}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.payer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.payer_address}</div>
                      </div>
                    </TableCell>
                    {/*  <TableCell>
                      <div className="text-sm">{order.products.join(", ")}</div>
                    </TableCell> */}
                    <TableCell>
                      <div className="font-medium">${order.total.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}>
                        <SelectTrigger className="w-[150px]">
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
                          <SelectItem value="shipped">
                            <div className="flex items-center space-x-2">
                              <Package className="w-3 h-3" />
                              <span>Enviado</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="delivered">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-3 h-3" />
                              <span>Entregado</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="canceled">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3" />
                              <span>Cancelado</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(order.fecha_emision).toLocaleString()}</TableCell>
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
