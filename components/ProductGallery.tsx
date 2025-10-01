"use client";
/*
🚀 Instalación
Este componente funciona tanto con pnpm como con npm.
Usá el mismo package manager que ya tenga tu proyecto (⚠️ no mezclar).

👉 Con pnpm (recomendado si tu proyecto ya lo usa)
pnpm add framer-motion@10.16.4 @use-gesture/react@10.2.27 @react-spring/web@9.7.3

Opcional (para carousel avanzado en miniaturas):
pnpm add embla-carousel-react@8.0.0

👉 Con npm
npm install framer-motion@10.16.4 @use-gesture/react@10.2.27 @react-spring/web@9.7.3

Opcional (para carousel avanzado en miniaturas):
npm install embla-carousel-react@8.0.0

⚠️ Importante:
Si tu proyecto ya tiene pnpm-lock.yaml, usá pnpm.
Si tiene package-lock.json, usá npm.
No usar ambos a la vez.
*/

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useDrag, usePinch } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

type ProductGalleryProps = {
  images: { src: string; alt?: string }[];
  layout?: "auto" | "vertical" | "horizontal";
  animation?: "fade" | "slide" | "none";
  zoom?: "auto" | "hover" | "modal" | "none";
  fullscreen?: boolean;
  className?: string;
};

export default function ProductGallery({
  images,
  layout = "auto",
  animation = "fade",
  zoom = "auto",
  fullscreen = true,
  className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverZoom, setHoverZoom] = useState(false);

  // Animaciones para pinch/drag
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Swipe izquierda/derecha
  const bindDrag = useDrag(
    ({ offset: [dx], last, swipe: [swipeX] }) => {
      if (last) {
        if (swipeX === -1 && activeIndex < images.length - 1) {
          setActiveIndex((i) => i + 1);
        }
        if (swipeX === 1 && activeIndex > 0) {
          setActiveIndex((i) => i - 1);
        }
        api.start({ x: 0, y: 0 });
      } else {
        api.start({ x: dx, y: 0 });
      }
    },
    { filterTaps: true, axis: "x", swipe: { velocity: 0.3, distance: 50 } }
  );

  // Pinch zoom
  const bindPinch = usePinch(
    ({ offset: [d] }) => {
      api.start({ scale: 1 + d / 200 });
    },
    { scaleBounds: { min: 1, max: 3 } }
  );

  // Manejo de teclado en fullscreen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight" && activeIndex < images.length - 1) {
        setActiveIndex((i) => i + 1);
      }
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, activeIndex, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 text-gray-500 h-64 w-full rounded">
        No hay imágenes disponibles
      </div>
    );
  }

  const isVertical =
    layout === "vertical" ||
    (layout === "auto" && typeof window !== "undefined" && window.innerWidth > 768);

  const enableHoverZoom = zoom === "hover" || (zoom === "auto" && !isMobile());
  const enableModalZoom =
    fullscreen && (zoom === "modal" || (zoom === "auto" && isMobile()));

  return (
    <>
      {/* --- Galería normal --- */}
      <div
        className={clsx(
          "flex w-full gap-4",
          isVertical ? "flex-row" : "flex-col",
          className
        )}
      >
        {/* Miniaturas */}
        <div
          className={clsx(
            "flex gap-2 overflow-auto",
            isVertical ? "flex-col w-24" : "flex-row"
          )}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              title="Ver imagen"
              onClick={() => setActiveIndex(idx)}
              className={clsx(
                "relative rounded border-2 overflow-hidden flex-shrink-0 transition-all duration-200",
                activeIndex === idx
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-transparent hover:shadow-md hover:scale-105"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `Imagen ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIvPg=="
              />
            </button>
          ))}
        </div>

        {/* Imagen principal */}
        <div
          className="flex-1 relative flex items-center justify-center bg-gray-100 rounded overflow-hidden cursor-zoom-in"
          onClick={() => enableModalZoom && setIsFullscreen(true)}
          onMouseEnter={() => enableHoverZoom && setHoverZoom(true)}
          onMouseLeave={() => enableHoverZoom && setHoverZoom(false)}
        >
          {/* Indicador */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            {activeIndex + 1} / {images.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={
                animation === "fade"
                  ? { opacity: 0 }
                  : animation === "slide"
                  ? { x: 50, opacity: 0 }
                  : {}
              }
              animate={
                animation === "fade"
                  ? { opacity: 1 }
                  : animation === "slide"
                  ? { x: 0, opacity: 1 }
                  : {}
              }
              exit={
                animation === "fade"
                  ? { opacity: 0 }
                  : animation === "slide"
                  ? { x: -50, opacity: 0 }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <div
                className={clsx(
                  "relative overflow-hidden",
                  hoverZoom ? "scale-125 transition-transform duration-300" : ""
                )}
              >
                <Image
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt || "Imagen principal"}
                  width={800}
                  height={800}
                  className="object-contain max-h-[600px]"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIvPg=="
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Modal fullscreen --- */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
              {activeIndex + 1} / {images.length}
            </div>

            <animated.div
              {...bindDrag()}
              {...bindPinch()}
              style={{
                x,
                y,
                scale,
                touchAction: "none",
                cursor: "grab",
              }}
              className="flex items-center justify-center w-full h-full"
            >
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt || "Imagen fullscreen"}
                width={1000}
                height={1000}
                className="object-contain max-h-full max-w-full"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIvPg=="
              />
            </animated.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Detectar mobile
function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
}
