import { Bike } from "lucide-react"

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
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">MotoGear & Café</span>
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
              <li>Av. Principal 123</li>
              <li>Ciudad, País</li>
              <li>+1 (555) 123-4567</li>
              <li>info@motogear.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MotoGear & Café. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
