export interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
  categories?: ProductCategory[];
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  permalink?: string;
  status: string;
}
export interface Slide {
  id: string; // Ahora es obligatorio
  desktop: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  mobile: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  link: string;
  title?: string;
  description?: string;
}
// Tipo para productos con imágenes garantizadas
export type ProductWithImages = Omit<Product, 'images'> & {
  images: ProductImage[]; // Images ahora es obligatorio
};