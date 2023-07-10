import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Cart } from '../models';
import { knex } from '../../../db/knexconfig';
@Injectable()
export class CartService {
  // private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string) {
    const cart = await knex('carts').where({ user_id: userId }).first();

    if (cart) {
      const items = await knex('cart_items').where({ cart_id: cart.id });
      cart.items = items;
    }
    return cart;
  }

  async createByUserId(userId: string) {
    const [newCart] = await knex('carts')
      .insert({
        user_id: userId,
        status: 'OPEN',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    return newCart;
  }

  async findOrCreateByUserId(userId: string) {
    let cart = await this.findByUserId(userId);

    if (!cart) {
      cart = await this.createByUserId(userId);
    }

    return cart;
  }

  async updateByUserId(userId: string, { items }: Cart) {
    const cart = await this.findOrCreateByUserId(userId);

    await knex('cart_items').where({ cart_id: cart.id }).del();

    const newItems = items.map((item) => ({
      cart_id: cart.id,
      product_id: item.product.id,
      count: item.count,
    }));
    await knex('cart_items').insert(newItems);

    // Update the cart's updated_at field
    await knex('carts').where({ id: cart.id }).update({ updated_at: new Date() });

    const updatedCart = await this.findByUserId(userId);
    return updatedCart;
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
