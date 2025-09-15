"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categoryFilter?: string
  onCategoryChange?: (value: string) => void
  statusFilter?: string
  onStatusChange?: (value: string) => void
  className?: string
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  className,
}: SearchFiltersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          {onCategoryChange && (
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="motorcycles">Motocicletas</SelectItem>
                <SelectItem value="electric">Eléctricos</SelectItem>
                <SelectItem value="accessories">Accesorios</SelectItem>
                <SelectItem value="coffee">Cafetería</SelectItem>
              </SelectContent>
            </Select>
          )}
          {onStatusChange && (
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="out-of-stock">Sin Stock</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
