"use client"

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { ProductImagesDialog } from "@/components/admin/product-images-dialog";
import { ProductsTable } from "@/components/admin/products-table";
import { Product, Subcategory } from "@/lib/types";
import { toast } from "sonner";
import LoadingAdminProducts from "./loading";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [imagesProduct, setImagesProduct] = useState<Product | null>(null);

  // filtros & paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, subcategoriesRes] = await Promise.all([
          // obtenemos todos los productos para que la paginación dependa del total
          fetch("/api/products?limit=100000"),
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

  // resetear página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, subcategoryFilter]);

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
      const listRes = await fetch("/api/products?limit=100000");
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

  const handleManageImages = (product: Product) => {
    setImagesProduct(product);
    setImagesDialogOpen(true);
  };

  const handleToggleStatus = async (
    productId: string,
    field: "destacado" | "visible",
    value: boolean
  ) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo actualizar el estado");
      }
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, [field]: value } as Product : p)));
      toast.success(field === "destacado" ? (value ? "Marcado como destacado" : "Quitado de destacados") : (value ? "Marcado como visible" : "Ocultado"));
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo eliminar el producto");
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Producto eliminado");
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
    }
  };

  // productos filtrados + paginados
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = term
        ? (p.nombre?.toLowerCase().includes(term) || p.descripcion?.toLowerCase().includes(term) || p.id?.toString().toLowerCase().includes(term))
        : true;
      const matchesSubcat = subcategoryFilter === "all" ? true : p.subrubro_id?.toString() === subcategoryFilter;
      return matchesSearch && matchesSubcat;
    });
  }, [products, searchTerm, subcategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentSliceStart = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(currentSliceStart, currentSliceStart + pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={handleOpenDialog}>Agregar Producto</Button>
      </div>

      {/* Controles de filtro y búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, descripción o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[240px]">
          <Select value={subcategoryFilter} onValueChange={(v) => setSubcategoryFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Subcategoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductsTable products={paginatedProducts} onEdit={handleEdit} onManageImages={handleManageImages} onToggleStatus={handleToggleStatus} onDelete={onDelete} />
      {/* Paginación */}
      <Pagination className="mt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {isDialogOpen && (
        <ProductFormDialog
          subcategories={subcategories}
          onSubmit={handleSubmit}
          initialData={editingProduct}
          onOpenChange={handleCloseDialog}
        />
      )}

      {imagesDialogOpen && imagesProduct && (
        <ProductImagesDialog
          productId={imagesProduct.id}
          productName={imagesProduct.nombre}
          open={imagesDialogOpen}
          onOpenChange={(open) => {
            setImagesDialogOpen(open);
            if (!open) setImagesProduct(null);
          }}
        />
      )}
    </div>
  );
}