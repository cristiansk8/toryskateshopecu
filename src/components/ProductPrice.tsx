"use client";

import { formatPrice } from "@/utils/miles";
import { useEffect, useState } from "react";

interface ProductPriceProps {
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale: boolean;
  size?: "normal" | "large";
}

export function ProductPrice({
  price,
  regularPrice,
  salePrice,
  onSale,
  size = "normal"
}: ProductPriceProps) {
  const [displayPrice, setDisplayPrice] = useState<string>("");
  const [displayRegularPrice, setDisplayRegularPrice] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadPrices() {
      try {
        // Determinar qué precio mostrar
        const priceToShow = onSale && salePrice && salePrice !== "0" ? salePrice : price;

        // Formatear precio principal
        const formatted = await formatPrice(priceToShow);
        setDisplayPrice(formatted);

        // Si hay oferta, también formatear el precio regular
        if (onSale && salePrice && salePrice !== "0") {
          const regular = regularPrice || price;
          const formattedRegular = await formatPrice(regular);
          setDisplayRegularPrice(formattedRegular);
        }

        setLoaded(true);
      } catch (error) {
        console.error("Error cargando precios:", error);
        setLoaded(true);
      }
    }

    loadPrices();
  }, [price, regularPrice, salePrice, onSale]);

  if (!loaded) {
    return (
      <span className={size === "large" ? "text-3xl sm:text-4xl font-extrabold text-gray-400" : "text-base sm:text-lg font-bold text-gray-400"}>
        Loading...
      </span>
    );
  }

  if (onSale && salePrice && salePrice !== "0") {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
        <span className={size === "large" ? "text-3xl sm:text-4xl font-extrabold text-red-600" : "text-base sm:text-lg font-bold text-red-600"}>
          {displayPrice}
        </span>
        <span className={size === "large" ? "text-sm sm:text-base text-gray-500 line-through" : "text-xs sm:text-sm text-gray-500 line-through"}>
          {displayRegularPrice}
        </span>
      </div>
    );
  }

  return (
    <span className={size === "large" ? "text-3xl sm:text-4xl font-extrabold text-gray-900" : "text-base sm:text-lg font-bold text-gray-900"}>
      {displayPrice}
    </span>
  );
}
