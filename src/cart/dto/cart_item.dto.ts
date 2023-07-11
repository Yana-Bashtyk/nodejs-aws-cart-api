import { IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @Min(1)
  count: number;

  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}