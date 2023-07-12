import { Controller, Get, Put } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { knex } from '../../db/knexconfig';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { Req, Body } from '@nestjs/common';

@Controller('api/profile/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders() {
    return await this.orderService.getOrders();
  }
}