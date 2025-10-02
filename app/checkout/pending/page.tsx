import { AlertCircle } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="container mt-4 mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Tu pago está pendiente</h1>
      <div className="flex justify-center">
        <AlertCircle className="text-yellow-500 w-16 h-16 mb-4" />
      </div>
      <p className="mb-2">Estamos esperando la confirmación del pago.</p>
      <p className="mt-4">Te notificaremos por correo una vez que el pago haya sido confirmado.</p>
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">Volver al inicio</a>
      </div>
    </div>
  );
}