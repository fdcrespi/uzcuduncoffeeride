"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";

// Tipos
import { Product as BaseProduct, Size } from "@/lib/types";
import { Header } from "@/components/layout/header";

// 🔸 NUEVO: selector de talles
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// 🔸 NUEVO: galería
import ProductGallery from "@/components/ProductGallery";

// socket io
import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_URL!);

// Extiendo el tipo Product para permitir images[] que devuelve la API de detalle
type ProductImage = { id: number; url: string; is_principal: boolean; orden: number };
type Product = BaseProduct & { images?: ProductImage[] };

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔸 NUEVO: estado de talles
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { id } = params as { id?: string };

  // Carga inicial del producto
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        const data = await response.json();
        setProduct(data as Product);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔸 NUEVO: cargar talles asociados al producto
  useEffect(() => {
    if (!id) return;
    const fetchSizes = async () => {
      try {
        const res = await fetch(`/api/products/${id}/sizes`);
        if (!res.ok) throw new Error("No se pudieron cargar los talles");
        const data = await res.json();
        setSizes(data || []);
        // Reset selección si el producto cambió
        setSelectedSizeId(null);
      } catch (e) {
        console.error(e);
        setSizes([]);
      }
    };
    fetchSizes();
  }, [id]);

  // Suscripción a socket para refrescar si actualizan el producto
  useEffect(() => {
    const onConnect = () => {
      console.log("Conectado al servidor de WebSocket");
    };
    const onUpdate = () => {
      console.log("Producto actualizado, recargando detalles...");
      if (!id) return;
      setLoading(true);
      fetch(`/api/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar el producto");
          return res.json();
        })
        .then((data) => setProduct(data as Product))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    };

    socket.on("connect", onConnect);
    socket.on("updateProducto", onUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("updateProducto", onUpdate);
    };
  }, [id]);

  const needSizeSelection = sizes.length > 0;
  const selectedSize = sizes.find((s) => s.id === selectedSizeId) || null;

  const ensureSizeSelected = () => {
    if (needSizeSelection && !selectedSize) {
      toast({
        title: "Seleccioná un talle",
        description: "Este producto requiere que elijas un talle.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const phone = "5491112345678"; // 🔸 Reemplazar con el número de teléfono real
    const message = `Hola, estoy interesado/a en el producto "${product.nombre}" (ID: ${product.id}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!ensureSizeSelected()) return;

    addItem(product, selectedSize ? { talle_id: selectedSize.id, talle_nombre: selectedSize.nombre } : undefined);
    toast({
      title: "¡Agregado!",
      description: `Se ha añadido ${product.nombre}${selectedSize ? ` (talle ${selectedSize.nombre})` : ""} al carrito.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!ensureSizeSelected()) return;

    addItem(product, selectedSize ? { talle_id: selectedSize.id, talle_nombre: selectedSize.nombre } : undefined);
    router.push("/checkout");
  };

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground">
          El producto que buscas no existe o no está disponible.
        </p>
      </div>
    );
  }

  // 🔸 Preparo las imágenes para la galería
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
          .sort((a, b) => a.orden - b.orden)
          .map((img, idx) => ({
            src: img.url,
            alt: `${product.nombre} - imagen ${img.orden ?? idx + 1}`,
          }))
      : [{ src: product.image || "/placeholder.svg", alt: product.nombre }];

  return (
    <>
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid w-full gap-8 md:grid-cols-2 md:gap-12">
          {/* Columna de Imagen / Galería */}
          <div className="w-full min-w-0">
            {/* 🔸 Si hay varias imágenes, mostramos la galería. Si es una sola (fallback), igual la galería la muestra ok */}
            <div className="w-full mx-auto max-w-lg">
              <ProductGallery
                images={galleryImages}
                layout="auto"       // vertical en desktop, horizontal en mobile (según lo definido)
                zoom="auto"         // pinch-zoom en mobile, doble tap/click desktop
                fullscreen={true}   // modal fullscreen habilitado
                animation="fade"    // fade/slide suave
                className="w-full"
              />
            </div>
          </div>

          {/* Columna de Detalles y Acciones */}
          <div className="flex flex-col pt-4">
            <h1 className="mb-4 text-left text-3xl font-bold md:text-4xl">
              {product.nombre}
            </h1>

            <div className="mb-6">
              <p className="text-left text-4xl font-extrabold text-black">
                {product.moneda === 'ARS' ? '$' : 'USD'}{' '}
                {product.precio.toLocaleString("es-AR")}
              </p>
              {/* <p>En 6 cuotas sin interés de {product.moneda === 'ARS' ? '$' : 'USD'} {Math.round(product.precio / 6).toLocaleString("es-AR")}</p> */}
              {product.precio_alternativo > 0 && (
                <p className="text-left text-xl font-bold text-muted-foreground">
                  {product.moneda === 'ARS' ? '$' : 'USD'}{' '}
                  {product.precio_alternativo.toLocaleString("es-AR")} por transferencia
                </p>
              )}
              
            </div>

            {product.exhibicion && (
              <p className="mb-6 text-left text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                Este producto es de exhibición. Para comprarlo, por favor consultanos directamente a través de WhatsApp.
              </p>
            )}

            {product.stock > 0 && !product.exhibicion && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Stock disponible: 
                  <span className="text-gray-500 font-normal">
                    ({product.stock} disponibles)
                  </span>
                </h3>
              </div>
            )}

            {/* 🔸 NUEVO: Selector de talles si el producto los tiene */}
            {needSizeSelection && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Seleccioná tu talle</h3>
                <ToggleGroup type="single" value={selectedSizeId?.toString() ?? ""} onValueChange={(val) => {
                  const nextId = val ? Number(val) : null;
                  setSelectedSizeId(nextId);
                }}>
                  {sizes.map((s) => (
                    <ToggleGroupItem key={s.id} value={String(s.id)} aria-label={`Talle ${s.nombre}`} disabled={(s.stock ?? 0) <= 0}>
                      {s.nombre}{typeof s.stock === 'number' ? ` (${s.stock})` : ''}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {!selectedSize && (
                  <p className="mt-2 text-sm text-muted-foreground">Debés elegir un talle para continuar.</p>
                )}
                {selectedSize && typeof selectedSize.stock === 'number' && selectedSize.stock <= 0 && (
                  <p className="mt-2 text-sm text-red-600">Sin stock para el talle seleccionado.</p>
                )}
              </div>
            )}

            <div className="flex w-full max-w-xs flex-col gap-3">
              {product.exhibicion ? (
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleWhatsAppInquiry}
                >
                  Consultar por WhatsApp
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0 || (needSizeSelection && (!selectedSize || (typeof selectedSize.stock === 'number' && selectedSize.stock <= 0)))}
                  >
                    Comprar ahora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || (needSizeSelection && (!selectedSize || (typeof selectedSize.stock === 'number' && selectedSize.stock <= 0)))}
                  >
                    Agregar al carrito
                  </Button>
                </>
              )}
            </div>
            {product.stock <= 0 && (
              <p className="mt-4 font-semibold text-red-600">
                Producto sin stock
              </p>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="mb-2 text-lg font-semibold">Características</h3>
              <p className="text-muted-foreground">
                {product.descripcion || "No hay descripción disponible."}
              </p>
            </div>
          </div>
        </div>

        <div className="my-12 border-t" /> {/* Separador */}

        {/* Boton para regresar */}
        <div className="flex justify-center">
          <Button variant="link" onClick={() => router.back()} className="cursor-pointer">
            &larr; Volver
          </Button>
        </div>
        
      </div>
    </>
  );
}

// Skeleton
function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="mx-auto aspect-square w-full max-w-[500px]" />
        <div className="flex flex-col space-y-6 pt-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-3 pt-6">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
