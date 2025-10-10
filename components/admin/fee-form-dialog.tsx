"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Fee = {
  id?: number;
  cp: string;
  fee: number;
  eta_days?: number | null;
  activo?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** si viene, es edición */
  editing?: Fee | null;
  /** callback para refrescar la tabla después de guardar */
  onSaved?: (saved: Fee) => void;
};

export default function FeeFormDialog({ open, onOpenChange, editing, onSaved }: Props) {
  const [cp, setCp] = React.useState<string>("");
  const [fee, setFee] = React.useState<string>("");
  const [etaDays, setEtaDays] = React.useState<string>("");
  const [activo, setActivo] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState(false);

  // Dialog de error (reemplaza alert())
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      setCp(editing.cp ?? "");
      setFee(editing.fee != null ? String(editing.fee) : "");
      setEtaDays(editing.eta_days != null ? String(editing.eta_days) : "");
      setActivo(editing.activo ?? true);
    } else {
      setCp("");
      setFee("");
      setEtaDays("");
      setActivo(true);
    }
  }, [open, editing]);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setErrorOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editing && !cp.trim()) {
      showError("El Código Postal es requerido.");
      return;
    }
    const feeNum = Number(fee);
    if (Number.isNaN(feeNum) || feeNum < 0) {
      showError("El costo (ARS) es inválido.");
      return;
    }
    const etaNum = etaDays.trim() === "" ? null : Number(etaDays);
    if (etaNum != null && (Number.isNaN(etaNum) || etaNum < 0)) {
      showError("Plazo (días) inválido.");
      return;
    }

    setSaving(true);
    try {
      let res: Response;

      if (editing) {
        // PUT /api/logistics/fees/:cp
        res = await fetch(`/api/logistics/fees/${encodeURIComponent(editing.cp)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fee: feeNum,
            eta_days: etaNum,
            activo,
          }),
        });
      } else {
        // POST /api/logistics/fees
        res = await fetch(`/api/logistics/fees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cp: cp.trim(),
            fee: feeNum,
            eta_days: etaNum,
            activo,
          }),
        });
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || j.error || "No se pudo guardar.");
      }

      const saved = (await res.json()) as Fee;
      onSaved?.(saved);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      showError((err as Error).message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tarifa" : "Nueva tarifa"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="grid gap-4">
            {!editing && (
              <div>
                <Label htmlFor="cp">Código Postal (o “*” fallback)</Label>
                <Input
                  id="cp"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder='Ej. "7600" o "*"'
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="fee">Costo (ARS)</Label>
              <Input
                id="fee"
                inputMode="decimal"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="Ej. 2500"
                required
              />
            </div>

            <div>
              <Label htmlFor="eta">Plazo (días) — opcional</Label>
              <Input
                id="eta"
                inputMode="numeric"
                value={etaDays}
                onChange={(e) => setEtaDays(e.target.value)}
                placeholder="Ej. 3"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="activo"
                title="form"
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              <Label htmlFor="activo">Activo</Label>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de error (sustituye alert) */}
      <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


