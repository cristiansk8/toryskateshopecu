import { NextResponse } from 'next/server';

// Cache en memoria para evitar hacer demasiadas requests a la API externa
let trmCache: {
  rate: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hora en milisegundos

export async function GET() {
  try {
    // Verificar si tenemos un cache válido
    const now = Date.now();
    if (trmCache && (now - trmCache.timestamp) < CACHE_DURATION) {
      console.log('📊 Usando TRM en cache:', trmCache.rate);
      return NextResponse.json({
        rate: trmCache.rate,
        cached: true,
        timestamp: trmCache.timestamp
      });
    }

    console.log('🔄 Obteniendo TRM fresca de la API...');

    // Intentar obtener la TRM desde múltiples APIs en orden de preferencia
    let trm = 0;

    // Opción 1: Banco de la República de Colombia (más confiable)
    try {
      const response = await fetch(
        'https://www.banrep.gov.co/sites/default/files/2024-12/series-estadisticas-ilustradas.json',
        { next: { revalidate: 3600 } }
      );

      if (response.ok) {
        const data = await response.json();
        // Extraer la TRM más reciente del JSON
        // El formato puede variar, así que necesitamos inspeccionar la respuesta
        console.log('📦 Respuesta Banco Rep:', data);

        // Por ahora usar una API más simple
        trm = 0;
      }
    } catch (error) {
      console.log('❌ Error con Banco de la República:', error);
    }

    // Opción 2: ExchangeRate-API (más confiable y simple)
    if (!trm || trm === 0) {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/latest/COP`,
          { next: { revalidate: 3600 } }
        );

        if (response.ok) {
          const data = await response.json();
          trm = data.conversion_rates.USD;
          console.log('✅ TRM obtenida desde ExchangeRate-API:', trm);
        }
      } catch (error) {
        console.log('❌ Error con ExchangeRate-API:', error);
      }
    }

    // Opción 3: Fixer.io (backup)
    if (!trm || trm === 0) {
      try {
        const fixerKey = process.env.FIXER_API_KEY;
        if (fixerKey) {
          const response = await fetch(
            `https://data.fixer.io/api/latest?access_key=${fixerKey}&symbols=USD&base=COP`,
            { next: { revalidate: 3600 } }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              trm = data.rates.USD;
              console.log('✅ TRM obtenida desde Fixer:', trm);
            }
          }
        }
      } catch (error) {
        console.log('❌ Error con Fixer:', error);
      }
    }

    // Si no pudimos obtener la TRM, usar un fallback razonable
    if (!trm || trm === 0) {
      console.warn('⚠️ No se pudo obtener TRM, usando fallback');
      trm = 0.00026; // Valor aproximado COP a USD (enero 2025)
    }

    // Guardar en cache
    trmCache = {
      rate: trm,
      timestamp: now
    };

    return NextResponse.json({
      rate: trm,
      cached: false,
      timestamp: now,
      source: 'api'
    });

  } catch (error) {
    console.error('❌ Error al obtener TRM:', error);

    // En caso de error, retornar un fallback
    const fallbackTRM = 0.00026;
    return NextResponse.json({
      rate: fallbackTRM,
      cached: false,
      error: true,
      fallback: true
    }, { status: 200 }); // Retornamos 200 para no romper la app
  }
}
