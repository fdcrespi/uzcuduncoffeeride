import data from "@/lib/data"
import { Mail, Map, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-card border-t py-12 px-4 ${className || ""}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="logo-black.png" alt="logo uzcudun coffee and ride" width={120} height={80} />
              <span className="text-lg font-bold">COFFEE & RIDE</span>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Tu destino para motocicletas, vehículos eléctricos y el mejor café de la ciudad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Motocicletas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Vehículos Eléctricos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Accesorios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Repuestos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Cafetería</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Menú
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Reservas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Catering
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link 
                  href={`${data.ubicacion_mapa}`}
                  className="flex gap-2"
                  target="_blank"
                >
                  <MapPin />
                  {data.direccion} - CP {data.codigo_postal}
                </Link>
              </li>
              <li className="flex gap-2">
                <Map />
                {data.ciudad}, {data.provincia}, {data.pais}
              </li>
              <li>
                <a
                  href={`tel:${data.telefono}`}
                  className="flex gap-2"
                >
                  <Phone />
                  {data.telefono}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${data.email}`}
                  className="flex gap-2"
                >
                  <Mail />
                  {data.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 <Link href="https://www.bitia.com.ar" className="text-blue-900 text-bold" target="_blank">Bitia</Link>. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
