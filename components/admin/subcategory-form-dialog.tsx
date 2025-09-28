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

interface SubcategoryFormDialogProps {
  onSubmit?: (data: any) => void
  className?: string
  rubroId: string
  initialData?: { id: string, nombre: string }
  onOpenChange?: (open: boolean) => void
}

export function SubcategoryFormDialog({ onSubmit, className, rubroId, initialData, onOpenChange }: SubcategoryFormDialogProps) {
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [subcategoryName, setSubcategoryName] = useState("")

  useEffect(() => {
    if (initialData) {
      setSubcategoryName(initialData.nombre)
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
      onSubmit({ name: subcategoryName, rubro_id: rubroId })
    }
    setIsOpen(false)
    setSubcategoryName("")
  }

  const title = initialData ? "Editar Subcategoría" : "Agregar Nueva Subcategoría"
  const description = initialData ? "Edita la información de la subcategoría." : "Completa la información de la subcategoría que deseas agregar."
  const buttonText = initialData ? "Guardar Cambios" : "Agregar Subcategoría"

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button className={className} size="sm">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Subcategoría</span>
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
            <Label htmlFor="name">Nombre de la Subcategoría</Label>
            <Input id="name" placeholder="Ej: Deportivas" value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} />
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