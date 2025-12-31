'use server'

export async function getProductBySlug(slug: string) {
  const consumer_key2 = process.env.CONSUMER_KEY;
  const consumer_secret2 = process.env.CONSUMER_SECRET;
  const api = process.env.urlAPI;

  if (!consumer_key2 || !consumer_secret2) {
    return { message: 'Consumer key or secret is missing', status: 500 };
  }

  try {
    const response = await fetch(`${api}/products?slug=${slug}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${consumer_key2}:${consumer_secret2}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Error fetching product: ${response.statusText}`;
      return { message: errorMessage, status: response.status };
    }

    const data = await response.json();
    // WooCommerce devuelve un array, aunque solo haya uno
    return data[0] || null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error : 'Unknown error';
    return { message: 'Error fetching product', error: errorMessage, status: 500 };
  }
}