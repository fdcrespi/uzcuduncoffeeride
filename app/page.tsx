import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { CafeSection } from "@/components/sections/cafe-section";
import { ScrollWheel } from "@/components/scroll-animations";
import { FeaturedProductsClient } from "@/components/sections/featured-products-client";
import { Header } from "@/components/layout/header";

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <ScrollWheel />
      
      <Header />

      <HeroSection />

      <CategoriesSection />

      <FeaturedProductsClient />

      <CafeSection />

      <Footer />
    </div>
  );
}