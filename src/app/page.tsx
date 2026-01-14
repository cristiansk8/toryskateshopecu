import { Metadata } from "next";
import { Product } from "@/app/types";
import api from "@/lib/woocommerce";
import Link from "next/link";
import Image from "next/image";
import { getAjustedPrice } from '@/utils/price';
import { formatPrice } from "@/utils/miles";

export const metadata: Metadata = {
  title: 'Inicio | Shop - Viste Premium en Ecuador',
  description: 'Descubre nuestra colección exclusiva de sneakers para hombre y mujer. Envíos a todo Ecuador.',
  alternates: {
    canonical: '',
  },
  keywords: ['sneakers exclusivos', 'zapatillas premium Ecuador', 'calzado deportivo de lujo'],
};

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

type PageProps = {
  searchParams: Promise<{ categoria?: string; buscar?: string; }>;
};

async function getProducts(categoryId?: string, searchTerm?: string): Promise<Product[]> {
  try {
    const params: Record<string, string> = {
      per_page: "100",
      status: "publish",
    };
    if (categoryId) params.category = categoryId;
    if (searchTerm) params.search = searchTerm;

    console.log('🔍 Obteniendo productos con parámetros:', params);
    const response = await api.get<Product[]>("products", params);
    console.log(`✅ Productos obtenidos: ${response.data?.length || 0}`);

    // Mostrar el JSON completo del primer producto para debugging
    if (response.data && response.data.length > 0) {
      console.log('📦 PRODUCTO COMPLETO (primero):', JSON.stringify(response.data[0], null, 2));
    }

    return response.data || [];
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>("products/categories", {
      per_page: 100,
      hide_empty: true
    });
    return response.data || [];
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return [];
  }
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.categoria;
  const searchTerm = params.buscar;

  const products = await getProducts(categoryId, searchTerm);
  const categories = await getCategories();

  const currentCategory = categoryId
    ? categories.find(cat => cat.id.toString() === categoryId || cat.slug === categoryId)
    : null;

  return (
    <div className="pt-20 sm:pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {currentCategory ? currentCategory.name : 'Nuestros Productos'}
            {searchTerm && (
              <span className="block text-lg sm:text-xl font-normal text-gray-600 mt-2">
                Resultados para: &quot;{searchTerm}&quot;
              </span>
            )}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {currentCategory
              ? `Explora nuestra colección de ${currentCategory.name.toLowerCase()}`
              : searchTerm
                ? `Encontramos ${products.length} producto${products.length !== 1 ? 's' : ''} para tu búsqueda`
                : 'Descubre nuestra colección completa'
            }
          </p>
        </div>

        {/* Simple search and filter */}
        <div className="mb-8">
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="buscar"
                placeholder="Buscar productos..."
                defaultValue={searchTerm}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input type="hidden" name="categoria" value={categoryId || ""} />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
              {(searchTerm || categoryId) && (
                <Link
                  href="/"
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Limpiar
                </Link>
              )}
            </div>
          </form>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-sm transition-colors ${!categoryId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Todas
            </Link>
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/?categoria=${category.id}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${categoryId === category.id.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product: Product) => (
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
                    {product.on_sale && product.sale_price !== product.regular_price ? (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <span className="text-base sm:text-lg font-bold text-red-600">
                          ${formatPrice( getAjustedPrice())}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ${formatPrice( getAjustedPrice())}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ${formatPrice( getAjustedPrice())}
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
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm
                ? `No se encontraron productos para &quot;${searchTerm}&quot;`
                : currentCategory
                  ? `No hay productos disponibles en ${currentCategory.name}`
                  : 'No hay productos disponibles'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda o explora nuestras categorías.'
                : currentCategory
                  ? 'Intenta con otra categoría o vuelve más tarde.'
                  : 'Vuelve más tarde para ver nuestros productos.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || currentCategory) && (
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver todos los productos
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
