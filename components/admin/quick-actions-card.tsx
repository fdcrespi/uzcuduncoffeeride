import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, Coffee } from "lucide-react"

interface QuickActionsCardProps {
  className?: string
}

export function QuickActionsCard({ className }: QuickActionsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Tareas comunes para gestionar tu negocio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="h-20 flex-col space-y-2">
            <Package className="w-6 h-6" />
            <span>Agregar Producto</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <ShoppingCart className="w-6 h-6" />
            <span>Ver Pedidos</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Users className="w-6 h-6" />
            <span>Gestionar Clientes</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Coffee className="w-6 h-6" />
            <span>Menú Cafetería</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
