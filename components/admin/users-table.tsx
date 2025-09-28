"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: number;
  nombre: string;
  apellido: string;
  rol_id: number;
  rol_name: string;
  email: string;
  pass: string;
}

interface UsersTableProps {
  users: User[]
  onEdit?: (user: User) => void
  onDelete?: (userId: number) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead className="text-right">Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.apellido}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">{user.rol_name}</Badge>
                
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setUserToDelete(user)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* AlertDialog de confirmación */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el usuario{" "}
              <span className="font-semibold">{userToDelete?.email}</span>?  
              Esta acción no se puede deshacer y se eliminará de forma permanente el usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (userToDelete && onDelete) {
                  onDelete(userToDelete.id)
                }
                setUserToDelete(null)
              }}
            >
              Eliminar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
