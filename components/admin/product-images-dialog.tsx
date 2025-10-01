"use client";

import * as React from "react";

type ImageItem = {
  id: number;
  url: string;
  is_principal: boolean;
  orden: number;
};

type ProductImagesDialogProps = {
  productId: string | number;
  productName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductImagesDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductImagesDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState<ImageItem[]>([]);
  const [newUrls, setNewUrls] = React.useState<string>("");
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [savingOrder, setSavingOrder] = React.useState(false);

  // Fetch al abrir
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudieron cargar las imágenes");
        const data: ImageItem[] = await res.json();
        setImages(data);
      } catch (e) {
        console.error(e);
        alert("No se pudieron cargar las imágenes del producto.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productId]);

  // Agregar URLs (una por línea)
  const handleAddImages = async () => {
    const urls = newUrls
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      alert("Pegá al menos una URL de imagen (una por línea).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: urls }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Error al insertar imágenes");
      }
      // Refetch
      const ref = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
      const data: ImageItem[] = await ref.json();
      setImages(data);
      setNewUrls("");
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Borrar
  const handleDelete = async (imageId: number) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: "DELETE",
      });
      if (res.status === 404) {
        alert("La imagen no existe (puede que ya haya sido borrada).");
      } else if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Error al borrar imagen");
      }
      setImages(prev => prev.filter(i => i.id !== imageId));
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    }
  };

  // Marcar principal
  const handleMakePrincipal = async (imageId: number) => {
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_principal: true }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo marcar como principal");
      }
      setImages(prev =>
        prev.map(img => ({
          ...img,
          is_principal: img.id === imageId,
        }))
      );
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    }
  };

  // Drag & drop nativo
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
  };
  const onDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }
    // Reordenar local
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    // Normalizar orden 1..N
    const normalized = next.map((img, idx) => ({ ...img, orden: idx + 1 }));
    setImages(normalized);
    setDragIndex(null);

    // Persistir
    try {
      setSavingOrder(true);
      const orderPayload = normalized.map(i => ({ id: i.id, orden: i.orden }));
      const res = await fetch(`/api/products/${productId}/images/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo guardar el nuevo orden");
      }
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
      // En caso de error, refetch para sincronizar
      try {
        const ref = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
        const data: ImageItem[] = await ref.json();
        setImages(data);
      } catch {}
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "hidden"}`}
      aria-hidden={!open}
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/* Panel */}
      <div className="absolute left-1/2 top-1/2 w-[min(960px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">
              Imágenes — {productName ?? `Producto #${productId}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              Agregá, ordená (drag & drop), marcá ⭐ principal o borrá imágenes.
            </p>
          </div>
          <button
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </button>
        </div>

        {/* Agregar URLs */}
        <div className="mb-4 grid gap-2">
          <label className="text-sm font-medium">Pegar URLs (una por línea)</label>
          <textarea
            value={newUrls}
            onChange={e => setNewUrls(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            placeholder="https://...jpg
https://...png"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddImages}
              disabled={loading || !newUrls.trim()}
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Agregar"}
            </button>
            <span className="text-xs text-muted-foreground">
              Consejo: podés pegar varias a la vez.
            </span>
          </div>
        </div>

        {/* Grid de imágenes */}
        <div className="relative">
          {savingOrder && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 text-sm">
              Guardando orden...
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              Este producto aún no tiene imágenes.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border"
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(idx)}
                  title="Arrastrá para reordenar"
                >
                  {/* Imagen */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`Imagen ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Orden badge */}
                  <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                    #{img.orden}
                  </div>

                  {/* Acciones */}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-black/50 p-2 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleMakePrincipal(img.id)}
                      className={`rounded px-2 py-1 text-xs ${
                        img.is_principal ? "bg-yellow-400 text-black" : "bg-white/20 hover:bg-white/30"
                      }`}
                      title="Marcar como principal"
                    >
                      {img.is_principal ? "⭐ Principal" : "☆ Principal"}
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                      title="Eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  {/* Borde si es principal */}
                  {img.is_principal && (
                    <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
