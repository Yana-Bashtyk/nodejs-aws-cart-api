import { Cart, CartItem, Product } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart, products: Product[]): number {
  if (!cart) {
    return 0;
  }

  const productPriceMap = new Map<string, number>();
  products.forEach((product) => {
    productPriceMap.set(product.id, product.price);
  });

  return cart.items.reduce((acc: number, { product_id, count }: CartItem) => {
    const price = productPriceMap.get(product_id) || 0;
    return acc + price * count;
  }, 0);
}
