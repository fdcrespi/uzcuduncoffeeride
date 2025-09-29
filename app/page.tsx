import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { CafeSection } from "@/components/sections/cafe-section";
import { ScrollWheel } from "@/components/scroll-animations";
import { FeaturedProductsClient } from "@/components/sections/featured-products-client";
import type { Product } from "@/lib/types";
import { Header } from "@/components/layout/header";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // En componentes de servidor, debemos usar la URL absoluta de la API.
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, {
      cache: 'no-store', // Para asegurar que los productos sean aleatorios en cada visita
    });

    if (!response.ok) {
      console.error('Error al cargar los productos');
      return [];
    }

    const allProducts: Product[] = await response.json();
    
    // Mezclar y tomar hasta 3 productos
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);

  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-background">
      <ScrollWheel />
      
      <Header />
      
      <HeroSection />

      <CategoriesSection />

      <FeaturedProductsClient products={featuredProducts} />

      <CafeSection />

      <Footer />
    </div>
  );
}