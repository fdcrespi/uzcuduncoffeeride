"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"
import { ProductsTable } from "@/components/admin/products-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ProductImagesDialog } from "@/components/admin/product-images-dialog" // 👈 nuevo

import io from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_URL!);

// Interfaces to type the data
interface Subcategory {
  id: string;
  nombre: string;
}

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  // portada (proviene de Producto_Portada.cover_url)
  image: string;
  subrubro_id: string;
  subrubro_nombre: string;
  precio: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errorDialog, setErrorDialog] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  // 👇 estado para el diálogo de imágenes
  const [imagesDialog, setImagesDialog] = useState<{
    open: boolean;
    productId: string | number | null;
    productName?: string;
  }>({ open: false, productId: null });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setErrorDialog({ isOpen: true, message: 'No se pudieron cargar los productos.' });
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch('/api/subcategories');
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error(error);
      setErrorDialog({ isOpen: true, message: 'No se pudieron cargar las subcategorías.' });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  const handleAddProduct = async (data: Omit<Product, 'id' | 'subrubro_nombre'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await fetchProducts();
      socket.emit('updateProducto', 'Producto actualizado');
    } else {
      const errorData = await response.json();
      setErrorDialog({ isOpen: true, message: errorData.message || 'Error al crear el producto.' });
    }
  };

  const handleUpdateProduct = async (id: string, data: Omit<Product, 'id' | 'subrubro_nombre'>) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await fetchProducts();
      setEditingProduct(null);
      socket.emit('updateProducto', 'Producto actualizado');
    } else {
      const errorData = await response.json();
      setErrorDialog({ isOpen: true, message: errorData.message || 'Error al actualizar el producto.' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setProducts(products.filter(p => p.id !== id));
      socket.emit('updateProducto', 'Producto actualizado');
    } else {
      const errorData = await response.json();
      setErrorDialog({ isOpen: true, message: errorData.message || 'Ocurrió un error al eliminar el producto.' });
    }
  };

  // 👇 abrir diálogo de imágenes para un producto
  const openImagesFor = (product: Product) => {
    setImagesDialog({ open: true, productId: product.id, productName: product.nombre });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona tu inventario de motocicletas, accesorios y productos de cafetería
          </p>
        </div>
        <div className="w-full flex justify-end md:w-auto">
          <ProductFormDialog
            key={editingProduct ? 'edit' : 'add'} // Reset form when switching between add/edit
            subcategories={subcategories}
            onSubmit={editingProduct ? (data) => handleUpdateProduct(editingProduct.id, data) : handleAddProduct}
            initialData={editingProduct}
            onOpenChange={(isOpen) => {
              if (!isOpen) setEditingProduct(null);
            }}
          />
        </div>
      </div>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos ({products.length})</CardTitle>
          <CardDescription>Gestiona todos tus productos desde esta vista</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable
            products={products}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
            onManageImages={openImagesFor} // 👈 nueva acción
          />
        </CardContent>
      </Card>

      {/* Dialogo de imágenes */}
      {imagesDialog.productId != null && (
        <ProductImagesDialog
          productId={imagesDialog.productId}
          productName={imagesDialog.productName}
          open={imagesDialog.open}
          onOpenChange={async (open) => {
            setImagesDialog(prev => ({ ...prev, open }));
            // al cerrar, refrescar lista por si cambió la portada
            if (!open) {
              await fetchProducts();
              socket.emit('updateProducto', 'Producto actualizado');
            }
          }}
        />
      )}

      {/* Error Dialog */}
      <AlertDialog open={errorDialog.isOpen} onOpenChange={(open) => setErrorDialog({ ...errorDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ isOpen: false, message: '' })}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
