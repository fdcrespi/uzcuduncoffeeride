"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";

// Tipos
import { Product as BaseProduct } from "@/lib/types";
import { Header } from "@/components/layout/header";

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
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "¡Agregado!",
        description: `Se ha añadido ${product.nombre} al carrito.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product);
      router.push("/checkout");
    }
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
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Columna de Imagen / Galería */}
          <div className="w-full">
            {/* 🔸 Si hay varias imágenes, mostramos la galería. Si es una sola (fallback), igual la galería la muestra ok */}
            <div className="mx-auto max-w-[500px]">
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

            <p className="mb-6 text-left text-4xl font-extrabold text-black">
              ${product.precio.toLocaleString("es-AR")}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Stock disponible</h3>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-md text-black">
                  Cantidad: {quantity}
                  {product.stock > 0 ? (
                    <span className="ml-2 text-gray-500">
                      ({product.stock} disponibles)
                    </span>
                  ) : (
                    <span className="ml-2 text-red-600">(Sin stock)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-xs flex-col gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Comprar ahora
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Agregar al carrito
              </Button>
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
