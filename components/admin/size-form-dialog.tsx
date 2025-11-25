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

interface SizeFormDialogProps {
  onSubmit?: (data: { nombre: string; tipo: string | null }) => void
  className?: string
  initialData?: { id: number; nombre: string; tipo: string | null }
  onOpenChange?: (open: boolean) => void
}

export function SizeFormDialog({ onSubmit, className, initialData, onOpenChange }: SizeFormDialogProps) {
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [nombre, setNombre] = useState("")
  const [tipo, setTipo] = useState<string>("")

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre)
      setTipo(initialData.tipo ?? "")
      setIsOpen(true)
    }
  }, [initialData])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleSubmit = () => {
    onSubmit?.({ nombre: nombre.trim(), tipo: tipo.trim() ? tipo.trim() : null })
    setIsOpen(false)
    setNombre("")
    setTipo("")
  }

  const title = initialData ? "Editar Talle" : "Agregar Nuevo Talle"
  const description = initialData ? "Edita la información del talle." : "Completa los datos del talle que deseas agregar."
  const buttonText = initialData ? "Guardar Cambios" : "Agregar Talle"

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button className={className} size="sm">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Talle</span>
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
            <Label htmlFor="nombre">Nombre del Talle</Label>
            <Input id="nombre" placeholder="Ej: S, M, L o 42, 43" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Input id="tipo" placeholder="Ej: ropa, calzado, casco" value={tipo} onChange={(e) => setTipo(e.target.value)} />
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