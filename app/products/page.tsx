import { Header } from '@/components/layout/header'
import { getProducts } from '@/lib/queries'
import { ProductList } from '@/components/product-list'
import type { Product } from '@/lib/types'

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.category;
  const products = await getProducts(category) as Product[];

  const pageTitle = category ? `Categoría: ${category}` : "Nuestros Productos";
  const pageDescription = category 
    ? `Explora nuestra selección de productos en la categoría ${category}.`
    : "Explora nuestra selección de motos, accesorios y café de especialidad.";

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {pageDescription}
          </p>
        </div>

        {products.length > 0 ? (
          <ProductList initialProducts={products} />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Aun no tenemos productos de esa categoria disponibles en la web.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
