"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"
import { SearchFilters } from "@/components/admin/search-filters"
import { ProductsTable } from "@/components/admin/products-table"

const sampleProducts = [
  {
    id: "1",
    name: "Yamaha R6 2024",
    category: "Motocicletas",
    price: 18500,
    stock: 3,
    status: "active",
    image: "/modern-sport-motorcycle-in-showroom.jpg",
  },
  {
    id: "2",
    name: "NIU NGT",
    category: "Eléctricos",
    price: 3200,
    stock: 8,
    status: "active",
    image: "/electric-scooter-modern-design.jpg",
  },
  {
    id: "3",
    name: "Casco AGV K6",
    category: "Accesorios",
    price: 450,
    stock: 25,
    status: "active",
    image: "/motorcycle-helmet-premium-black.jpg",
  },
  {
    id: "4",
    name: "Café Ruta 66",
    category: "Cafetería",
    price: 24,
    stock: 150,
    status: "active",
    image: "/premium-coffee-beans-package-motorcycle-theme.jpg",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona tu inventario de motocicletas, accesorios y productos de cafetería
          </p>
        </div>
        <ProductFormDialog />
      </div>

      <SearchFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos ({filteredProducts.length})</CardTitle>
          <CardDescription>Gestiona todos tus productos desde esta vista</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable products={filteredProducts} />
        </CardContent>
      </Card>
    </div>
  )
}
