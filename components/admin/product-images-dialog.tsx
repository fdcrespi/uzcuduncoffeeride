"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Star, UploadCloud } from "lucide-react";

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
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [imageToDelete, setImageToDelete] = React.useState<ImageItem | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudieron cargar las imágenes");
        const data: ImageItem[] = await res.json();
        setImages(data);
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las imágenes del producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [open, productId]);

  const handlePickFiles = () => inputRef.current?.click();

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) setFiles(selected);
  };

  const handleUploadFiles = async () => {
    if (!files.length) {
      toast.warning("Seleccioná al menos una imagen.");
      return;
    }
    const form = new FormData();
    for (const f of files) form.append("files", f);

    setLoading(true);
    toast.info("Subiendo imágenes...");
    try {
      const res = await fetch(`/api/products/${productId}/images/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Error al subir imágenes");
      }
      const ref = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
      const data: ImageItem[] = await ref.json();
      setImages(data);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Imágenes subidas correctamente.");
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageToDelete.id}`, {
        method: "DELETE",
      });
      if (res.status === 404) {
        toast.error("La imagen no existe (puede que ya haya sido borrada).");
      } else if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Error al borrar imagen");
      }
      setImages((prev) => prev.filter((i) => i.id !== imageToDelete.id));
      toast.success("Imagen eliminada.");
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
    } finally {
      setImageToDelete(null);
    }
  };

  const handleMakePrincipal = async (imageId: number) => {
    toast.info("Marcando como principal...");
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
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_principal: img.id === imageId,
        }))
      );
      toast.success("Imagen principal actualizada.");
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
    }
  };

  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => e.preventDefault();
  const onDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    const normalized = next.map((img, idx) => ({ ...img, orden: idx + 1 }));
    setImages(normalized);
    setDragIndex(null);

    setSavingOrder(true);
    toast.info("Guardando nuevo orden...");
    try {
      const orderPayload = normalized.map((i) => ({ id: i.id, orden: i.orden }));
      const res = await fetch(`/api/products/${productId}/images/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo guardar el nuevo orden");
      }
      toast.success("Orden guardado.");
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message);
      try {
        const ref = await fetch(`/api/products/${productId}/images`, { cache: "no-store" });
        const data: ImageItem[] = await ref.json();
        setImages(data);
      } catch {}
    } finally {
      setSavingOrder(false);
    }
  };

  const onDropZone: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-1/2 w-full md:max-w-4xl h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Imágenes de {productName ?? `Producto #${productId}`}</DialogTitle>
            <DialogDescription>
              Arrastrá y soltá las imágenes para reordenarlas. Podés subir nuevas o marcar una como principal.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Columna de subida */}
            <div className="md:col-span-1 flex flex-col gap-4 p-1 overflow-y-auto">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDropZone}
                className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-4 text-center h-48"
              >
                <UploadCloud className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Arrastrá imágenes aquí o</p>
                <Button type="button" variant="outline" size="sm" onClick={handlePickFiles}>
                  Seleccionar Archivos
                </Button>
                <input
                  ref={inputRef}
                  title="imagen"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                />
              </div>

              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm">Archivos listos para subir:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {files.map((f, i) => {
                      const url = URL.createObjectURL(f);
                      return (
                        <div key={`${f.name}-${i}`} className="relative aspect-square overflow-hidden rounded-md border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={f.name} className="h-full w-full object-cover" />
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    type="button"
                    onClick={handleUploadFiles}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? "Subiendo..." : `Subir ${files.length} imágen(es)`}
                  </Button>
                </div>
              )}
               <p className="text-xs text-muted-foreground text-center mt-2">
                Tipos permitidos: JPG, PNG, WEBP. Máx. 5MB.
              </p>
            </div>

            {/* Columna de imágenes */}
            <div className="md:col-span-2 relative overflow-y-auto p-1">
              {savingOrder && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm text-sm">
                  Guardando orden...
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="flex items-center justify-center h-full rounded-lg border border-dashed">
                  <p className="text-center text-sm text-muted-foreground">
                    Este producto aún no tiene imágenes.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={`Imagen ${idx + 1}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />

                      <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                        #{img.orden}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMakePrincipal(img.id)}
                          title="Marcar como principal"
                        >
                          <Star className={`h-4 w-4 ${img.is_principal ? "text-yellow-400 fill-yellow-400" : ""}`} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setImageToDelete(img)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {img.is_principal && <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-yellow-400 ring-offset-2 ring-offset-background" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


