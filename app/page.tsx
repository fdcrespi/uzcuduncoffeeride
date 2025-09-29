"use client"

import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { CafeSection } from "@/components/sections/cafe-section"
import { ProductCard } from "@/components/product-card"
import { ScrollWheel, useScrollAnimation } from "@/components/scroll-animations"
import type { Product } from "@/lib/types"
import Link from "next/link"

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Yamaha R6 2024",
    description: "Motocicleta deportiva de alta performance",
    price: 18500,
    image: "/modern-sport-motorcycle-in-showroom.jpg",
    category: "motorcycle",
    inStock: true,    
  },
  {
    id: "2",
    name: "NIU NGT",
    description: "Scooter eléctrico urbano",
    price: 3200,
    image: "/electric-scooter-modern-design.jpg",
    category: "electric",
    inStock: true,    
  },
  {
    id: "3",
    name: "Casco AGV K6",
    description: "Casco integral premium",
    price: 450,
    image: "/motorcycle-helmet-premium-black.jpg",
    category: "accessory",
    inStock: true,
    
  },
  {
    id: "4",
    name: "Café Ruta 66",
    description: "Mezcla especial para motociclistas",
    price: 24,
    image: "/premium-coffee-beans-package-motorcycle-theme.jpg",
    category: "coffee",
    inStock: true,    
  },
]

export default function HomePage() {
  useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <ScrollWheel />

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
                <Link href={`/products/${product.id}`} className="cursor-pointer">
                  <ProductCard product={product} />
                </Link>
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
