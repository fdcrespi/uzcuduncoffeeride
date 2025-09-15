import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface TopProduct {
  name: string
  category: string
  sales: number
  revenue: string
  icon: LucideIcon
}

interface TopProductsCardProps {
  products: TopProduct[]
  className?: string
}

export function TopProductsCard({ products, className }: TopProductsCardProps) {
  return (
    <Card className={`col-span-3 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
        <CardDescription>Productos con mejor rendimiento este mes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.name} className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <product.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{product.revenue}</p>
                <p className="text-xs text-muted-foreground">{product.sales} ventas</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
