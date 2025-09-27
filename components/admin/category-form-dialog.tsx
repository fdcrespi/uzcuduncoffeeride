"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"

interface CategoryFormDialogProps {
  onSubmit?: (data: any) => void
  className?: string
  initialData?: { id: string, nombre: string }
  onOpenChange?: (open: boolean) => void
}

export function CategoryFormDialog({ onSubmit, className, initialData, onOpenChange }: CategoryFormDialogProps) {
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.nombre)
      setIsOpen(true)
    }
  }, [initialData])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name: categoryName })
    }
    setIsOpen(false)
    setCategoryName("")
  }

  const title = initialData ? "Editar Categoría" : "Agregar Nueva Categoría"
  const description = initialData ? "Edita la información de la categoría." : "Completa la información de la categoría que deseas agregar."
  const buttonText = initialData ? "Guardar Cambios" : "Agregar Categoría"

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button className={className}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Categoría
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la Categoría</Label>
            <Input id="name" placeholder="Ej: Motocicletas" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}