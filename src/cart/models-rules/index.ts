import { CartFromTables, CartItem, ProductInTable } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: CartFromTables, products: ProductInTable[]): number {
  if (!cart) {
    return 0;
  }

  const productPriceMap = new Map<string, number>();
  products.forEach((product) => {
    productPriceMap.set(product.id, product.price);
  });

  console.log('calculateCartTotal', cart)
  return cart.items.reduce((acc: number, { product_id, count }) => {
    const price = productPriceMap.get(product_id) || 0;
    return acc + price * count;
  }, 0);
}
