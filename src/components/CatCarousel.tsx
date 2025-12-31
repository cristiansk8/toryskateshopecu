"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Product } from "@/app/types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface VansCarouselProps {
  title?: string;
}

const VansCarousel: React.FC<VansCarouselProps> = ({ title = "Productos Vans" }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVansProducts = async () => {
      try {
        setLoading(true);
        
        // Usar la misma lógica que en WooCommerceTest para obtener productos de Vans
        const baseUrl = "https://toryskateshop.com/wp-json/wc/v3/products";
        const consumerKey = process.env.NEXT_PUBLIC_CONSUMER_KEY || "ck_1c90a1c8991b815180b8059868be4a58be58a6f2";
        const consumerSecret = process.env.NEXT_PUBLIC_CONSUMER_SECRET || "cs_24be99b3897309deeb197b76006f815fcfa17a01";
        
        // Filtrar por categoría Vans (ID: 20) y solo productos publicados
        const url = `${baseUrl}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&category=20&per_page=10&status=publish`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ Productos Vans obtenidos:", data);
        
        // Filtrar productos que tengan imágenes
        const productsWithImages = data.filter((product: Product) => 
          product.images && product.images.length > 0
        );
        
        setProducts(productsWithImages);
        setError(null);
      } catch (err) {
        console.error("❌ Error obteniendo productos Vans:", err);
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVansProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="text-white/80">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 bg-gradient-to-r from-gray-600 to-gray-700">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="text-red-300">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-8 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="text-white/80">No se encontraron productos Vans</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gradient-to-r from-red-600 to-orange-600 hover:brightness-110 transition duration-300">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          {title}
        </h2>
      </div>
      
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        speed={1000}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet vans-carousel-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active vans-carousel-bullet-active",
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="vans-carousel px-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Link href={`/productos/${product.slug}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mx-2">
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-gray-400 text-4xl">👟</div>
                    </div>
                  )}
                  
                  {/* Badge de Vans */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    VANS
                  </div>
                  
                  {/* Badge de oferta */}
                  {product.on_sale && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      OFERTA
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">              
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        product.stock_status === 'instock' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_status === 'instock' ? 'Disponible' : 'Agotado'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .vans-carousel .swiper-pagination {
          bottom: 10px;
        }
        .vans-carousel-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .vans-carousel-bullet-active {
          background: white !important;
        }
        .vans-carousel .swiper-button-next,
        .vans-carousel .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3) !important;
          border-radius: 50% !important;
          width: 40px !important;
          height: 40px !important;
        }
        .vans-carousel .swiper-button-next:after,
        .vans-carousel .swiper-button-prev:after {
          font-size: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default VansCarousel;
