# Conversión de Precios a Dólares

Este proyecto incluye un sistema automatizado para convertir precios de Pesos Colombianos (COP) a Dólares Estadounidenses (USD).

## Características

- ✅ Convierte automáticamente los precios del API de WooCommerce de COP a USD
- ✅ Usa la TRM (Tasa Representativa del Mercado) actualizada
- ✅ Cache inteligente para evitar múltiples requests a APIs externas
- ✅ Sistema de fallback si las APIs externas fallan
- ✅ Muestra precios formateados en estilo estadounidense ($1,234.56)

## Arquitectura

### Archivos Principales

1. **[API TRM](src/app/api/trm/route.ts)**
   - Endpoint que obtiene la TRM actual
   - Intenta múltiples APIs en orden de preferencia:
     - ExchangeRate-API (principal)
     - Fixer.io (backup, requiere API key)
     - Valor fallback si todo falla
   - Cache del lado del servidor (1 hora)

2. **[Servicio de Moneda](src/utils/currency.ts)**
   - Funciones para conversión y formateo de precios
   - Cache del lado del cliente (1 hora)
   - Manejo de errores robusto

3. **[Componentes de UI]**
   - [ProductCard](src/components/ProductCard.tsx) - Tarjeta de producto con precio en USD
   - [ProductPrice](src/components/ProductPrice.tsx) - Componente de precio reutilizable

4. **[Página Principal](src/app/page.tsx)**
   - Catálogo de productos con precios en USD

5. **[Página de Producto](src/app/productos/[slug]/page.tsx)**
   - Vista individual del producto con precio en USD
   - Precios formateados para mensajes de WhatsApp

## Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# URL del sitio (importante para el endpoint de TRM)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Opcional: API Key para Fixer.io (backup)
FIXER_API_KEY=your-api-key
```

### Producción

No olvides actualizar `NEXT_PUBLIC_SITE_URL` a tu dominio de producción:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## APIs Soportadas

### 1. ExchangeRate-API (Principal)
- ✅ Gratuita hasta 1,500 requests/mes
- ✅ No requiere API key para uso básico
- ✅ Muy confiable

### 2. Fixer.io (Backup)
- Gratuita hasta 100 requests/mes
- Requiere API key (regístrate en https://fixer.io/)
- Se usa solo si ExchangeRate-API falla

### 3. Fallback
- Valor por defecto: 0.00026 (aprox. Enero 2025)
- Solo se usa si ambas APIs fallan

## Uso

### En Componentes

```tsx
import { ProductPrice } from '@/components/ProductPrice';

<ProductPrice
  price={product.price}
  regularPrice={product.regular_price}
  salePrice={product.sale_price}
  onSale={product.on_sale}
  size="large"
/>
```

### Directamente en Código

```tsx
import { formatPrice } from '@/utils/miles';

// La función ahora convierte automáticamente de COP a USD
const priceUSD = await formatPrice(product.price); // "$123.45"
```

## Funcionamiento

1. **Obtener TRM**: La primera vez que se necesita un precio, se hace fetch al endpoint `/api/trm`
2. **Cache**: La TRM se cachea por 1 hora en memoria
3. **Conversión**: Cada precio se multiplica: `precio_COP * TRM = precio_USD`
4. **Formateo**: El resultado se formatea como moneda USD (`$1,234.56`)

## Cache Strategy

- **Servidor (Next.js)**: 1 hora usando `next: { revalidate: 3600 }`
- **Cliente (Browser)**: 1 hora en memoria
- **Fallback**: Si la API falla, se usa un valor por defecto razonable

## Troubleshooting

### Los precios muestran "$0.00"
- Verifica que los productos tengan precios en WooCommerce
- Revisa la consola del navegador para errores
- Verifica que la variable `NEXT_PUBLIC_SITE_URL` esté configurada correctamente

### La TRM no se actualiza
- El cache dura 1 hora, espera a que expire o reinicia el servidor
- Verifica que las APIs externas estén funcionando
- Revisa los logs de la consola para ver mensajes de error

### Error: "Failed to fetch"
- Verifica que `NEXT_PUBLIC_SITE_URL` sea correcta
- En desarrollo, asegúrate de que el servidor Next.js esté corriendo
- En producción, verifica que el dominio sea accesible
