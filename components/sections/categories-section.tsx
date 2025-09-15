import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, Zap, Coffee } from "lucide-react"

export function CategoriesSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance animate-on-scroll">
          Nuestras Categorías
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift animate-on-scroll animate-delay-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors animate-float animate-delay-100">
                <Bike className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Motocicletas</CardTitle>
              <CardDescription>Desde deportivas hasta touring, encuentra tu moto ideal</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift animate-on-scroll animate-delay-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors animate-float animate-delay-200">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Vehículos Eléctricos</CardTitle>
              <CardDescription>El futuro de la movilidad sostenible</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift animate-on-scroll animate-delay-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors animate-float animate-delay-300">
                <Coffee className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Cafetería</CardTitle>
              <CardDescription>Café premium para motociclistas y amantes del buen sabor</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
