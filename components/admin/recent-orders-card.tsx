import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Order {
  id: string
  customer: string
  product: string
  amount: string
  status: "completed" | "pending" | "processing"
  date: string
}

interface RecentOrdersCardProps {
  orders: Order[]
  className?: string
}

export function RecentOrdersCard({ orders, className }: RecentOrdersCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "processing":
        return "Procesando"
      case "pending":
        return "Pendiente"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
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
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.product}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">{order.amount}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <Button variant="ghost" size="icon">
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
