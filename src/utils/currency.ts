/**
 * Servicio para manejar la conversión de moneda de COP a USD
 */

interface TRMResponse {
  rate: number;
  cached?: boolean;
  timestamp?: number;
  error?: boolean;
  fallback?: boolean;
}

// Cache en memoria para la TRM
let trmCache: number | null = null;
let trmTimestamp: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

/**
 * Obtiene la TRM (Tasa Representativa del Mercado) actual
 * Usa cache para evitar múltiples requests a la API
 */
export async function getTRM(): Promise<number> {
  const now = Date.now();

  // Verificar si tenemos un cache válido
  if (trmCache && trmTimestamp && (now - trmTimestamp) < CACHE_DURATION) {
    console.log('💰 Usando TRM en cache:', trmCache);
    return trmCache;
  }

  try {
    console.log('🔄 Obteniendo TRM fresca...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/trm`, {
      next: { revalidate: 3600 } // Cache de Next.js por 1 hora
    });

    if (!response.ok) {
      throw new Error(`Error fetching TRM: ${response.status}`);
    }

    const data: TRMResponse = await response.json();

    if (data.error && data.fallback) {
      console.warn('⚠️ Usando TRM fallback:', data.rate);
    } else {
      console.log('✅ TRM obtenida:', data.rate, data.cached ? '(cache servidor)' : '(fresca)');
    }

    // Actualizar cache
    trmCache = data.rate;
    trmTimestamp = now;

    return data.rate;
  } catch (error) {
    console.error('❌ Error obteniendo TRM:', error);

    // Fallback a una TRM razonable si falla todo
    const fallbackTRM = 0.00026; // ~1 COP = 0.00026 USD (enero 2025)
    console.warn('⚠️ Usando TRM fallback:', fallbackTRM);

    trmCache = fallbackTRM;
    trmTimestamp = now;

    return fallbackTRM;
  }
}

/**
 * Convierte un precio de COP a USD y le suma un markup de $20 USD
 * @param priceCOP - Precio en pesos colombianos (string o number)
 * @returns Precio en dólares estadounidenses con markup incluido
 */
export async function convertToUSD(priceCOP: string | number): Promise<number> {
  const numericPrice = typeof priceCOP === 'string' ? parseFloat(priceCOP) : priceCOP;

  if (isNaN(numericPrice) || numericPrice === 0) {
    return 20; // Retornar solo el markup si el precio base es 0
  }

  const trm = await getTRM();
  const priceUSD = numericPrice * trm;
  const adjustedPrice = priceUSD + 10; // Markup de $20 USD

  return adjustedPrice;
}

/**
 * Formatea un precio en dólares al estilo US ($1,234.56)
 * @param priceUSD - Precio en USD
 * @returns Precio formateado con símbolo de dólar
 */
export function formatUSD(priceUSD: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceUSD);
}

/**
 * Obtiene el precio en USD formateado directamente desde un precio en COP
 * @param priceCOP - Precio en pesos colombianos
 * @returns Precio formateado en USD (ej: "$123.45")
 */
export async function getPriceInUSD(priceCOP: string | number): Promise<string> {
  const priceUSD = await convertToUSD(priceCOP);
  return formatUSD(priceUSD);
}

/**
 * Obtiene el precio numérico en USD desde un precio en COP
 * @param priceCOP - Precio en pesos colombianos
 * @returns Precio numérico en USD
 */
export async function getNumericPriceInUSD(priceCOP: string | number): Promise<number> {
  return await convertToUSD(priceCOP);
}
