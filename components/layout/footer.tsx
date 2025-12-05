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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                <a href="/products?category=5" className="hover:text-primary transition-colors">
                  Motocicletas
                </a>
              </li>
              <li>
                <a href="/products?category=1" className="hover:text-primary transition-colors">
                  Vehículos Eléctricos
                </a>
              </li>
              <li>
                <a href="/products?category=2" className="hover:text-primary transition-colors">
                  Accesorios
                </a>
              </li>
              <li>
                <a href="/products?category=3" className="hover:text-primary transition-colors">
                  Indumentaria
                </a>
              </li>
            </ul>
          </div>

          {/* <div>
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
          </div> */}

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
              {/* WhatsApp */}
              <li>
                <a
                  href={`https://wa.me/${data.telefono}?text=Hola%20Uzcudun%20Coffee%20and%20Ride!`}
                  className="flex gap-2"
                  target="_blank"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-6 w-6 font-bold" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  {data.telefono}
                </a>
              </li>
              {/* Phone */}
              <li>
                <a
                  href={`tel:${data.telefono}`}
                  className="flex gap-2"
                >
                  <Phone />
                  {data.telefono}
                </a>
              </li>
              {/* Email */}
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
