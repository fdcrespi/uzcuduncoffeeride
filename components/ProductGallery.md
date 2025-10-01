# 🖼️ ProductGallery – Galería de Productos

Un componente **React + Next.js + TailwindCSS** para mostrar imágenes de productos al estilo Mercado Libre / Amazon.  

Incluye:  
- ✅ Miniaturas verticales/horizontales con scroll.  
- ✅ Imagen principal con animaciones **fade/slide**.  
- ✅ **Hover zoom** en desktop.  
- ✅ **Fullscreen modal** en mobile (o desktop si se habilita).  
- ✅ **Swipe y pinch zoom** en fullscreen.  
- ✅ **Accesibilidad** (teclado: ← → Esc).  
- ✅ Indicador `X / N`.  
- ✅ **Optimización SEO y performance** (`next/image`, blur placeholders).  

---

## 🚀 Instalación

Este componente funciona tanto con **pnpm** como con **npm**.  
Usá el mismo package manager que ya tenga tu proyecto (⚠️ **no mezclar**).  

### 👉 Con **pnpm**

```bash
pnpm add framer-motion@10.16.4 @use-gesture/react@10.2.27 @react-spring/web@9.7.3
```

Opcional (para carousel avanzado en miniaturas):
```bash
pnpm add embla-carousel-react@8.0.0
```

### 👉 Con **npm**

```bash
npm install framer-motion@10.16.4 @use-gesture/react@10.2.27 @react-spring/web@9.7.3
```

Opcional (para carousel avanzado en miniaturas):
```bash
npm install embla-carousel-react@8.0.0
```

⚠️ *Importante:*

* Si tu proyecto ya tiene pnpm-lock.yaml, usá pnpm.

* Si tiene package-lock.json, usá npm.

* No usar ambos a la vez.

### 📂 Ubicación del componente

Guardar el archivo como:
```bash
/components/ProductGallery.tsx
```

### 🧩 Uso Básico

```bash
import ProductGallery from "@/components/ProductGallery";

export default function ProductPage() {
  return (
    <ProductGallery
      images={[
        { src: "/products/1.jpg", alt: "Vista frontal" },
        { src: "/products/2.jpg", alt: "Vista lateral" },
        { src: "/products/3.jpg", alt: "Detalle accesorio" },
      ]}
      layout="auto"
      zoom="auto"
      animation="fade"
      fullscreen={true}
      className="h-[600px] w-full"
    />
  );
}
```
### ⚙️ Props disponibles
| Prop         | Tipo                                     | Default  | Descripción                                                                  |
| ------------ | ---------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `images`     | `{ src: string; alt?: string }[]`        | —        | Lista de imágenes del producto.                                              |
| `layout`     | `"auto" \| "vertical" \| "horizontal"`   | `"auto"` | Orientación de miniaturas. Auto = vertical en desktop, horizontal en mobile. |
| `zoom`       | `"auto" \| "hover" \| "modal" \| "none"` | `"auto"` | Control del zoom. Auto = hover en desktop, fullscreen modal en mobile.       |
| `fullscreen` | `boolean`                                | `true`   | Habilita o deshabilita el modal fullscreen.                                  |
| `animation`  | `"fade" \| "slide" \| "none"`            | `"fade"` | Animación entre cambios de imagen.                                           |
| `className`  | `string`                                 | —        | Clases adicionales (ej: altura fija del contenedor).                         |
| `onChange`   | `(index: number) => void`                | —        | Callback al cambiar de imagen activa.                                        |

### 🖥️ Comportamiento en Desktop

* Miniaturas verticales con scroll.

* Imagen principal grande a la derecha.

* Hover zoom (ampliación).

* Animación fade o slide.

* Navegación con teclado ← →.

* Esc para cerrar modal.

### 📱 Comportamiento en Mobile

* Miniaturas horizontales abajo con scroll.

* Imagen principal arriba.

* Tap en imagen → abre modal fullscreen.

* Modal soporta:

  * Swipe izquierda/derecha → cambiar imagen.

  * Pinch zoom → acercar/alejar.

  * Esc o botón ✕ → cerrar.

* Indicador 3 / 8 siempre visible.

### ✨ Features principales

- ✅ Miniaturas con highlight de la activa.
- ✅ Imagen principal con fade/slide configurable.
- ✅ Placeholder con blur para carga progresiva.
- ✅ Modal fullscreen responsivo.
- ✅ Gestos intuitivos (swipe + pinch zoom).
- ✅ Accesibilidad: navegación con teclado y soporte screen readers.
- ✅ Rendimiento optimizado con next/image.

### Roadmap Futuro

* Publicación como librería interna en GitHub/npm.
* Integración con Storybook para documentar variantes.
* Soporte de video y 3D (GLTF) en la galería.
