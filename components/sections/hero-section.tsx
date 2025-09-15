"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Coffee } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 parallax-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <Image
          src="/motorcycle-on-scenic-mountain-road-at-sunset.jpg"
          alt="Motocicleta en carretera"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance animate-fade-in-up">
          Tu Pasión por las
          <span className="text-primary animate-float"> Dos Ruedas</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty opacity-90 animate-fade-in-up animate-delay-200">
          Descubre motocicletas, vehículos eléctricos, accesorios premium y disfruta del mejor café mientras planeas tu
          próxima aventura
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
          <Button size="lg" className="text-lg px-8 py-6 btn-motorcycle">
            Explorar Productos
            <ShoppingCart className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-black/40 border-white/60 text-white hover:bg-white/20 btn-motorcycle"
          >
            Visitar Cafetería
            <Coffee className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
