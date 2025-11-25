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
import { ShoppingCart, Zap } from "lucide-react";
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
            <p className="text-2xl font-bold text-primary">
              ${product.precio.toLocaleString("es-AR")}
            </p>
          )}
        </CardContent>
      </div>

      {/* Pie de la tarjeta, siempre se mostrará en la parte inferior */}
      <CardFooter className="p-4">
        {product.precio <= 0 ? (
          <Link target="_blank" href={`https://wa.me/${data.telefono}?text=Hola%20quisiera%20comprar%20el%20siguiente%20producto:%20#${product.id}-${product.nombre}`} className="m-auto">
            <Button className="cursor-pointer bg-green-500 text-white text-md hover:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-6 w-6 font-bold" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
              Consultar precio
            </Button>
          </Link>
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
