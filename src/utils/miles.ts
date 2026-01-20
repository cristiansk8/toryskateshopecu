// utils/miles.ts
import { convertToUSD } from './currency';

/**
 * Formatea un precio de COP a USD con markup de $20 incluido
 * Esta es la función principal que deben usar todos los componentes
 */
export const formatPrice = async (price: string | number): Promise<string> => {
  // convertToUSD ya incluye el markup de $20 USD
  const priceUSD = await convertToUSD(price);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceUSD);
};