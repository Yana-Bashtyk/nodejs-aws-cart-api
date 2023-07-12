import { IsNumber, Min, IsUUID, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class ProductDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}

export class CartItemDto {
  @IsNumber()
  @Min(1)
  count: number;

  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;
}