import { IsJSON, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsJSON()
  payment: object;

  @IsJSON()
  delivery: object;

  @IsOptional()
  @IsString()
  comments?: string;
}