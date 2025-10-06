import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/lib/types"
import { Package, PackageCheck, PackageX } from "lucide-react"

interface TopProductsCardProps {
  products: Product[]
  className?: string
}

export function TopProductsCard({ products, className }: TopProductsCardProps) {
  return (
    <Card className={`col-span-3 ${className || ""}`}>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
        <CardDescription>Productos con mejor rendimiento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                {
                  product.stock > 0 ?
                  <PackageCheck className="w-4 h-4 text-primary" />
                  :
                  <PackageX className="w-4 h-4 text-muted-foreground" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.nombre}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{Number(product.precio).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
                <p className="text-xs text-muted-foreground">{product.stock} disponibles</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
