"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSidebar() {
  const { getTotalItems, lastItemAddedTimestamp } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const totalItems = getTotalItems();

  useEffect(() => {
    if (lastItemAddedTimestamp === null) return;
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 820); // Match animation duration
    return () => clearTimeout(timer);
  }, [lastItemAddedTimestamp]);

  return (
    <Link href="/checkout" passHref>
      <Button
        variant="ghost"
        size="icon"
        className={`relative ${isAnimating ? "cart-shake" : ""}`}
        aria-label={`Carrito de compras con ${totalItems} artículos`}
      >
        <ShoppingCart
          className={`w-5 h-5 ${
            totalItems === 0 ? "text-muted-foreground" : ""
          }`}
        />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
}