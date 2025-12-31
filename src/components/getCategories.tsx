// src/app/(routes)/dashboard/user/profile/getCategories.tsx
export interface Category {
    id: number;
    name: string;
    slug: string;
  }
  
  export default async function getCategories(): Promise<Category[]> {
    // 1. Validación robusta de variables de entorno
    const baseUrl = process.env.urlAPI;
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
  
    if (!baseUrl || !consumerKey || !consumerSecret) {
      console.error('Missing required environment variables:');
      console.table({
        WOOCOMMERCE_URL: baseUrl,
        CONSUMER_KEY: !!consumerKey,
        CONSUMER_SECRET: !!consumerSecret
      });
      return [];
    }
  
    try {
      // 2. Construcción segura de la URL
      const apiUrl = `${baseUrl}/wp-json/wc/v3/products/categories`;
      const url = new URL(apiUrl);
      
      // 3. Parámetros de autenticación
      url.searchParams.append('consumer_key', consumerKey);
      url.searchParams.append('consumer_secret', consumerSecret);
      url.searchParams.append('per_page', '100');
      url.searchParams.append('hide_empty', 'true');
  
      // 4. Configuración de fetch con manejo de errores
      const response = await fetch(url.toString(), {
        cache: 'force-cache', // Similar a getStaticProps
        next: { tags: ['woocommerce-categories'] } // Para revalidación
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 5. Validación del tipo de respuesta
      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Expected array but received different data type');
      }
      
      // 6. Type guard para validar la estructura
      return data.filter((item): item is Category => {
        return (
          typeof item.id === 'number' &&
          typeof item.name === 'string' &&
          typeof item.slug === 'string'
        );
      });
      
    } catch (error) {
      console.error('Error fetching WooCommerce categories:', error);
      return [];
    }
    
  }