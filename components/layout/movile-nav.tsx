"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bike } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navItems = [
    { href: "#motocicletas", label: "Motocicletas" },
    { href: "#electricos", label: "Eléctricos" },
    { href: "#accesorios", label: "Accesorios" },
    { href: "#cafe", label: "Cafetería" },
    { href: "#productos", label: "Productos" },
    { href: "/admin", label: "Admin Panel" },
  ]

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      window.location.href = href
    }
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary-foreground" />
              </div>
              <SheetTitle className="text-lg font-bold">MotoGear & Café</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <nav className="p-6">
          <div className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
