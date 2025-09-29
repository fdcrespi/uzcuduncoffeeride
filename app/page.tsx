"use client"

import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { CafeSection } from "@/components/sections/cafe-section"
import { ProductCard } from "@/components/product-card"
import { ScrollWheel, useScrollAnimation } from "@/components/scroll-animations"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { Header } from "@/components/layout/header"

const sampleProducts: Product[] = [
  {
    id: "1",
    nombre: "Yamaha MT-07",
    descripcion: "Motocicleta naked de media cilindrada",
    precio: 7500,
    image: "/yamaha-mt07-blue.jpg",
    category: "motorcycle",
    stock: 50,
    subrubro_id: "1",
    subrubro_nombre: "Motocicletas"
  },
  {
    id: "2",
    nombre: "Zero SR/F",
    descripcion: "Motocicleta eléctrica de alto rendimiento",
    precio: 20000,
    image: "/zero-srf-electric-motorcycle.jpg",
    category: "electric",
    stock: 30,
    subrubro_id: "2",
    subrubro_nombre: "Vehículos Eléctricos"
  },
  {
    id: "3",
    nombre: "Casco Integral",
    descripcion: "Casco de alta seguridad para motociclistas",
    precio: 150,
    image: "/full-face-motorcycle-helmet.jpg",
    category: "accessory",
    stock: 100,
    subrubro_id: "3",
    subrubro_nombre: "Accesorios"
  },
  {
    id: "4",
    nombre: "Guantes de Cuero",
    descripcion: "Guantes resistentes para conducción segura",
    precio: 60,
    image: "/leather-motorcycle-gloves.jpg",
    category: "accessory",
    stock: 200,
    subrubro_id: "3",
    subrubro_nombre: "Accesorios"
  },
]

export default function HomePage() {
  useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <ScrollWheel />

      <Header />

      <HeroSection />

      <CategoriesSection />

      {/* Featured Products */}
      <section id="productos" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance animate-on-scroll">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product, index) => (
              <div key={product.id} className={`animate-on-scroll animate-delay-${(index + 1) * 100}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CafeSection />

      <Footer />
    </div>
  )
}
