const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = new WooCommerceRestApi({
  url: 'https://toryskateshop.com',
  consumerKey: 'ck_1c90a1c8991b815180b8059868be4a58be58a6f2',
  consumerSecret: 'cs_24be99b3897309deeb197b76006f815fcfa17a01',
  version: 'wc/v3'
});

console.log('Obteniendo productos de la categoría Vans (ID: 20)...');

api.get('products', { 
  category: '20',
  per_page: 20,
  status: 'publish'
})
  .then(response => {
    console.log(`=== PRODUCTOS VANS ENCONTRADOS: ${response.data.length} ===`);
    response.data.forEach(product => {
      console.log(`ID: ${product.id}, Nombre: ${product.name}, Slug: ${product.slug}`);
      console.log(`Categorías: ${product.categories.map(cat => cat.name).join(', ')}`);
      console.log('---');
    });
  })
  .catch(error => {
    console.error('Error obteniendo productos Vans:', error.response?.data || error.message);
  });
