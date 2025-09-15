"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  image?: string
}

interface ProductsTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  onView?: (product: Product) => void
}

export function ProductsTable({ products, onEdit, onDelete, onView }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{product.category}</Badge>
            </TableCell>
            <TableCell>${product.price.toLocaleString()}</TableCell>
            <TableCell>
              <span className={product.stock < 10 ? "text-red-600" : ""}>{product.stock}</span>
            </TableCell>
            <TableCell>
              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                {product.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onView?.(product)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
