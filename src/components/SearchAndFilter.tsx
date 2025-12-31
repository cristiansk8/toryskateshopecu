"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface SearchAndFilterProps {
  categories: Category[];
  currentCategory?: Category | null;
  initialSearch?: string;
}

export default function SearchAndFilter({ 
  categories, 
  currentCategory, 
  initialSearch = "" 
}: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Update search term when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('buscar') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    // Keep category if exists
    const categoria = searchParams.get('categoria');
    if (categoria) {
      params.set('categoria', categoria);
    }
    
    // Add search term if exists
    if (searchTerm.trim()) {
      params.set('buscar', searchTerm.trim());
    }
    
    const query = params.toString();
    router.push(`/productos${query ? '?' + query : ''}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams();
    
    // Keep category if exists
    const categoria = searchParams.get('categoria');
    if (categoria) {
      params.set('categoria', categoria);
    }
    
    const query = params.toString();
    router.push(`/productos${query ? '?' + query : ''}`);
  };

  const categoryId = searchParams.get('categoria');

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Link
          href="/productos"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categoryId && !searchTerm
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          Todas las categorías
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/productos?categoria=${category.id}${searchTerm ? '&buscar=' + encodeURIComponent(searchTerm) : ''}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoryId === category.id.toString() 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>

      {/* Active Filters Display */}
      {(currentCategory || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {currentCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Categoría: {currentCategory.name}
              <Link
                href={`/productos${searchTerm ? '?buscar=' + encodeURIComponent(searchTerm) : ''}`}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </Link>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
               Búsqueda: &quot;{searchTerm}&quot;
              <button
                onClick={clearSearch}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
