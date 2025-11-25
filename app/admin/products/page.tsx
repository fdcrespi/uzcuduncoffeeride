"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { ProductsTable } from "@/components/admin/products-table";
import { Product, Subcategory } from "@/lib/types";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, subcategoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/subcategories"),
        ]);

        if (!productsRes.ok || !subcategoriesRes.ok) {
          throw new Error("Error cargando datos iniciales");
        }

        const [productsData, subcategoriesData] = await Promise.all([
          productsRes.json(),
          subcategoriesRes.json(),
        ]);

        setProducts(productsData);
        setSubcategories(subcategoriesData);
      } catch (error: any) {
        toast.error(error.message || "Ocurrió un error al cargar los datos.");
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = () => setIsDialogOpen(true);

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingProduct(null);
  };

  const handleSubmit = async (data: Omit<Product, "id" | "subrubro_nombre">, items: { talle_id: number; stock: number }[]) => {
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar producto");
      const saved: Product = await res.json();

      // Guardar talles + stock para el producto
      const sizeRes = await fetch(`/api/products/${saved.id}/sizes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      if (!sizeRes.ok) throw new Error("Error al guardar talles del producto")

      toast.success(editingProduct ? "Producto actualizado" : "Producto creado");

      // refrescar lista de productos
      const listRes = await fetch("/api/products");
      if (listRes.ok) {
        setProducts(await listRes.json());
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al guardar el producto.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={handleOpenDialog}>Agregar Producto</Button>
      </div>

      <ProductsTable products={products} onEdit={handleEdit} />

      {isDialogOpen && (
        <ProductFormDialog
          subcategories={subcategories}
          onSubmit={handleSubmit}
          initialData={editingProduct}
          onOpenChange={handleCloseDialog}
        />
      )}
    </div>
  );
}