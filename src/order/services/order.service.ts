import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Knex } from 'knex';
import { knex } from '../../../db/knexconfig';
import { Order } from '../models';

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}

  async findById(orderId: string): Promise<Order> {
    const order = await knex('orders').where('id', orderId).first();
    return order;
  }

  async create(data: any, trx: Knex.Transaction): Promise<Order> {
    const id = v4()
    const order = {
      ...data,
      id,
      status: 'OPEN',
    };

    await trx('orders').insert(order);
    return order;
  }

  async update(orderId: string, data: any) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await knex('orders').where('id', orderId).update(data);
  }

  async getOrders(): Promise<any[]> {
    const orders = await knex('orders').select('*');
    return orders;
  }
}
