"use client"

import type { Product, Size } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Zap, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import data from "@/lib/data";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();

  // Selector de talle en tarjeta
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<"add" | "buy" | null>(null);
  const [loadingSizes, setLoadingSizes] = useState(false);

  const proceedNoSize = (action: "add" | "buy") => {
    if (action === "add") {
      addItem(product);
      toast({ title: "¡Agregado!", description: `${product.nombre} se ha añadido al carrito.` });
    } else {
      addItem(product);
      router.push("/checkout");
    }
  };

  const startAction = async (action: "add" | "buy") => {
    try {
      setLoadingSizes(true);
      const res = await fetch(`/api/products/${product.id}/sizes`);
      const sizes: Size[] = res.ok ? await res.json() : [];
      setAvailableSizes(sizes || []);
      setSelectedSizeId(null);
      if (!sizes || sizes.length === 0) {
        // No requiere talle
        proceedNoSize(action);
        return;
      }
      setPendingAction(action);
      setSizeDialogOpen(true);
    } catch (e) {
      console.error(e);
      proceedNoSize(action);
    } finally {
      setLoadingSizes(false);
    }
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    const selected = availableSizes.find((s) => s.id === selectedSizeId);
    if (!selected) {
      toast({ title: "Seleccioná un talle", description: "Debés elegir un talle para continuar.", variant: "destructive" });
      return;
    }
    if (typeof selected.stock === "number" && selected.stock <= 0) {
      toast({ title: "Sin stock", description: "El talle seleccionado no tiene stock.", variant: "destructive" });
      return;
    }
    if (pendingAction === "add") {
      addItem(product, { talle_id: selected.id, talle_nombre: selected.nombre });
      toast({ title: "¡Agregado!", description: `${product.nombre} (talle ${selected.nombre}) se ha añadido al carrito.` });
    } else {
      addItem(product, { talle_id: selected.id, talle_nombre: selected.nombre });
      router.push("/checkout");
    }
    setSizeDialogOpen(false);
    setPendingAction(null);
  };

  const handleBuyNow = () => startAction("buy");
  const handleAddToCart = () => startAction("add");

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Contenedor para la parte superior de la tarjeta (imagen, título, precio) */}
      <div>
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.nombre}
              width={300}
              height={250}
              className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
        <CardHeader>
          {/* Altura fija para alinear títulos de diferente longitud */}
          <CardTitle className="line-clamp-2 h-14 text-lg transition-colors group-hover:text-primary">
            {product.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.precio > 0 && (
            <div>
              <p className="text-2xl font-bold text-primary">
                {product.moneda === 'ARS' ? '$' : 'USD'}{' '}
                {product.precio.toLocaleString("es-AR")}
              </p>
              {product.precio_alternativo > 0 && (
                <p className="text-sm font-semibold text-muted-foreground">
                  {product.moneda === 'ARS' ? '$' : 'USD'}{' '}
                  {product.precio_alternativo.toLocaleString("es-AR")} por transf.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Pie de la tarjeta, siempre se mostrará en la parte inferior */}
      <CardFooter className="p-4">
        {product.exhibicion || product.precio <= 0 ? (
          <Button 
            className="w-full cursor-pointer bg-green-500 text-white hover:bg-green-600"
            onClick={() => {
              const phone = "2235788186"; // Conservamos el número que ya estaba aquí
              const message = `Hola, estoy interesado/a en el producto "${product.nombre}" (ID: ${product.id}). ¿Podrían darme más información?`;
              const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, "_blank");
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Consultar
          </Button>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4">
            <Button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              variant="default"
              size="sm"
              className="cursor-pointer"
            >
              <Zap className="mr-2 h-4 w-4" />
              {product.stock > 0 ? "Comprar ahora" : "Sin Stock"}
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? "Agregar al carrito" : "Sin Stock"}
            </Button>
          </div>
        )}
      </CardFooter>

      {/* Dialogo de selección de talle */}
      <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccioná tu talle</DialogTitle>
          </DialogHeader>
          {loadingSizes ? (
            <p className="text-sm text-muted-foreground">Cargando talles...</p>
          ) : availableSizes.length > 0 ? (
            <div className="space-y-3">
              <ToggleGroup type="single" value={selectedSizeId?.toString() ?? ""} onValueChange={(v) => setSelectedSizeId(v ? Number(v) : null)}>
                {availableSizes.map((s) => (
                  <ToggleGroupItem key={s.id} value={String(s.id)} aria-label={`Talle ${s.nombre}`} disabled={(s.stock ?? 0) <= 0} className="text-sm cursor-pointer px-2 py-1 rounded-md">
                    {s.nombre}{typeof s.stock === 'number' ? ` (${s.stock})` : ''}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {selectedSizeId == null && (
                <p className="text-sm text-muted-foreground">Debés elegir un talle para continuar.</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Este producto no requiere selección de talle.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSizeDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirm} disabled={selectedSizeId == null}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
