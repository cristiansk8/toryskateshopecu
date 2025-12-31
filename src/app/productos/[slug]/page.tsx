"use client";

import { getProductBySlug } from '@/app/actions/product/get-product.action';
import Image from 'next/image';
import { getAjustedPrice } from '@/utils/price';
import { formatPrice } from '@/utils/miles';
import { useEffect, useState } from 'react';
import { Product } from '@/app/types';
import Link from 'next/link';
import api from '@/lib/woocommerce';


// Prop types para Next.js 15
interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage(props: Props) {
  const [slug, setSlug] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [userPhone, setUserPhone] = useState<string>('3022484816'); // número por defecto
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    const initPage = async () => {
      try {
        // Obtener el slug
        const params = await props.params;
        setSlug(params.slug);

        // Obtener el producto
        const productData = await getProductBySlug(params.slug);
        setProduct(productData);

        // Obtener productos relacionados si el producto tiene categorías
        if (productData && productData.categories && productData.categories.length > 0) {
          try {
            const categoryId = productData.categories[0].id;
            const response = await api.get<Product[]>("products", {
              category: categoryId.toString(),
              per_page: "4",
              exclude: [productData.id],
              status: "publish"
            });
            setRelatedProducts(response.data || []);
          } catch (error) {
            console.error("Error obteniendo productos relacionados:", error);
          }
        }

        // Normalizar el email a minúsculas antes de enviarlo a la API.
        const userEmail = process.env.NEXT_PUBLIC_userEmail || '';
        console.log("--- INICIO DEBUG ---");
        console.log("Email desde variable de entorno (NEXT_PUBLIC_userEmail):", userEmail);

        // Obtener el número de teléfono del usuario
        const res = await fetch(`https://vendetiyo.vercel.app/api/user?email=${userEmail.toLowerCase()}`);
        console.log("URL de la API que se está llamando:", res.url);
        console.log("Respuesta de la API de usuario:", res); // DEBUG: ¿Fue exitosa la petición? (status 200)

        const data = await res.json();
        console.log("Datos recibidos de la API de usuario:", data); // DEBUG: ¿Qué contiene la respuesta JSON?

        if (data.user?.phone) {
          console.log("Número de teléfono encontrado en la API:", data.user.phone); // DEBUG: Muestra el número original
          // SOLUCIÓN: Eliminar todos los espacios del número de teléfono.
          let finalPhone = data.user.phone.replace(/\s/g, '');
          // Asegurarse de que el número tenga el código de país de Colombia (57)
          if (!finalPhone.startsWith('57')) {
            finalPhone = '57' + finalPhone;
          }
          console.log("Número de WhatsApp final:", finalPhone); // Para depuración
          setUserPhone(finalPhone);
        } else {
          console.warn("La API no devolvió un número de teléfono para el usuario. Se usará el número por defecto."); // DEBUG: Aviso si no se encuentra el teléfono
        }
        console.log("--- FIN DEBUG ---");
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [props.params]);

  // Mostrar loading mientras se carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }
  // Si hay error o no se encontró el producto
  if (!product || 'message' in product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-5xl">😞</div>
          <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
          <p className="mb-6 text-gray-600">
            Lo sentimos, el producto que buscas no existe o ya no está disponible.
          </p>
          <a
            href={`https://wa.me/${userPhone}?text=${encodeURIComponent(`Hola, busco el producto: ${slug.replace(/-/g, " ")} ¿Tienen disponibilidad?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full mb-3 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Comprar o consultar
          </a>
          <div className="flex flex-col gap-2">
            <Link
              href="/productos"
              className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los productos
            </Link>
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- FUNCIÓN DE FORMATO DE PRECIO MEJORADA ---
  // Esta función asegura que se usen puntos para los miles y 2 decimales.
  const formatPriceWithDots = (price: number | string | undefined | null): string => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return '0.00';
    // 'en-US' usa puntos como separador decimal y comas para miles.
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  // --- LÓGICA DE PRECIO CENTRALIZADA ---
  // Calcular el precio final ajustado (precio fijo)
  const finalPrice = getAjustedPrice();

  return (
    <div className="pt-20 sm:pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Volver a productos</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-square">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-gray-400 text-6xl">👟</div>
                </div>
              )}

              {/* Badge de oferta */}
              {product.on_sale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
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

            {/* Thumbnails - if there are more images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 p-4">
                {product.images.slice(0, 5).map((image: { src: string; alt?: string }, index: number) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} - imagen ${index + 1}`}
                      fill
                      className="object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                {product.categories.map((category: { id: number; name: string }) => (
                  <Link
                    key={category.id}
                    href={`/tienda?categoria=${category.id}`}
                    className="inline-block mr-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.on_sale && product.sale_price !== product.regular_price ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-red-600">
                    <span className="text-green-600">$</span>{formatPriceWithDots(finalPrice)}
                  </span>
                  <span className="text-sm sm:text-base text-gray-500 line-through">
                    <span className="text-gray-500">$</span>{formatPriceWithDots(getAjustedPrice())}
                  </span>
                </div>
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  <span className="text-green-600">$</span>{formatPriceWithDots(finalPrice)}
                </span>
              )}
            </div>


            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_status === 'instock' ? (
                <span className="inline-flex items-center text-green-600 font-medium">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Disponible
                </span>
              ) : product.stock_status === 'outofstock' ? (
                <span className="inline-flex items-center text-red-600 font-medium">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Agotado
                </span>
              ) : (
                <span className="inline-flex items-center text-yellow-600 font-medium">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Bajo pedido
                </span>
              )}

              {product.stock_quantity && (
                <span className="ml-2 text-sm text-gray-500">
                  ({product.stock_quantity} en stock)
                </span>
              )}
            </div>

            {/* Tallas disponibles */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mb-6">
                {product.attributes.map((attribute) => (
                  <div key={attribute.id} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1)}
                      {selectedSize && <span className="ml-2 text-blue-600">• {selectedSize}</span>}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {attribute.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(option)}
                          className={`px-3 py-2 text-sm text-center border rounded-lg transition-all ${
                            selectedSize === option
                              ? 'border-blue-600 bg-blue-600 text-white font-medium'
                              : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 text-gray-900'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp Button */}
            <button
              onClick={() => {
                console.log("--- DEBUG BOTÓN WHATSAPP ---");
                console.log("Valor de 'userPhone' al hacer clic:", userPhone);
                console.log("Talla seleccionada:", selectedSize);

                // --- CÁLCULO DEL PRECIO FINAL JUSTO AL HACER CLIC ---
                const precioFinalParaMensaje = getAjustedPrice();
                const precioFormateadoParaMensaje = formatPriceWithDots(precioFinalParaMensaje);
                console.log("Valor del precio (ajustado y formateado) que se pasa a la URL de WhatsApp:", `$${precioFormateadoParaMensaje}`);
                // ----------------------------------------------------

                let message = `Hola! Me interesa el producto: ${product.name} - $${precioFormateadoParaMensaje}`;
                if (selectedSize) {
                  message += `\nTalla: ${selectedSize}`;
                }

                try {
                  window.open(`https://wa.me/${userPhone}?text=${encodeURIComponent(message)}`, '_blank');
                } catch (error) {
                  console.error("Error al intentar abrir WhatsApp:", error);
                }
                console.log("-----------------------------");
              }}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-4 px-4 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-3 text-base sm:text-lg touch-manipulation"
              aria-label="Consultar por WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Comprar o consultar
            </button>
            {/* Description */}
            {(product.description || product.short_description) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Descripción</h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: product.description || product.short_description || ''
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/productos/${relatedProduct.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-t-lg">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <Image
                        src={relatedProduct.images[0].src}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    {relatedProduct.on_sale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        OFERTA
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 text-sm line-clamp-2 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${formatPrice(getAjustedPrice())}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        relatedProduct.stock_status === 'instock'
                          ? 'text-green-700 bg-green-100'
                          : 'text-red-700 bg-red-100'
                      }`}>
                        {relatedProduct.stock_status === 'instock' ? 'Disponible' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}