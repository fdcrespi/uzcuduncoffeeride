"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Subcategory {
  id: string;
  nombre: string;
}

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  image: string;
  subrubro_id: string;
  precio: number;
  stock: number;
}

interface ProductFormDialogProps {
  subcategories: Subcategory[];
  onSubmit: (data: Omit<Product, 'id' | 'subrubro_nombre'>) => void;
  initialData?: Product | null;
  onOpenChange: (open: boolean) => void;
}

const initialFormData = {
    nombre: '',
    descripcion: '',
    subrubro_id: '',
    precio: 0,
    stock: 0,
    image: '',
};

export function ProductFormDialog({ subcategories, onSubmit, initialData, onOpenChange }: ProductFormDialogProps) {
  const [isOpen, setIsOpen] = useState(!!initialData);
  const [formData, setFormData] = useState(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion,
        subrubro_id: String(initialData.subrubro_id ?? ""),
        precio: initialData.precio,
        stock: initialData.stock,
        image: initialData.image,
      });
      if (initialData.image) {
        setFileName(initialData.image.split('/').pop() || null);
      }
      setIsOpen(true);
    } else {
      setFormData(initialFormData);
      setFileName(null);
    }
  }, [initialData]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
    if (!open) {
      setFormData(initialFormData);
      setFileName(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subrubro_id: value }));
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);
    toast.info(`Subiendo imagen: ${file.name}`);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Error al subir el archivo.");
      }

      setFormData(prev => ({ ...prev, image: result.url }));
      toast.success("Imagen subida correctamente.");

    } catch (error: any) {
      setFormData(prev => ({ ...prev, image: initialData?.image || '' }));
      setFileName(initialData?.image.split('/').pop() || null);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.image) {
      toast.error("Por favor, sube una imagen para el producto.");
      return;
    }
    if (!formData.subrubro_id) {
        toast.error("Por favor, selecciona una subcategoría.");
        return;
    }
    onSubmit({
      ...formData,
      precio: Number(formData.precio) || 0,
      stock: Number(formData.stock) || 0,
    });
    handleOpenChange(false);
  };

  const title = initialData ? "Editar Producto" : "Agregar Nuevo Producto";
  const description = initialData
    ? "Edita la información del producto."
    : "Completa la información del producto que deseas agregar al inventario.";
  const buttonText = initialData ? "Guardar Cambios" : "Agregar Producto";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2 ">
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input id="nombre" placeholder="Ej: Casco Integral Premium" value={formData.nombre} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subrubro_id">Subcategoría</Label>
            <Select value={formData.subrubro_id} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map(sub => (
                  <SelectItem key={sub.id} value={String(sub.id)}>{sub.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="precio">Precio</Label>
              <Input id="precio" type="number" placeholder="" value={formData.precio} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" placeholder="" value={formData.stock} onChange={handleChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" placeholder="Descripción del producto..." value={formData.descripcion} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label>Imagen del Producto</Label>
            <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
            <Button asChild variant="outline">
              <Label htmlFor="file-upload" className="flex items-center cursor-pointer font-normal">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Subiendo..." : "Seleccionar Archivo"}
              </Label>
            </Button>
            <p className="text-xs text-muted-foreground">Tamaño máximo por imagen: 10MB.</p>
            {fileName && formData.image && (
              <div className="flex items-center text-sm text-muted-foreground mt-2 p-2 border rounded-md">
                <Image
                  src={formData.image}
                  alt="Vista previa"
                  width={40}
                  height={40}
                  className="object-contain rounded-md mr-3 flex-shrink-0"
                />
                <span className="truncate min-w-0 max-w-[200px] flex-1">
                  {fileName}
                </span>
                {!isUploading && (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-3 flex-shrink-0" />
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "Espere..." : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}