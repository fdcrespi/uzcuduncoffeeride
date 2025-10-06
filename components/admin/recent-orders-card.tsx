import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Order } from "@/lib/types"


interface RecentOrdersCardProps {
  orders: Order[]
  className?: string
}

export function RecentOrdersCard({ orders, className }: RecentOrdersCardProps) {

  console.log(orders)
  const getStatusText = (status: string) => {
    switch (status) {
     //'pending' | 'shipped' | 'delivered' | 'canceled'
      case "pending":
        return "Pendiente"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "canceled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "shipped":
        return "secondary"
      case "delivered":
        return "default"
      case "canceled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className={`col-span-4 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
        <CardDescription>Los últimos pedidos realizados en tu tienda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium">{order.payer_name}</p>
                  <p className="text-xs text-muted-foreground">{(new Date(order.fecha_emision)).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                
                <div className="text-right">
                  <p className="text-sm font-medium">{order.total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
                  <p className="text-xs text-muted-foreground">{order.pago ? "Pagado" : "No pagado"}</p>
                </div>
                <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                <Button variant="ghost" size="icon" onClick={() => window.open(`/admin/orders/${order.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
