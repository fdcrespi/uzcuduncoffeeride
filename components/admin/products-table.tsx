"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  image: string;
  subrubro_id: string;
  subrubro_nombre: string;
  precio: number;
  stock: number;
}

interface ProductsTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Subcategoría</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.nombre} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{product.nombre}</div>
                    <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.subrubro_nombre}</Badge>
              </TableCell>
              <TableCell className="text-right">
                ${product.precio?.toLocaleString("es-AR")}
              </TableCell>
              <TableCell className="text-right">
                <span className={product.stock < 10 ? "text-red-600 font-bold" : ""}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setProductToDelete(product)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* AlertDialog de confirmación */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <span className="font-semibold">{productToDelete?.nombre}</span>?  
              Esta acción no se puede deshacer y se eliminará de forma permanente de tu inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (productToDelete && onDelete) {
                  onDelete(productToDelete.id)
                }
                setProductToDelete(null)
              }}
            >
              Eliminar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
