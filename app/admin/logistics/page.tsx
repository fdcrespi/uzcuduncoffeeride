"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import FeeFormDialog from "@/components/admin/fee-form-dialog";
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

type FeeRow = {
  cp: string;
  fee: number;
  eta_days?: number | null;
  activo?: boolean;
  updated_at?: string | null;
};

export default function LogisticsPage() {
  const [rows, setRows] = React.useState<FeeRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FeeRow | null>(null);

  // Dialog de confirmación de borrado
  const [confirmDeleteCP, setConfirmDeleteCP] = React.useState<string | null>(null);

  // Dialog de error
  const [errorDialog, setErrorDialog] = React.useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = q ? `/api/logistics/fees?q=${encodeURIComponent(q)}` : `/api/logistics/fees`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudieron cargar las tarifas.");
      }
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      setRows([]);
      setErrorDialog({ isOpen: true, message: e.message || "Error al cargar la tabla." });
    } finally {
      setLoading(false);
    }
  }, [q]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const onEdit = (row: FeeRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  // abrir confirmación
  const onAskDelete = (cp: string) => setConfirmDeleteCP(cp);

  // ejecutar borrado tras confirmar
  const onConfirmDelete = async () => {
    if (!confirmDeleteCP) return;
    try {
      const res = await fetch(`/api/logistics/fees/${encodeURIComponent(confirmDeleteCP)}`, { method: "DELETE" });
      if (res.status === 404) {
        throw new Error("No existe ese CP.");
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Error al eliminar.");
      }
      setRows((prev) => prev.filter((r) => r.cp !== confirmDeleteCP));
    } catch (e: any) {
      console.error(e);
      setErrorDialog({ isOpen: true, message: e.message || "Error al eliminar." });
    } finally {
      setConfirmDeleteCP(null);
    }
  };

  // helper de ordenamiento por CP (numérico si aplica; '*' al final)
  const sortRows = React.useCallback((arr: FeeRow[]) => {
    return arr.slice().sort((a, b) => {
      if (a.cp === "*" && b.cp !== "*") return 1;
      if (b.cp === "*" && a.cp !== "*") return -1;
      const na = /^\d+$/.test(a.cp) ? Number(a.cp) : Number.POSITIVE_INFINITY;
      const nb = /^\d+$/.test(b.cp) ? Number(b.cp) : Number.POSITIVE_INFINITY;
      if (na !== nb) return na - nb;
      return a.cp.localeCompare(b.cp);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Logística</h2>
        <p className="text-muted-foreground">
          Gestioná costos de envío por Código Postal (fallback local provisional).
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Tarifas por CP</CardTitle>
            <CardDescription>
              Alta/edición/eliminación de filas. El endpoint público de cotización usa esta tabla.
            </CardDescription>
          </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value.replace(/[^\d*]/g, ""))}
                placeholder="Buscar CP…"
                className="w-40"
              />
              <Button variant="outline" onClick={fetchData} title="Refrescar">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={onNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Cargando…</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No hay filas para mostrar.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CP</TableHead>
                  <TableHead>Fee (ARS)</TableHead>
                  <TableHead>Plazo (días)</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.cp}>
                    <TableCell>{r.cp}</TableCell>
                    <TableCell>${Number(r.fee).toLocaleString("es-AR")}</TableCell>
                    <TableCell>{r.eta_days ?? "—"}</TableCell>
                    <TableCell>
                        <span
                            className={
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                                (r.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                            }
                            >
                            {r.activo ? "Activo" : "Inactivo"}
                        </span>
                    </TableCell>
                    <TableCell>{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(r)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onAskDelete(r.cp)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog alta/edición (usa props correctas del FeeFormDialog) */}
      <FeeFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing || undefined}
        onSaved={(saved) => {
          setRows((prev) => {
            const exists = prev.some((r) => r.cp === saved.cp);
            const next = exists
              ? prev.map((r) => (r.cp === saved.cp ? { ...r, ...saved } : r))
              : [...prev, saved];
            return sortRows(next);
          });
        }}
      />

      {/* Confirmar eliminación */}
      <AlertDialog open={!!confirmDeleteCP} onOpenChange={(open) => !open && setConfirmDeleteCP(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tarifa</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Deseás eliminar el CP <strong>{confirmDeleteCP}</strong>? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDeleteCP(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirmDelete}>
              Eliminar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error dialog */}
      <AlertDialog open={errorDialog.isOpen} onOpenChange={(open) => setErrorDialog({ ...errorDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ isOpen: false, message: "" })}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


