"use client"

import { Category } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export function FilterCategories({ categorias }: { categorias: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const clearFilter = () => {
    router.push('/products');
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 border-b">
        {!isMobile && <h3 className="text-lg font-bold py-4">Filtros</h3>}
        {category && (
          <div className="mb-1">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilter}
              className="flex items-center gap-1 text-xs cursor-pointer"
            >
              <X className="h-3 w-3" /> Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-medium mb-3">Categorías</h4>
        <div className="flex flex-col space-y-2">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`cursor-pointer flex justify-between items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${category == cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                }`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span>{cat.nombre}</span>
              {category === cat.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Versión móvil (Sheet)
  if (isMobile) {
    return (
      <div className="relative z-40 bg-background py-3 border-b mb-4">
        <div className="container flex justify-between items-center px-4">
          <h2 className="text-xl font-bold">Productos</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
                <Filter className="h-4 w-4" />
                Filtros
                {category && <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">1</span>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">Filtros</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">Refina tu búsqueda por categorías</SheetDescription>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  // Versión desktop (Sidebar)
  return (
    <div className="h-full border-r bg-card/50 overflow-y-auto">
      <SidebarContent />
    </div>
  );
}