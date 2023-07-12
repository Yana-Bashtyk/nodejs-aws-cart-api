import { type } from "os";

export type Product = {
  product_id: string,
  title: string,
  description: string,
  price: number,
};

export type ProductInTable = {
  id: string,
  title: string,
  description: string,
  price: number,
};

export type CartItem = {
  cart_id?: string;
  product: Product,
  count: number,
}

export type ItemsFromTable = {
  cart_id: string;
  product_id: string;
  count: number;
}

export type CartFromTables = {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  items: ItemsFromTable[]
}

export type CartItemInTable = {
  product_id: string,
  title: string,
  description: string,
  price: number,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
}
