"use client";

import { useState, useEffect } from "react";
import { getVariations, ProductVariation } from "@/app/actions/product/get-variations.action";

interface ProductSizesProps {
  productId: string | number;
}

export default function ProductSizes({ productId }: ProductSizesProps) {
  const [variations, setVariations] = useState<ProductVariation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVariations() {
      try {
        setLoading(true);
        const result = await getVariations(productId);
        
        if ('message' in result) {
          setError(result.message);
          setVariations(null);
        } else {
          setVariations(result);
          setError(null);
        }
      } catch {
        setError("Error al cargar las tallas");
        setVariations(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVariations();
  }, [productId]);

  // Extract unique sizes from variations
  const sizes = variations
    ? Array.from(
        new Set(
          variations
            .filter(v => 
              v.attributes.some(attr => 
                attr.name.toLowerCase() === "talla" || 
                attr.name.toLowerCase() === "size"
              )
            )
            .map(v => {
              const sizeAttr = v.attributes.find(
                attr => attr.name.toLowerCase() === "talla" || attr.name.toLowerCase() === "size"
              );
              return sizeAttr ? sizeAttr.option : null;
            })
            .filter(Boolean) as string[]
        )
      ).sort()
    : [];

  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg sm:text-base font-semibold text-gray-900 mb-4">Selecciona tu talla</h3>
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-3 sm:gap-2">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className="h-14 sm:h-12 sm:min-w-12 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Cargando tallas disponibles...</p>
      </div>
    );
  }

  if (error || !variations || variations.length === 0 || sizes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg sm:text-base font-semibold text-gray-900 mb-4">Selecciona tu talla</h3>
      <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-3 sm:gap-2">
        {sizes.map(size => {
          // Find if this size is in stock
          const sizeVariation = variations.find(v => 
            v.attributes.some(attr => 
              (attr.name.toLowerCase() === "talla" || attr.name.toLowerCase() === "size") && 
              attr.option === size
            )
          );
          
          const isInStock = sizeVariation?.stock_status === 'instock';
          
          return (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={!isInStock}
              className={`
                h-14 sm:h-12 sm:min-w-12 px-3 rounded-lg border-2 font-medium text-base sm:text-sm transition-all touch-manipulation
                ${selectedSize === size 
                  ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-200' 
                  : isInStock
                    ? 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
      
      {selectedSize && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            ✓ Talla seleccionada: <span className="font-semibold">{selectedSize}</span>
          </p>
          {(() => {
            const selectedVariation = variations.find(v => 
              v.attributes.some(attr => 
                (attr.name.toLowerCase() === "talla" || attr.name.toLowerCase() === "size") && 
                attr.option === selectedSize
              )
            );
            
            if (selectedVariation) {
              return (
                <div className="text-xs text-blue-700">
                  {selectedVariation.stock_quantity && (
                    <p>Stock disponible: {selectedVariation.stock_quantity} unidades</p>
                  )}
                  {selectedVariation.price && selectedVariation.price !== "0" && (
                    <p className="font-medium">Precio: ${selectedVariation.price}</p>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}