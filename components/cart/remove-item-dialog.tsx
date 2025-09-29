'use client';
/*
// El diálogo de confirmación para eliminar un artículo del carrito (`RemoveItemDialog`)
// se ha implementado como un componente global en `app/layout.tsx` en lugar de estar
// directamente en una página específica (como `checkout/page.tsx`) por las siguientes razones:
//
// 1.  **Desacoplamiento y Reutilización:** El estado y la lógica del carrito son globales
//     (manejados por `CartContext`). El carrito puede ser modificado desde múltiples lugares
//     (ej. el checkout, el `CartSidebar`, etc.). Al centralizar el diálogo y controlarlo
//     desde el contexto, garantizamos que la confirmación funcione de manera consistente
//     en toda la aplicación sin tener que duplicar el componente o la lógica.
//
// 2.  **Separación de Responsabilidades (SoC):** Las páginas como `checkout` ya tienen
//     suficiente complejidad. Mantener el diálogo como un componente separado y global
//     mantiene el código de las páginas más limpio y enfocado en su propósito principal.
//     El diálogo solo se preocupa de una cosa: confirmar una acción del `CartContext`.
//
// Este enfoque hace que el sistema sea más mantenible y escalable.
*/

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
import { useCart } from "@/contexts/cart-context";

export function RemoveItemDialog() {
  const { itemToRemove, confirmRemoveItem, cancelRemoveItem } = useCart();

  // Se renderiza al restarle 1 a la cantidad (cuando la cantidad es 1) - Antes de borrar el producto, pregunta.
  if (!itemToRemove) {
    return null;
  }

  return (
    <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && cancelRemoveItem()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar "{itemToRemove.product.name}" de tu carrito.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelRemoveItem}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={confirmRemoveItem}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
