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

Si tu proyecto ya tiene pnpm-lock.yaml, usá pnpm.

Si tiene package-lock.json, usá npm.

No usar ambos a la vez.
