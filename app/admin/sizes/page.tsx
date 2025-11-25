'use client'

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, Pencil, Edit } from "lucide-react"
import { SizeFormDialog } from "@/components/admin/size-form-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface SizeItem { id: number; nombre: string; tipo: string | null }

export default function SizesPage() {
  const [sizes, setSizes] = useState<SizeItem[]>([])
  const [editingSize, setEditingSize] = useState<SizeItem | null>(null)
  const [errorDialog, setErrorDialog] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' })

  const fetchSizes = async () => {
    const res = await fetch('/api/sizes')
    const data = await res.json()
    setSizes(data)
  }

  useEffect(() => {
    fetchSizes()
  }, [])

  const handleAddSize = async (data: { nombre: string; tipo: string | null }) => {
    const response = await fetch('/api/sizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const created = await response.json()
    if (response.ok) {
      setSizes(prev => [...prev, created])
    } else {
      setErrorDialog({ isOpen: true, message: created.message || 'Ocurrió un error al agregar el talle.' })
    }
  }

  const handleUpdateSize = async (id: number, data: { nombre: string; tipo: string | null }) => {
    const response = await fetch(`/api/sizes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const updated = await response.json()
      setSizes(prev => prev.map(s => s.id === id ? updated : s))
      setEditingSize(null)
    } else {
      const err = await response.json()
      setErrorDialog({ isOpen: true, message: err.message || 'No se pudo actualizar el talle.' })
    }
  }

  const handleDeleteSize = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este talle?')
    if (!confirmDelete) return
    const response = await fetch(`/api/sizes/${id}`, { method: 'DELETE' })
    if (response.status === 204) {
      setSizes(prev => prev.filter(s => s.id !== id))
    } else {
      const err = await response.json()
      setErrorDialog({ isOpen: true, message: err.message || 'No se pudo eliminar el talle.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Talles</h2>
          <p className="text-muted-foreground">Gestiona tus talles (ver, crear, editar, eliminar).</p>
        </div>
        <div className="w-full flex justify-end md:w-auto">
          <SizeFormDialog onSubmit={handleAddSize} />
        </div>
      </div>

      {/* Sizes table */}
      {sizes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Talles ({sizes.length})</CardTitle>
            <CardDescription>Gestiona todos tus talles desde esta vista</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizes.map((size) => (
                  <TableRow key={size.id}>
                    <TableCell className="font-medium">{size.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{size.tipo ?? '-'}</TableCell>
                    <TableCell className="text-right">
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingSize(size)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSize(size.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button onClick={() => setEditingSize(size)} variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDeleteSize(size.id)} size="icon" variant="ghost" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {editingSize && (
        <SizeFormDialog
          initialData={editingSize}
          onOpenChange={(open) => !open && setEditingSize(null)}
          onSubmit={(data) => handleUpdateSize(editingSize.id, data)}
        />
      )}

      <AlertDialog open={errorDialog.isOpen} onOpenChange={(open) => setErrorDialog({ isOpen: open, message: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}