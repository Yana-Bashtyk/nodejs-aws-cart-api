import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItemDto } from './dto/cart_item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { knex } from '../../db/knexconfig';
import { ProductInTable } from '../cart/models/index';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

    const products: ProductInTable[] = await knex('products').select('*');

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart, products) },
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: CartItemDto) {
    console.log('updateUserCart',body )
    const cart = await this.cartService.updateByUserId(getUserIdFromRequest(req), body);
    const products: ProductInTable[] = await knex('products').select('*');

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart, products),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    const removed = await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: {message: `Removed cart by user id: ${removed}`},
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: CheckoutDto) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const products: ProductInTable[] = await knex('products').select('*');

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart, products);

    let order;
    try {
       await knex.transaction(async (trx) => {
        order = await this.orderService.create(
          {
            payment: {},
            delivery: JSON.stringify(body.address),
            comments: JSON.stringify(body.address.comment),
            user_id: userId,
            cart_id: cartId,
            total,
          },
          trx,
        );

        return await this.cartService.updateStatusByUserId(userId, 'ORDERED', trx);
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Checkout failed',
      };
    }

     return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
