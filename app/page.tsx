"use client"

import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { CafeSection } from "@/components/sections/cafe-section"
import { ProductCard } from "@/components/product-card"
import { ScrollWheel, useScrollAnimation } from "@/components/scroll-animations"
import Link from "next/link"



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
            {/* {Products.map((product, index) => (
              <div key={product.id} className={`animate-on-scroll animate-delay-${(index + 1) * 100}`}>
                <Link href={`/products/${product.id}`} className="cursor-pointer">
                  <ProductCard product={product} />
                </Link>
              </div>
            ))} */}
          </div>
        </div>
      </section>

      <CafeSection />

      <Footer />
    </div>
  )
}
