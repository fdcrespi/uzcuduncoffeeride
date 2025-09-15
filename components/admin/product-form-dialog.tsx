"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"

interface ProductFormDialogProps {
  onSubmit?: (data: any) => void
  className?: string
}

export function ProductFormDialog({ onSubmit, className }: ProductFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    // Handle form submission logic here
    if (onSubmit) {
      onSubmit({})
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>Completa la información del producto que deseas agregar al inventario.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input id="name" placeholder="Ej: Casco Integral Premium" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motorcycles">Motocicletas</SelectItem>
                <SelectItem value="electric">Eléctricos</SelectItem>
                <SelectItem value="accessories">Accesorios</SelectItem>
                <SelectItem value="coffee">Cafetería</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" placeholder="0" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Descripción del producto..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Agregar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
