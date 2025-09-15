"use client"

import { useEffect, useState } from "react"

export function ScrollWheel() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate rotation based on scroll position
  const rotation = (scrollY * 0.5) % 360

  return (
    <>
      {/* Animated motorcycle wheel that rotates with scroll */}
      <div className="scroll-wheel">
        <div className="wheel-container" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="wheel-spokes">
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
            <div className="wheel-spoke"></div>
          </div>
          <div className="wheel-center"></div>
        </div>
      </div>

      {/* Road effect */}
      <div className="road-effect"></div>
    </>
  )
}

export function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.5,
}: {
  src: string
  alt: string
  className?: string
  speed?: number
}) {
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div className={`parallax-bg ${className}`} style={{ transform: `translateY(${offsetY}px)` }}>
      <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}
