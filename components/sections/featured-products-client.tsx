'use client'

import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { useScrollAnimation } from '@/components/scroll-animations';
import type { Product } from '@/lib/types';

interface FeaturedProductsClientProps {
  products: Product[];
}

export function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  // Este hook ahora se ejecuta en un componente que ya tiene los productos,
  // por lo que puede encontrar los elementos a animar.
  useScrollAnimation();

  return (
    <section id="productos" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance animate-on-scroll">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={product.id} className={`animate-on-scroll animate-delay-${(index + 1) * 100}`}>
                <Link href={`/products/${product.id}`} className="cursor-pointer">
                  <ProductCard product={product} />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-muted-foreground">Aún no tenemos productos destacados.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
