"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/app/types";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  type: 'youtube';
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  logo?: string;
  primaryColor?: string;
  colorText?: string;
  phone?: string;
}

// Videos específicos de Thrasher Magazine (movido fuera del componente)
const youtubeVideos: YouTubeVideo[] = [
  {
    id: 't7_98X1NjNw',
    title: 'Thrasher Magazine Video 1',
    thumbnail: 'https://img.youtube.com/vi/t7_98X1NjNw/maxresdefault.jpg',
    publishedAt: new Date().toISOString(),
    url: 'https://www.youtube.com/watch?v=t7_98X1NjNw',
    type: 'youtube',
  },
  {
    id: 'Yg5WjRqMOlU',
    title: 'Thrasher Magazine Video 2',
    thumbnail: 'https://img.youtube.com/vi/Yg5WjRqMOlU/maxresdefault.jpg',
    publishedAt: new Date().toISOString(),
    url: 'https://www.youtube.com/watch?v=Yg5WjRqMOlU',
    type: 'youtube',
  },
  {
    id: 'GqgnRNaV6xk',
    title: 'Thrasher Magazine Video 3',
    thumbnail: 'https://img.youtube.com/vi/GqgnRNaV6xk/maxresdefault.jpg',
    publishedAt: new Date().toISOString(),
    url: 'https://www.youtube.com/watch?v=GqgnRNaV6xk',
    type: 'youtube',
  },
];

export default function HeroCarousel() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [vansProducts, setVansProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const swiperRef = useRef<{ slideToLoop: (index: number) => void } | null>(null);

  useEffect(() => {
    // Solo usar videos de YouTube
    setVideos(youtubeVideos);
    setLoading(false);
  }, []);

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://vendetiyo.vercel.app/api/user?email=${process.env.NEXT_PUBLIC_userEmail}`);
        const data = await res.json();
        if (data.user) {
          setSocialLinks({
            facebook: data.user.facebook,
            instagram: data.user.instagram,
            logo: data.user.photo,
            primaryColor: data.user.primaryColor || "#000",
            colorText: data.user.colorText || "#fff",
            phone: data.user.phone
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Cargar productos Vans
  useEffect(() => {
    const fetchVansProducts = async () => {
      try {
        setProductsLoading(true);
        
        const baseUrl = "https://toryskateshop.com/wp-json/wc/v3/products";
        const consumerKey = process.env.NEXT_PUBLIC_CONSUMER_KEY || "ck_1c90a1c8991b815180b8059868be4a58be58a6f2";
        const consumerSecret = process.env.NEXT_PUBLIC_CONSUMER_SECRET || "cs_24be99b3897309deeb197b76006f815fcfa17a01";
        
        const url = `${baseUrl}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&category=20&per_page=6&status=publish`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filtrar productos que tengan imágenes
        const productsWithImages = data.filter((product: Product) => 
          product.images && product.images.length > 0
        );
        
        setVansProducts(productsWithImages);
      } catch (err) {
        console.error("❌ Error obteniendo productos Vans:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchVansProducts();
  }, []);

  // Función para avanzar al siguiente video
  const handleVideoEnd = useCallback(() => {
    if (swiperRef.current) {
      const nextIndex = (currentVideoIndex + 1) % youtubeVideos.length;
      setCurrentVideoIndex(nextIndex);
      swiperRef.current.slideToLoop(nextIndex);
    }
  }, [currentVideoIndex]);

  // Escuchar eventos de YouTube API
  useEffect(() => {
    // Función para manejar mensajes del iframe de YouTube
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        // Cuando el video termine (state === 0)
        if (data.event === 'video-state-change' && data.info === 0) {
          setTimeout(() => {
            handleVideoEnd();
          }, 1000); // Pequeña pausa antes de cambiar
        }
      } catch {
        // Ignorar errores de parsing
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleVideoEnd]);

  // Mostrar loading mientras se cargan los videos
  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row">
      {/* Contenedor del carousel - 100% en móvil, 75% en desktop */}
      <div className="w-full md:w-3/4 h-2/3 md:h-full">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="h-full"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentVideoIndex(swiper.realIndex);
          }}
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video.id}>
              <div className="relative w-full h-full">
                {/* Video embebido de YouTube con controles habilitados */}
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=${index === currentVideoIndex ? 1 : 0}&mute=1&loop=0&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 'none' }}
                  title={video.title}
                />
                
                {/* Overlay con información del video (opcional) */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm max-w-xs">
                  <p className="font-semibold truncate">{video.title}</p>
                  <p className="text-xs text-gray-300">Thrasher Magazine</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Contenedor del banner - Logo y carrusel de Vans */}
      <div className="w-full md:w-1/4 h-1/3 md:h-full bg-black/90 flex flex-col p-4 md:p-6">
        {/* Logo */}
        <div className="w-full flex justify-center mb-4 md:mb-6">
          <Link href="/" className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-lg border border-white/20">
              <Image
                src={socialLinks.logo || "/logo.jpg"}
                alt="Tienda"
                width={120}
                height={40}
                className="h-8 md:h-12 w-auto"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Título del carrusel */}
        <div className="text-center mb-3 md:mb-4">
          <h3 className="text-white text-sm md:text-lg font-bold">
            🔥 Productos Vans
          </h3>
          <p className="text-white/70 text-xs md:text-sm">
            Lo último en skate
          </p>
        </div>

        {/* Carrusel de productos Vans */}
        <div className="flex-1 overflow-hidden">
          {productsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : vansProducts.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: "!bg-white/50 !w-2 !h-2",
                bulletActiveClass: "!bg-white",
              }}
              className="h-full vans-sidebar-carousel"
            >
              {vansProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <Link href={`/productos/${product.slug}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/20 h-full flex flex-col">
                      {/* Imagen del producto */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100/20">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200/20">
                            <div className="text-gray-400 text-2xl">👟</div>
                          </div>
                        )}
                        
                        {/* Badge de Vans */}
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          VANS
                        </div>
                        
                        {/* Badge de oferta */}
                        {product.on_sale && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-1 py-1 rounded text-xs font-bold">
                            OFERTA
                          </div>
                        )}
                      </div>
                      
                      {/* Info del producto */}
                      <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
                        <h4 className="font-semibold text-white text-xs md:text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        
                        <div className="flex flex-col space-y-1">
                          
                          <div className={`text-xs px-2 py-1 rounded text-center ${
                            product.stock_status === 'instock' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {product.stock_status === 'instock' ? 'Disponible' : 'Agotado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-4xl mb-2">👟</div>
                <p className="text-white/70 text-xs">
                  No hay productos Vans disponibles
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Link para ver más */}
        <div className="mt-3 md:mt-4">
          <Link
            href="/tienda?categoria=20"
            className="w-full block px-3 md:px-4 py-2 md:py-3 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg border border-red-500/20 hover:bg-red-600 hover:scale-105 transition-all duration-300 font-bold text-center text-white text-xs md:text-sm"
          >
            Ver todos los Vans →
          </Link>
        </div>
      </div>
    </div>
  );
}