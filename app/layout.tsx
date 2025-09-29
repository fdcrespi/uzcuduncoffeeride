import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { RemoveItemDialog } from "@/components/cart/remove-item-dialog"
import { Header } from "@/components/layout/header"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Uzcudun Coffe & Ride",
  description:
    "Tu destino para motocicletas, vehículos eléctricos, accesorios y el mejor café. Descubre nuestra amplia gama de productos.",
  generator: "Bitia",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${montserrat.variable} ${GeistMono.variable}`}>
        <CartProvider>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Toaster />
          <RemoveItemDialog />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
