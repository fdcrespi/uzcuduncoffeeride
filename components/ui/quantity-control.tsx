"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityControlProps {
  quantity: number;
  onUpdate: (newQuantity: number) => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onUpdate }) => {
  return (
    <div className="flex items-center gap-1 mt-2">
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onUpdate(quantity - 1)}
      >
        -
      </Button>
      <Input
        type="number"
        className="h-8 w-12 text-center"
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value, 10);
          if (!isNaN(newQuantity) && newQuantity >= 0) {
            onUpdate(newQuantity);
          }
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onUpdate(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
};