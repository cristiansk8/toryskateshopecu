"use client";

import { Product } from "@/app/types";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/miles";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [salePriceDisplay, setSalePriceDisplay] = useState<string>("$0.00");
  const [regularPriceDisplay, setRegularPriceDisplay] = useState<string>("$0.00");
  const [priceLoaded, setPriceLoaded] = useState(false);

  useEffect(() => {
    async function loadPrices() {
      try {
        // Cargar precio de oferta si existe
        if (product.on_sale && product.sale_price && product.sale_price !== "0") {
          const formattedSale = await formatPrice(product.sale_price);
          setSalePriceDisplay(formattedSale);
        }

        // Cargar precio regular
        const regularPrice = product.regular_price || product.price;
        const formattedRegular = await formatPrice(regularPrice);
        setRegularPriceDisplay(formattedRegular);

        setPriceLoaded(true);
      } catch (error) {
        console.error("Error formateando precios:", error);
        setPriceLoaded(true);
      }
    }

    loadPrices();
  }, [product]);

  return (
    <Link
      key={product.id}
      href={`/productos/${product.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-t-lg">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].src}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            OFERTA
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            {!priceLoaded ? (
              <span className="text-base sm:text-lg font-bold text-gray-400">
                Loading...
              </span>
            ) : product.on_sale && product.sale_price && product.sale_price !== "0" ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-base sm:text-lg font-bold text-red-600">
                  {salePriceDisplay}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {regularPriceDisplay}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-bold text-gray-900">
                {regularPriceDisplay}
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${product.stock_status === 'instock'
            ? 'text-green-700 bg-green-100'
            : 'text-red-700 bg-red-100'
            }`}>
            {product.stock_status === 'instock' ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </Link>
  );
}
