"use client";

import { Product } from "@/app/types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  console.log("Componente ProductGrid renderizado con", products.length, "productos.");

  // CORRECCIÓN: Asegúrate de que el número no tenga espacios, guiones ni el símbolo '+'.
  // Ejemplo para Argentina: 5491112345678
  const WHATSAPP_NUMBER = "5491112345678"; // Reemplaza con tu número de WhatsApp en el formato correcto.

  const handleWhatsAppClick = (e: React.MouseEvent, productName: string) => {
    // PASO 1: Loguear todo ANTES de intentar abrir la ventana.
    console.log("--- DEBUG WHATSAPP ---");
    console.log("Botón de WhatsApp clickeado para el producto:", productName);
    console.log("Número de WhatsApp a utilizar:", WHATSAPP_NUMBER);
    
    e.preventDefault(); // Evita la navegación del <Link> padre.
    e.stopPropagation(); // Detiene la propagación del evento para mayor seguridad.

    // PASO 2: Intentar abrir la ventana.
    try {
      const message = `Hola, estoy interesado en el producto: ${productName}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (error) {
      console.error("Error al intentar abrir WhatsApp:", error);
    }
  };

  const handleImageError = (productId: string | number) => {
    const id = productId.toString();
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600">Intenta cambiar los filtros o buscar algo diferente.</p>
      </div>
    );
  }

  console.log("Renderizando la cuadrícula de productos...");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productId = product.id.toString();
        
        return (
          <div key={productId} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
            <Link href={`/productos/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 && !imageErrors[productId] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 text-4xl">👟</div>
                  </div>
                )}
                
                {/* Badge de oferta */}
                {product.on_sale && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    OFERTA
                  </div>
                )}
                
                {/* Badge de stock agotado */}
                {product.stock_status === 'outofstock' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AGOTADO</span>
                  </div>
                )}
              </div>
            </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col">
                    {product.on_sale && product.sale_price && product.regular_price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          ${product.sale_price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.regular_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price || product.regular_price || 'Consultar'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between">
                    {product.categories && product.categories.length > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.categories[0].name}
                      </span>
                    )}
                    <button 
                      onClick={(e) => handleWhatsAppClick(e, product.name)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Consultar por WhatsApp"
                      title="Consultar por WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.89 7.89 0 0 0 13.6 2.326zM7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.626-2.957 6.584-6.591 6.584m-1.559-4.436c-.225-.114-1.327-.655-1.533-.73-.205-.075-.354-.114-.504.114-.15.227-.58.73-.711.879-.13.15-.259.17-.485.057-.225-.114-.943-.349-1.796-1.113C4.223 9.02 3.79 8.225 3.649 7.97c-.14-.255-.008-.399.1-.52.108-.12.24-.3.36-.448.12-.15.16-.255.24-.427.08-.17.04-.318-.02-.438-.06-.12-.504-1.217-.692-1.666-.18-.433-.36-.373-.5-.38-.13-.008-.28-.008-.428-.008-.15 0-.39.057-.59.287-.2.227-.76.73-.76 1.792 0 1.063.777 2.082.884 2.23.108.148 1.555 2.51 3.783 3.37.53.225.94.36 1.25.465.5.17 1 .144 1.37.087.42-.06 1.327-.54 1.514-1.051.188-.51.188-.943.13-1.051-.057-.108-.207-.17-.433-.284z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
          </div>
        );
      })}
    </div>
  );
}
