import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nomadashop.com.co/'
  const secciones = [
    '',           // Home (sin hash)
    '#adidas',    // Marcas
    '#nike',
    '#vans',  // Otras secciones
    '#running',
    '#dc'
  ]

  return secciones.map(seccion => ({
    url: `${baseUrl}/${seccion}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: seccion === '' ? 1 : 0.7, // Prioridad más alta para la home
  }))
}