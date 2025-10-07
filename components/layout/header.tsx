"use client"

import { Button } from "@/components/ui/button"
import { Bike, Menu, Search, User } from "lucide-react"
import { CartSidebar } from "@/components/cart-sidebar"
import { useState } from "react"
import { MobileNav } from "./movile-nav"
import Image from "next/image"
import Link from "next/link"
import { Category } from "@/lib/types"

export function Header({ categories }: { categories: Category[] }) {

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60`}
      >
        <div className="flex h-20 items-center justify-between px-4">
          
           {/*  <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
                <Bike className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MotoGear & Café</span>
            </div> */}
          <Link href="/">
            <Image src="/logo-black.png" alt="Logo uzcudun coffee and ride" width={100} height={80} className="ml-4"/>
          </Link>
          

          <nav className="hidden md:flex items-center space-x-4">
            {categories.map((cat) => (
              <a key={cat.id} href={`/products?category=${cat.nombre}`} className="text-sm font-medium hover:text-primary transition-colors">
                {cat.nombre}
              </a>
            ))}
            <a href="/#cafe" className="text-sm font-medium hover:text-primary transition-colors">
              Cafetería
            </a>
            <a href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Tienda
            </a>
            
          </nav>

          <div className="hidden items-center space-x-2 md:flex">
            {/* <Button variant="ghost" size="icon" className="hover-lift">
              <Search className="w-6 h-6" />
            </Button> */}
            {/* <Button variant="ghost" size="icon" className="hover-lift">
              <User className="w-5 h-5" />
            </Button> */}
            <CartSidebar />
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-2 md:hidden">
            <CartSidebar />
            <Button
              variant="ghost"
              size="icon"
              className="hover-lift"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
  
        </div>
      </header>
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  )
}
