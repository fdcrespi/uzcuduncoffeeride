"use client"

import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"

interface AddressInputProps {
  shippingData: any
  setShippingData: (data: any) => void
}

export function AddressInput({ shippingData, setShippingData }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    // Inicializar Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "ar" }, // 🇦🇷 Argentina
      fields: ["formatted_address", "address_components", "geometry"],
      types: ["address"],
    })

    // Escuchar el evento de selección
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place) return

      // Función para buscar un componente específico del address_components
      const getComponent = (type: string) =>
        place.address_components?.find((c) => c.types.includes(type))?.long_name || ""

      // Extraer datos
      const formattedAddress = place.formatted_address || ""
      // const lat = place.geometry?.location?.lat() ?? null
      // const lng = place.geometry?.location?.lng() ?? null
      const city =
        getComponent("locality") ||
        getComponent("administrative_area_level_2") || // fallback si locality no está
        ""
      // const province =
      //   getComponent("administrative_area_level_1") ||
      //   getComponent("administrative_area_level_2") ||
      //   ""
      const zipCode = getComponent("postal_code").slice(1, 5)

      // Actualizar el estado con toda la información
      setShippingData((prev: any) => ({
        ...prev,
        address: formattedAddress,
        city,
        zipCode
      }))
    })
  }, [setShippingData])

  return (
    <div>
      <Label htmlFor="address">Dirección</Label>
      <input
        id="address"
        name="address"
        ref={inputRef}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={shippingData.address}
        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
        placeholder="Escribí tu dirección..."
        required
      />
    </div>
  )
}
