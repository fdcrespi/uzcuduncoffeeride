import { Header } from '@/components/layout/header'
import { getCategories, getProducts } from '@/lib/queries'
import { ProductList } from '@/components/product-list'
import { TriangleAlert } from 'lucide-react';
import { FilterCategories } from '@/components/filter-categories';

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.category;
  const products = await getProducts({ category, visible: true });
  const categories = await getCategories();

  const pageTitle = category ? `Categoría: ${categories.find(c => c.id == category)?.nombre || category}` : "Nuestros Productos";
  const pageDescription = category 
    ? `Explora nuestra selección de productos en la categoría ${categories.find(c => c.id == category)?.nombre || category}.`
    : "Explora nuestra selección de motos, accesorios y vehículos eléctricos.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header categories={categories} />
      
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar de filtros */}
        <div className="md:w-64 flex-shrink-0">
          <FilterCategories categorias={categories} />
        </div>
        
        {/* Contenido principal */}
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="md:text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{pageTitle}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {pageDescription}
              </p>
            </div>

            {products.length > 0 ? (
              <ProductList initialProducts={products} />
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground flex items-center justify-center">
                  <TriangleAlert className="inline-block h-6 w-6 text-red-500" />
                  <span className="font-bold ml-2">
                    {category ? `Aun no tenemos productos de la categoría ${categories.find(c => c.id == category)?.nombre || category} disponibles en la web.` : `Aun no tenemos productos disponibles en la web.`}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
