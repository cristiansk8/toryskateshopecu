"use client";

import { Product } from "@/app/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  console.log("Componente ProductGrid renderizado con", products.length, "productos.");

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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
