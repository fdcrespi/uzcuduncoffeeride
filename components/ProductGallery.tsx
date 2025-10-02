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

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useDrag, usePinch } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X } from "lucide-react";

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

  // ---------- ORIENTACIÓN ----------
  const [isVertical, setIsVertical] = useState(false);
  useEffect(() => {
    const decide = () => {
      if (layout === "vertical") return setIsVertical(true);
      if (layout === "horizontal") return setIsVertical(false);
      setIsVertical(window.matchMedia("(min-width: 768px)").matches);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [layout]);

  // ---------- SCROLL THUMBS + FLECHAS ----------
  const thumbRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = thumbRef.current;
    if (!el) return;
    if (isVertical) {
      setCanPrev(el.scrollTop > 0);
      setCanNext(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    } else {
      setCanPrev(el.scrollLeft > 0);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };
  useEffect(() => {
    updateArrows();
    const el = thumbRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll);
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVertical, images.length]);

  const scrollBy = (dir: "prev" | "next") => {
    const el = thumbRef.current;
    if (!el) return;
    const step = (isVertical ? el.clientHeight : el.clientWidth) * 0.9;
    if (isVertical) el.scrollBy({ top: dir === "prev" ? -step : step, behavior: "smooth" });
    else el.scrollBy({ left: dir === "prev" ? -step : step, behavior: "smooth" });
  };

  // Ocultar scrollbars y evitar overflow global del body
  // eslint-disable-next-line @next/next/no-css-tags
  const HiddenScrollbar = (
    <style jsx global>{`
      .thumb-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .thumb-scroll::-webkit-scrollbar {
        display: none;
      }
      .no-page-overflow {
        overflow-x: hidden;
      }
    `}</style>
  );

  // ---------- ZOOM ----------
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  }, []);

  const enableModalZoom = fullscreen && (zoom === "modal" || (zoom === "auto" && isMobile));
  const enableHoverZoom = zoom === "hover" || (zoom === "auto" && !isMobile);

  const onMainClick = () => {
    if (fullscreen) {
      setIsFullscreen(true); // abrir siempre modal si está permitido
    } else if (enableHoverZoom) {
      setHoverZoom((z) => !z);
    }
  };

  // ---------- FULLSCREEN: drag + pinch ----------
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  const dragBind = useDrag(
    ({ down, movement: [mx, my], swipe: [sx] }) => {
      if (!down && sx) {
        setActiveIndex((i) => (sx === -1 ? Math.min(i + 1, images.length - 1) : Math.max(i - 1, 0)));
        api.start({ x: 0, y: 0 });
        return;
      }
      api.start({ x: down ? mx : 0, y: down ? my : 0 });
    },
    { filterTaps: true }
  );

  const pinchBind = usePinch(
    ({ offset: [d], last }) => {
      const next = clamp(1 + d / 200, 1, 3);
      api.start({ scale: next });
      if (last && next === 1) api.start({ x: 0, y: 0 });
    },
    { scaleBounds: { min: 1, max: 3 }, rubberband: true }
  );

  // teclado en fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded bg-gray-100 text-gray-500">
        No hay imágenes disponibles
      </div>
    );
  }

  return (
    <>
      {HiddenScrollbar}

      <div className={clsx(className)}>        {/* En desktop: [thumbs | main] ; en mobile: [main] + [thumbs abajo] */}
        <div className={clsx("flex w-full gap-4", isVertical ? "md:flex-row flex-col" : "flex-col")}>
          {/* MAIN IMAGE */}
          <div
            className={clsx(
              // 👇 mobile: ahora ocupa el ancho del contenedor padre
              "order-1 relative w-full max-w-full min-w-0 overflow-hidden rounded-xl border bg-white",
              // relación: más alta en mobile, 1:1 en sm, 4:3 en md+
              "aspect-[4/5] sm:aspect-square md:mx-0 md:max-w-none md:aspect-[4/3]"
            )}
            onClick={onMainClick}
            onMouseEnter={() => enableHoverZoom && setHoverZoom(true)}
            onMouseLeave={() => enableHoverZoom && setHoverZoom(false)}
            style={{
              cursor: enableModalZoom ? "zoom-in" : enableHoverZoom ? (hoverZoom ? "zoom-out" : "zoom-in") : "default",
            }}
          >
            {/* Indicador */}
            <div className="absolute right-2 top-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={
                  animation === "fade"
                    ? { opacity: 0 }
                    : animation === "slide"
                    ? { x: 40, opacity: 0 }
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
                    ? { x: -40, opacity: 0 }
                    : {}
                }
                transition={{ duration: 0.25 }}
                className="relative h-full w-full"
              >
                {/* padding interno para que no se “pegue” en mobile */}
                <div
                  className={clsx(
                    "relative h-full w-full p-2 sm:p-3 transition-transform duration-200",
                    hoverZoom && enableHoverZoom ? "scale-[1.08]" : "scale-100"
                  )}
                >
                  <Image
                    src={images[activeIndex].src}
                    alt={images[activeIndex].alt || "Imagen principal"}
                    fill
                    sizes="(max-width: 768px) calc(100vw - 32px), 600px"
                    className="object-contain"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIvPg=="
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* THUMBS */}
          <div
            className={clsx(
              // en desktop a la izquierda; en mobile debajo
              isVertical ? "order-0 md:order-none md:w-24" : "order-2 w-full"
            )}
          >
            {/* Flechas (solo desktop) */}
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollBy("prev")}
              disabled={!canPrev}
              className={clsx(
                "hidden md:block absolute z-10 rounded-full bg-black/30 p-1 text-white backdrop-blur transition-opacity",
                isVertical ? "left-1/2 top-1 -translate-x-1/2" : "left-1 top-1/2 -translate-y-1/2",
                canPrev ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              {isVertical ? <ChevronUp size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div
              ref={thumbRef}
              className={clsx(
                "thumb-scroll rounded-md",
                isVertical
                  ? "hidden h-[500px] w-24 overflow-y-auto p-2 md:block"
                  : "mt-3 flex w-full max-w-full justify-start overflow-x-auto overscroll-x-contain"
              )}
            >
              <div className={clsx(isVertical ? "flex flex-col items-center gap-2" : "flex items-center gap-2")}>
                {images.map((img, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={clsx(
                        "relative block h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white",
                        "outline-none focus-visible:outline-none focus-visible:ring-0", // sin foco azul
                        isActive ? "ring-2 ring-neutral-300" : "ring-0 hover:ring-1 hover:ring-neutral-200"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt || `Imagen ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollBy("next")}
              disabled={!canNext}
              className={clsx(
                "hidden md:block absolute z-10 rounded-full bg-black/30 p-1 text-white backdrop-blur transition-opacity",
                isVertical ? "bottom-1 left-1/2 -translate-x-1/2" : "right-1 top-1/2 -translate-y-1/2",
                canNext ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              {isVertical ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN (mejor encuadre mobile) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visor de imágenes a pantalla completa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => {
                setIsFullscreen(false);
                api.start({ x: 0, y: 0, scale: 1 });
              }}
              aria-label="Cerrar visor"
            >
              <X size={20} />
            </button>

            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded bg-white/10 px-3 py-1 text-xs text-white">
              {activeIndex + 1} / {images.length}
            </div>

            {/* botones bien dentro del viewport en mobile */}
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              disabled={activeIndex === 0}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => setActiveIndex((i) => Math.min(i + 1, images.length - 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              disabled={activeIndex === images.length - 1}
            >
              <ChevronRight />
            </button>

            <animated.div
              {...dragBind()}
              {...pinchBind()}
              style={{ x, y, scale, touchAction: "none", cursor: "grab" }}
              className="flex max-h-[92vh] max-w-[92vw] items-center justify-center"
            >
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt || "Imagen fullscreen"}
                width={1600}
                height={1600}
                className="max-h-[92vh] max-w-[92vw] object-contain"
                draggable={false}
                priority
              />
            </animated.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}


