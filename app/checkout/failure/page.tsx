import { XCircle } from "lucide-react";

export default function FailurePage() {
  return (
    <div className="container mt-4 mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">El pago ha sido rechazado</h1>
      <div className="flex justify-center">
        <XCircle className="text-red-500 w-16 h-16 mb-4" />
      </div>
      <p className="mb-2">Lamentablemente, tu pago no pudo ser procesado.</p>
      <p className="mt-4">Por favor, intenta nuevamente o utiliza otro método de pago.</p>
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">Volver al inicio</a>
      </div>
    </div>
  );
}