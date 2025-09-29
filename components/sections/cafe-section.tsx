import { Button } from "@/components/ui/button"
import { Coffee, Bike, Star } from "lucide-react"
import Image from "next/image"

export function CafeSection() {
  return (
    <section id="cafe" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll animate-fade-in-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Más que una Tienda,
              <span className="text-primary"> una Experiencia</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              Nuestro café es el punto de encuentro perfecto para motociclistas. Disfruta de café premium, snacks
              deliciosos y comparte historias de la carretera mientras planeas tu próxima aventura.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 animate-fade-in-left animate-delay-100">
                <Coffee className="w-6 h-6 text-primary" />
                <span>Café de especialidad tostado localmente</span>
              </div>
              <div className="flex items-center space-x-3 animate-fade-in-left animate-delay-200">
                <Bike className="w-6 h-6 text-primary" />
                <span>Ambiente motociclista auténtico</span>
              </div>
              <div className="flex items-center space-x-3 animate-fade-in-left animate-delay-300">
                <Star className="w-6 h-6 text-primary" />
                <span>Eventos y encuentros semanales</span>
              </div>
            </div>
            {/* <Button size="lg" className="mt-8 btn-motorcycle">
              Ver Menú Completo
            </Button> */}
          </div>
          <div className="relative animate-on-scroll animate-fade-in-right">
            <div className="hover-lift">
              <Image
                src="/motorcycle-cafe-interior-with-bikes-and-coffee.jpg"
                alt="Interior de la cafetería"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
