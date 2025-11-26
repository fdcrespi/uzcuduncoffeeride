import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingAdminProducts() {
  return (
    <div className="space-y-4 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Filtros: buscador + select */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full sm:w-[240px]" />
      </div>

      {/* Tabla: 5 filas de ejemplo */}
      <div className="border rounded-md flex-1 overflow-auto">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b">
          <Skeleton className="col-span-4 h-5" />
          <Skeleton className="col-span-2 h-5" />
          <Skeleton className="col-span-2 h-5" />
          <Skeleton className="col-span-2 h-5" />
          <Skeleton className="col-span-2 h-5" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-4 py-4 border-b">
            <div className="col-span-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-6" />
            <div className="col-span-2 flex justify-end gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-9 w-24" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-9" />
        ))}
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
