import { IsUUID, IsString, IsNumber } from 'class-validator';

export class ProductClass {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}