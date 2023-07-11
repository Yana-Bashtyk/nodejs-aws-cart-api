import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models';
import { knex } from '../../../db/knexconfig';
import { use } from 'passport';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CartItemDto } from '../dto/cart_item.dto';
@Injectable()
export class CartService {
  async findByUserId(userId: string) {
    const cart = await knex('carts').where({ user_id: userId }).first();

    if (cart) {
      const items = await knex('cart_items').where({ cart_id: cart.id });
      cart.items = items;
    }
    return cart;
  }

  async createByUserId(userId: string) {
    console.log('createByUserId', userId);

    const cartId = uuidv4();
    await knex('carts')
      .insert({
        id: cartId,
        user_id: userId,
        status: 'OPEN',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    const emptyCart = { id: cartId, items: [] };
    return emptyCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    console.log('userId',userId);
    let cart = await this.findByUserId(userId);

    if (!cart) {
      cart = await this.createByUserId(userId);
    }

    return cart;
  }

  async updateByUserId(userId: string, cartItem: CartItemDto): Promise<Cart> {
    const trx = await knex.transaction();

    try {
      let cart = await trx('carts').where({ user_id: userId, status: 'OPEN' }).first();

      if (!cart) {
        const newCart = { id: uuidv4(), user_id: userId, status: 'OPEN', created_at: new Date(), updated_at: new Date() };
        await trx('carts').insert(newCart);
        cart = newCart;
      }

      console.log('updateByUserId' ,cart, cartItem)
      const existingCartItem = await trx('cart_items').where({ cart_id: cart.id, product_id: cartItem.id }).first();
  
      if (existingCartItem) {
        await trx('cart_items').where({ id: existingCartItem.id }).update({ count: cartItem.count });
      } else {
        const newCartItem = { cart_id: cart.id, product_id: cartItem.id, count: cartItem.count };
        await trx('cart_items').insert(newCartItem);
      }
      await trx.commit();

      const updatedCart = await knex('carts').where({ id: cart.id }).first();
      updatedCart.items = await knex('cart_items').where({ cart_id: cart.id });

      return updatedCart;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async removeByUserId(userId: string): Promise<string> {
    const trx = await knex.transaction();

    try {
      const cart = await trx('carts').where({ user_id: userId }).first();

      if (cart) {
        await trx('cart_items').where({ cart_id: cart.id }).del();
        await trx('carts').where({ id: cart.id }).del();
      }

      await trx.commit();
      return userId;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
