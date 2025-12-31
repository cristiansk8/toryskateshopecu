'use server'

export interface ProductVariation {
  id: number;
  attributes: {
    name: string;
    option: string;
  }[];
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity?: number;
}

export async function getVariations(productId: string | number) {
  const consumer_key = process.env.CONSUMER_KEY;
  const consumer_secret = process.env.CONSUMER_SECRET;
  const api = process.env.urlAPI;

  // Verifica que las credenciales estén definidas
  if (!consumer_key || !consumer_secret || !api) {
    return {
      message: 'Consumer key, secret, or API URL is missing',
      status: 500
    };
  }

  try {
    const response = await fetch(`${api}/products/${productId}/variations`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')}`,
      },
      next: { tags: [`product-${productId}-variations`] }
    });

    if (!response.ok) {
      // Devuelve un mensaje de error con el estado de la respuesta
      const errorMessage = `Error fetching variations: ${response.statusText}`;
      return {
        message: errorMessage,
        status: response.status
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Usa la variable `error` para devolver un mensaje más detallado
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      message: 'Error fetching product variations',
      error: errorMessage,
      status: 500
    };
  }
}